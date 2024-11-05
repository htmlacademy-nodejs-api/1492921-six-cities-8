import { ClassConstructor, plainToInstance } from 'class-transformer';
import { ValidationError } from 'class-validator';
import { ApplicationError, TValidationErrorField } from '../libs/rest/index.js';

const generateRandomValue = (min: number, max: number, numAfterDigit = 0) =>
  +(Math.random() * (max - min) + min).toFixed(numAfterDigit);

const getRandomItems = <T>(items: T[] | readonly T[], count?: number): T[] =>
  items
    .toSorted(() => 0.5 - Math.random())
    .slice(0, count ?? generateRandomValue(1, items.length));

const getRandomItem = <T>(items: T[] | readonly T[]): T =>
  items[generateRandomValue(0, items.length - 1)];

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : '';

function fillDTO<T, V>(someDto: ClassConstructor<T>, plainObject: V) {
  return plainToInstance(someDto, plainObject, {
    excludeExtraneousValues: true,
  });
}

function createErrorObject(
  errorType: ApplicationError,
  error: string,
  details: TValidationErrorField[] = []
) {
  return { errorType, error, details };
}

const validateEmail = (email: string): boolean => {
  const regExpEmail: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return regExpEmail.test(email);
};
function reduceValidationErrors(
  errors: ValidationError[]
): TValidationErrorField[] {
  return errors.map(({ property, value, constraints }) => ({
    property,
    value,
    messages: constraints ? Object.values(constraints) : [],
  }));
}

function getFullServerPath(host: string, port: number) {
  return `http://${host}:${port}`;
}

export {
  generateRandomValue,
  getRandomItems,
  getRandomItem,
  getErrorMessage,
  fillDTO,
  createErrorObject,
  validateEmail,
  reduceValidationErrors,
  getFullServerPath,
};
