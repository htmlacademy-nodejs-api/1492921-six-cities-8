import { TRange } from '../../types/range.type.js';

const DefaultCount = {
  offer: 60,
  premium: 3,
} as const;

const ImagesLimit: TRange = { min: 6, max: 6 } as const;
const PriceLimit: TRange = { min: 100, max: 100000 } as const;
const bedroomsLimit: TRange = { min: 1, max: 8 } as const;
const maxAdultsLimit: TRange = { min: 1, max: 10 } as const;
const RatingLimit: TRange = { min: 1, max: 5 } as const;

export {
  DefaultCount,
  ImagesLimit,
  PriceLimit,
  bedroomsLimit,
  maxAdultsLimit,
  RatingLimit,
};
