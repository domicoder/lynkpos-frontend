/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref } from 'vue';
import type { ApiError } from './types';

export interface ErrorNotification {
  id: string;
  error: ApiError;
  timestamp: number;
  read: boolean;
}

class ErrorManager {
  private static instance: ErrorManager;
  private errors = ref<ErrorNotification[]>([]);
  private handlers = new Map<string, (error: ApiError) => void>();

  private constructor() {}

  static getInstance(): ErrorManager {
    if (!ErrorManager.instance) {
      ErrorManager.instance = new ErrorManager();
    }

    return ErrorManager.instance;
  }

  handleError(error: any, context?: string): ApiError {
    const apiError = this.normalizeError(error, context);

    const notification: ErrorNotification = {
      id: this.generateId(),
      error: apiError,
      timestamp: Date.now(),
      read: false,
    };

    this.errors.value.unshift(notification);

    if (this.errors.value.length > 50) {
      this.errors.value = this.errors.value.slice(0, 50);
    }

    this.executeHandlers(apiError);

    this.logError(apiError, context);

    return apiError;
  }

  private normalizeError(error: any, context?: string): ApiError {
    if (error.response) {
      return {
        message:
          error.response.data?.message ||
          error.message ||
          'Error en la respuesta del servidor',
        code: error.response.data?.code || `HTTP_${error.response.status}`,
        status: error.response.status,
        details: {
          context,
          url: error.config?.url,
          method: error.config?.method,
          data: error.response.data,
        },
      };
    }

    if (error.request) {
      return {
        message: 'Error de conexión. Verifique su conexión a internet.',
        code: 'NETWORK_ERROR',
        status: 0,
        details: {
          context,
          url: error.config?.url,
          method: error.config?.method,
        },
      };
    }

    if (error.message && error.message.includes('VALIDATION_ERROR')) {
      const validationData = JSON.parse(error.message);

      return {
        message: 'Datos inválidos',
        code: 'VALIDATION_ERROR',
        status: 400,
        details: {
          context,
          errors: validationData.errors,
        },
      };
    }

    return {
      message: error.message || 'Error desconocido',
      code: 'UNKNOWN_ERROR',
      status: 500,
      details: {
        context,
        originalError: error,
      },
    };
  }

  private executeHandlers(error: ApiError): void {
    const globalHandler = this.handlers.get('global');

    if (globalHandler) {
      globalHandler(error);
    }

    const codeHandler = this.handlers.get(error.code);

    if (codeHandler) {
      codeHandler(error);
    }

    const statusHandler = this.handlers.get(`status_${error.status}`);

    if (statusHandler) {
      statusHandler(error);
    }
  }

  private logError(error: ApiError, context?: string): void {
    const logData = {
      ...error,
      context,
      timestamp: new Date().toISOString(),
    };

    if (error.status >= 500) {
      console.error('Server Error:', logData);
    } else if (error.status >= 400) {
      console.warn('Client Error:', logData);
    } else {
      console.info('Request Error:', logData);
    }
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  registerHandler(key: string, handler: (error: ApiError) => void): void {
    this.handlers.set(key, handler);
  }

  unregisterHandler(key: string): void {
    this.handlers.delete(key);
  }

  getErrors() {
    return this.errors.value;
  }

  markAsRead(id: string): void {
    const error = this.errors.value.find((e) => e.id === id);

    if (error) {
      error.read = true;
    }
  }

  clearErrors(): void {
    this.errors.value = [];
  }

  clearError(id: string): void {
    const index = this.errors.value.findIndex((e) => e.id === id);

    if (index !== -1) {
      this.errors.value.splice(index, 1);
    }
  }

  setupDefaultHandlers(): void {
    this.registerHandler('status_401', (error) => {
      console.warn('Token expirado o inválido:', error);
    });

    this.registerHandler('status_403', (error) => {
      console.warn('Acceso denegado:', error);
    });

    this.registerHandler('status_404', (error) => {
      console.info('Recurso no encontrado:', error);
    });

    this.registerHandler('status_500', (error) => {
      console.error('Error interno del servidor:', error);
    });
  }
}

export default ErrorManager;
