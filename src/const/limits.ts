import { TRange } from '../shared/types/index.js';

const DefaultCount = {
  offer: 60,
  premium: 3,
  comment: 50,
} as const;

const TitleLength: TRange = { min: 10, max: 100 } as const;
const DescriptionLength: TRange = { min: 20, max: 1024 } as const;
const CommentLength: TRange = { min: 5, max: 1024 } as const;
const ImagesLimit: TRange = { min: 6, max: 6 } as const;
const PriceLimit: TRange = { min: 100, max: 100000 } as const;
const BedroomsLimit: TRange = { min: 1, max: 8 } as const;
const MaxAdultsLimit: TRange = { min: 1, max: 10 } as const;
const RatingLimit: TRange = { min: 1, max: 5 } as const;

export {
  TitleLength,
  DescriptionLength,
  CommentLength,
  DefaultCount,
  ImagesLimit,
  PriceLimit,
  BedroomsLimit,
  MaxAdultsLimit,
  RatingLimit,
};
