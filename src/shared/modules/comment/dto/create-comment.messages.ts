export const CreateCommentMessages = {
  comment: {
    minLength: 'Minimum comment length must be 5',
    maxLength: 'Maximum comment length must be 1024',
    invalidFormat: 'Title must be a string',
  },
  userId: {
    invalidId: 'userId field must be a valid id',
  },
  offerId: {
    invalidId: 'offerId field must be a valid id',
  },
  rating: {
    invalidFormat: 'Rating must be an number',
    minValue: 'Minimum rating is 1',
    maxValue: 'Maximum rating is 5',
  },
};
