/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ApiResponse } from '@/services/api/types';

/**
 * Verifica si una respuesta es exitosa
 */
export function isSuccessResponse<T>(response: ApiResponse<T>): boolean {
  return response.status >= 200 && response.status < 300;
}

/**
 * Verifica si un error es de red
 */
export function isNetworkError(error: any): boolean {
  return !error.response && error.request;
}

/**
 * Verifica si un error es de validación
 */
export function isValidationError(error: any): boolean {
  return error.code === 'VALIDATION_ERROR';
}

/**
 * Verifica si un error es de autenticación
 */
export function isAuthError(error: any): boolean {
  return error.status === 401 || error.status === 403;
}

/**
 * Extrae el mensaje de error de forma segura
 */
export function getErrorMessage(error: any): string {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  if (error?.response?.data?.message) return error.response.data.message;

  return 'Error desconocido';
}

export function getBadMessage(error: unknown, defaultMessage: string): string {
  if (
    error &&
    typeof error === 'object' &&
    'badMessage' in error &&
    typeof error.badMessage === 'string'
  ) {
    return error.badMessage;
  }

  return defaultMessage;
}

/**
 * Extrae los detalles de validación de un error
 */
export function getValidationErrors(
  error: any,
): Array<{ field: string; message: string }> {
  if (isValidationError(error) && error.details?.errors) {
    return error.details.errors;
  }

  return [];
}

/**
 * Formatea un error para mostrar al usuario
 */
export function formatErrorForUser(error: any): string {
  if (isNetworkError(error)) {
    return 'Error de conexión. Verifique su conexión a internet.';
  }

  if (isAuthError(error)) {
    return 'Su sesión ha expirado. Por favor, inicie sesión nuevamente.';
  }

  if (isValidationError(error)) {
    const validationErrors = getValidationErrors(error);

    if (validationErrors.length > 0) {
      return `Datos inválidos: ${validationErrors.map((e) => e.message).join(', ')}`;
    }
  }

  return getErrorMessage(error);
}

/**
 * Crea un delay para retry
 */
export function createRetryDelay(
  attempt: number,
  baseDelay: number = 1000,
): number {
  return baseDelay * Math.pow(2, attempt - 1);
}

/**
 * Valida si un endpoint requiere autenticación
 */
export function requiresAuth(endpoint: string): boolean {
  const publicEndpoints = [
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/public',
    '/health',
  ];

  return !publicEndpoints.some((publicEndpoint) =>
    endpoint.startsWith(publicEndpoint),
  );
}

/**
 * Genera una key única para caché
 */
export function generateCacheKey(
  method: string,
  url: string,
  params?: Record<string, any>,
): string {
  const paramsStr = params
    ? JSON.stringify(params, Object.keys(params).sort())
    : '';

  return `${method.toUpperCase()}:${url}:${paramsStr}`;
}

/**
 * Debounce function para búsquedas
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function para requests frecuentes
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Convierte FormData a objeto para debugging
 */
export function formDataToObject(formData: FormData): Record<string, any> {
  const obj: Record<string, any> = {};

  for (const [key, value] of formData.entries()) {
    if (obj[key]) {
      if (Array.isArray(obj[key])) {
        obj[key].push(value);
      } else {
        obj[key] = [obj[key], value];
      }
    } else {
      obj[key] = value;
    }
  }

  return obj;
}

/**
 * Valida si un archivo es válido para upload
 */
export function validateFile(
  file: File,
  options: {
    maxSize?: number;
    allowedTypes?: string[];
    allowedExtensions?: string[];
  } = {},
): { valid: boolean; error?: string } {
  const {
    maxSize = 10 * 1024 * 1024,
    allowedTypes = [],
    allowedExtensions = [],
  } = options;

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `El archivo no puede ser mayor a ${Math.round(maxSize / 1024 / 1024)}MB`,
    };
  }

  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Tipo de archivo no permitido. Tipos permitidos: ${allowedTypes.join(', ')}`,
    };
  }

  if (allowedExtensions.length > 0) {
    const extension = file.name.split('.').pop()?.toLowerCase();

    if (!extension || !allowedExtensions.includes(extension)) {
      return {
        valid: false,
        error: `Extensión no permitida. Extensiones permitidas: ${allowedExtensions.join(', ')}`,
      };
    }
  }

  return { valid: true };
}

/**
 * Calcula el progreso de upload
 */
export function calculateUploadProgress(loaded: number, total: number): number {
  if (total === 0) return 0;

  return Math.round((loaded / total) * 100);
}

/**
 * Formatea el tamaño de archivo
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Genera un ID único para requests
 */
export function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Verifica si estamos en modo offline
 */
export function isOffline(): boolean {
  return !navigator.onLine;
}

/**
 * Maneja la reconexión automática
 */
export function handleReconnection(callback: () => void): () => void {
  const handleOnline = () => {
    callback();
  };

  window.addEventListener('online', handleOnline);

  return () => {
    window.removeEventListener('online', handleOnline);
  };
}

/**
 * Crea un timeout con Promise
 */
export function createTimeout(ms: number): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Timeout')), ms);
  });
}

/**
 * Race entre una Promise y un timeout
 */
export function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([promise, createTimeout(ms)]);
}

export default {
  isSuccessResponse,
  isNetworkError,
  isValidationError,
  isAuthError,
  getErrorMessage,
  getBadMessage,
  getValidationErrors,
  formatErrorForUser,
  createRetryDelay,
  requiresAuth,
  generateCacheKey,
  debounce,
  throttle,
  formDataToObject,
  validateFile,
  calculateUploadProgress,
  formatFileSize,
  generateRequestId,
  isOffline,
  handleReconnection,
  createTimeout,
  withTimeout,
};
