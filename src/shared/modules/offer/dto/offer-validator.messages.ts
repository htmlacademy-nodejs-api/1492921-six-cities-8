import {
  BedroomsLimit,
  cityNames,
  DescriptionLength,
  ImagesLimit,
  MaxAdultsLimit,
  PriceLimit,
  TitleLength,
} from '../../../../const/index.js';

export const OfferValidationMessage = {
  title: {
    minLength: `Minimum title length must be ${TitleLength.min}`,
    maxLength: `Maximum title length must be ${TitleLength.max}`,
    invalidFormat: 'Title must be a string',
  },
  description: {
    minLength: `Minimum description length must be ${DescriptionLength.min}`,
    maxLength: `Maximum description length must be ${DescriptionLength.max}`,
  },
  date: {
    invalidFormat: 'date must be a valid ISO date',
  },
  city: {
    invalidFormat: 'Invalid city object',
    invalid: `Invalid city name. Name must be ${cityNames.join(', ')}`,
  },
  previewImage: {
    invalidFormat: 'Field previewImage must be URL',
  },
  images: {
    invalidFormat: 'Field images must be an array',
    length: `Field images must contain ${ImagesLimit.max} elements`,
    invalidElements: 'The array elements must be URLs',
  },
  isPremium: {
    invalidFormat: 'Field isPremium must be boolean',
  },
  type: {
    invalid: 'type must be apartment, house, room or hotel',
  },
  bedrooms: {
    invalidFormat: 'Bedrooms must be an integer',
    minValue: `Minimum bedrooms is ${BedroomsLimit.min}`,
    maxValue: `Maximum bedrooms is ${BedroomsLimit.max}`,
  },
  maxAdults: {
    invalidFormat: 'MaxAdults must be an integer',
    minValue: `Minimum maxAdults is ${MaxAdultsLimit.min}`,
    maxValue: `Maximum maxAdults is ${MaxAdultsLimit.max}`,
  },
  price: {
    invalidFormat: 'Price must be an integer',
    minValue: `Minimum price is ${PriceLimit.min}`,
    maxValue: `Maximum price is ${PriceLimit.max}`,
  },
  goods: {
    invalidFormat: 'Field goods must be an array',
    invalidElements:
      'The array elements must be one or more options from the list: Breakfast, Air conditioning, Laptop friendly workspace, Baby seat, Washer, Towels, Fridge',
  },
  hostId: {
    invalidId: 'hostId field must be a valid id',
  },
  location: {
    invalidFormat: 'Field location must be object',
    invalidLatitude: 'Latitude must be correct value',
    invalidLongitude: 'Longitude must be correct value',
  },
} as const;
