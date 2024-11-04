import { CommentLength, RatingLimit } from '../../../../const/index.js';

export const CreateCommentMessages = {
  comment: {
    minLength: `Minimum comment length must be ${CommentLength.min}`,
    maxLength: `Maximum comment length must be ${CommentLength.max}`,
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
    minValue: `Minimum rating is ${RatingLimit.min}`,
    maxValue: `Maximum rating is ${RatingLimit.max}`,
  },
};
