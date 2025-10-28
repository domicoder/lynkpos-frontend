/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from 'zod';

export interface ValidationRule {
  field: string;
  rules: z.ZodType<any>;
  message?: string;
}

export interface ValidationSchema {
  [key: string]: z.ZodType<any>;
}

class ValidationManager {
  private static instance: ValidationManager;
  private schemas = new Map<string, z.ZodSchema<any>>();

  private constructor() {}

  static getInstance(): ValidationManager {
    if (!ValidationManager.instance) {
      ValidationManager.instance = new ValidationManager();
    }

    return ValidationManager.instance;
  }

  registerSchema(name: string, schema: z.ZodSchema<any>): void {
    this.schemas.set(name, schema);
  }

  validate<T>(schemaName: string, data: unknown): T {
    const schema = this.schemas.get(schemaName);

    if (!schema) {
      throw new Error(`Schema '${schemaName}' not found`);
    }

    try {
      return schema.parse(data) as T;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
        }));

        throw new Error(
          JSON.stringify({
            type: 'VALIDATION_ERROR',
            errors: formattedErrors,
          }),
        );
      }
      throw error;
    }
  }

  validateData<T>(schema: z.ZodSchema<T>, data: unknown): T {
    try {
      return schema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
        }));

        throw new Error(
          JSON.stringify({
            type: 'VALIDATION_ERROR',
            errors: formattedErrors,
          }),
        );
      }
      throw error;
    }
  }

  static readonly commonSchemas = {
    email: z.string().email('Email inválido'),
    password: z.string().min(8, 'Password debe tener al menos 8 caracteres'),
    id: z.number().positive('ID debe ser positivo'),
    uuid: z.string().uuid('UUID inválido'),
    url: z.string().url('URL inválida'),
    phone: z.string().regex(/^\+?[\d\s\-()]+$/, 'Teléfono inválido'),

    pagination: z.object({
      page: z.number().min(1, 'Página debe ser mayor a 0'),
      limit: z.number().min(1).max(100, 'Límite debe estar entre 1 y 100'),
    }),

    file: z.object({
      name: z.string().min(1, 'Nombre de archivo requerido'),
      size: z.number().positive('Tamaño de archivo inválido'),
      type: z.string().min(1, 'Tipo de archivo requerido'),
    }),
  };

  registerCommonSchemas(): void {
    Object.entries(ValidationManager.commonSchemas).forEach(
      ([name, schema]) => {
        this.registerSchema(name, schema);
      },
    );
  }
}

export default ValidationManager;
