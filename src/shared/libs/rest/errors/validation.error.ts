import { StatusCodes } from 'http-status-codes';

import { HttpError } from './http-error.js';
import { TValidationErrorField } from '../types/validation-error-field.type.js';

export class ValidationError extends HttpError {
  public details: TValidationErrorField[] = [];

  constructor(message: string, errors: TValidationErrorField[]) {
    super(StatusCodes.BAD_REQUEST, message);
    this.details = errors;
  }
}
