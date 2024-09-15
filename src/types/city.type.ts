import { Cities, cityNames } from '@src/const/data.js';
import { TPoint } from './offer.type.js';

type TCityName = keyof typeof Cities;

type TCity = {
  name: string;
  location: TPoint;
};

export type { TCityName, TCity };
