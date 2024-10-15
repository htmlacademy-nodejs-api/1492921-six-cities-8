import { ClassConstructor, plainToInstance } from 'class-transformer';

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

function createErrorObject(message: string) {
  return {
    error: message,
  };
}

export {
  generateRandomValue,
  getRandomItems,
  getRandomItem,
  getErrorMessage,
  fillDTO,
  createErrorObject,
};
