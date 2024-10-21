export const OfferValidationMessage = {
  title: {
    minLength: 'Minimum title length must be 10',
    maxLength: 'Maximum title length must be 100',
    invalidFormat: 'Title must be a string',
  },
  description: {
    minLength: 'Minimum description length must be 20',
    maxLength: 'Maximum description length must be 1024',
  },
  date: {
    invalidFormat: 'date must be a valid ISO date',
  },
  city: {
    invalid: 'Invalid city object',
  },
  previewImage: {
    invalidFormat: 'Field previewImage must be URL',
  },
  images: {
    invalidFormat: 'Field images must be an array',
    length: 'Field images must contain 6 elements',
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
    minValue: 'Minimum bedrooms is 1',
    maxValue: 'Maximum bedrooms is 8',
  },
  maxAdults: {
    invalidFormat: 'MaxAdults must be an integer',
    minValue: 'Minimum maxAdults is 1',
    maxValue: 'Maximum maxAdults is 10',
  },
  price: {
    invalidFormat: 'Price must be an integer',
    minValue: 'Minimum price is 100',
    maxValue: 'Maximum price is 200000',
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
  },
} as const;
