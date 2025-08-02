import { Request, Response, NextFunction } from 'express';

export interface ValidationRule {
  field: string;
  required?: boolean;
  type?: 'string' | 'email' | 'number' | 'array';
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
}

export const validateRequest = (rules: ValidationRule[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors: string[] = [];
    const body = req.body;

    for (const rule of rules) {
      const value = body[rule.field];

      // Check if required
      if (rule.required && (value === undefined || value === null || value === '')) {
        errors.push(`${rule.field} is required`);
        continue;
      }

      // Skip validation if value is not provided and not required
      if (value === undefined || value === null) {
        continue;
      }

      // Type validation
      if (rule.type) {
        switch (rule.type) {
          case 'string':
            if (typeof value !== 'string') {
              errors.push(`${rule.field} must be a string`);
            }
            break;
          case 'email':
            if (typeof value !== 'string' || !isValidEmail(value)) {
              errors.push(`${rule.field} must be a valid email`);
            }
            break;
          case 'number':
            if (typeof value !== 'number' || isNaN(value)) {
              errors.push(`${rule.field} must be a number`);
            }
            break;
          case 'array':
            if (!Array.isArray(value)) {
              errors.push(`${rule.field} must be an array`);
            }
            break;
        }
      }

      // Length validation for strings
      if (rule.type === 'string' && typeof value === 'string') {
        if (rule.minLength && value.length < rule.minLength) {
          errors.push(`${rule.field} must be at least ${rule.minLength} characters`);
        }
        if (rule.maxLength && value.length > rule.maxLength) {
          errors.push(`${rule.field} must be at most ${rule.maxLength} characters`);
        }
      }

      // Pattern validation
      if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
        errors.push(`${rule.field} format is invalid`);
      }

      // Custom validation
      if (rule.custom) {
        const result = rule.custom(value);
        if (result !== true) {
          errors.push(typeof result === 'string' ? result : `${rule.field} is invalid`);
        }
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors
      });
    }

    next();
  };
};

// Email validation helper
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Common validation rules
export const authValidation = {
  register: [
    { field: 'username', required: true, type: 'string' as const, minLength: 3, maxLength: 30 },
    { field: 'email', required: true, type: 'email' as const },
    { field: 'password', required: true, type: 'string' as const, minLength: 6 },
    { field: 'firstName', required: true, type: 'string' as const, minLength: 2, maxLength: 50 },
    { field: 'lastName', required: true, type: 'string' as const, minLength: 2, maxLength: 50 }
  ],
  login: [
    { field: 'email', required: true, type: 'email' as const },
    { field: 'password', required: true, type: 'string' as const }
  ]
};

export const matchValidation = {
  create: [
    { field: 'type', required: true, type: 'string' as const },
    { field: 'playerIds', required: true, type: 'array' as const, custom: (value: any[]) => value.length === 4 ? true : 'Must have exactly 4 players' }
  ],
  update: [
    { field: 'status', required: false, type: 'string' as const }
  ]
};

export const eventValidation = {
  create: [
    { field: 'matchId', required: true, type: 'string' as const },
    { field: 'playerId', required: true, type: 'string' as const },
    { field: 'eventType', required: true, type: 'string' as const }
  ]
}; 