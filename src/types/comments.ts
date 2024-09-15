import { TUser } from './user.js';

type TComment = {
  id: string;
  offerId: string;
  comment: string;
  date: string;
  user: TUser;
};

export type { TComment };
