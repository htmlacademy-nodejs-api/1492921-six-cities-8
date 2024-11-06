import { toast } from 'react-toastify';
import { HttpCode, MAX_PERCENT_STARS_WIDTH, STARS_COUNT } from './const';
import { AxiosError } from 'axios';

export type ValidationErrorField = {
  property: string;
  value: string;
  messages: string[];
};

export const formatDate = (date: string) =>
  new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(
    new Date(date)
  );

export const getStarsWidth = (rating: number) =>
  `${(MAX_PERCENT_STARS_WIDTH * Math.round(rating)) / STARS_COUNT}%`;

export const getRandomElement = <T>(array: readonly T[]): T =>
  array[Math.floor(Math.random() * array.length)];
export const pluralize = (str: string, count: number) =>
  count === 1 ? str : `${str}s`;
export const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

export class Token {
  private static _name = 'six-cities-auth-token';

  static get() {
    const token = localStorage.getItem(this._name);

    return token ?? '';
  }

  static save(token: string) {
    localStorage.setItem(this._name, token);
  }

  static drop() {
    localStorage.removeItem(this._name);
  }
}

const handleValidationError = (detail: ValidationErrorField) =>
  detail.messages.forEach((message: string) =>
    toast.info(`${detail.property} - ${message}`)
  );

export const handleAxiosError = ({ response }: AxiosError): void => {
  if (!response) {
    return;
  }

  toast.dismiss();
  const { status, data } = response;
  const { details, error } = data;

  switch (status) {
    case HttpCode.BadRequest:
      details
        ? details.forEach(handleValidationError)
        : toast.info(response.data.message);
      break;
    default:
      toast.warn(error);
  }
};
