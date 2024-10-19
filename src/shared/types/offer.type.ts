import { OFFER_GOODS, OFFER_TYPES } from '../../const/index.js';
import { TCity, TUser } from './index.js';

type TOfferType = (typeof OFFER_TYPES)[number];
type TOfferGoods = (typeof OFFER_GOODS)[number];

type TPoint = {
  latitude: number;
  longitude: number;
};

// type Location = Point & {
//   zoom: number;
// };

type TOffer = {
  //id: string;
  title: string;
  description: string;
  date: string;
  city: TCity;
  previewImage: string;
  images: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  type: TOfferType;
  bedrooms: number;
  maxAdults: number;
  price: number;
  goods: TOfferGoods[];
  host: TUser;
  location: TPoint;
};

export type { TPoint, TOfferType, TOffer, TOfferGoods };
