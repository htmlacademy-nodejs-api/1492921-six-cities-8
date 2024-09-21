import { TUser } from './user.type.js';

type TComment = {
  id: string;
  offerId: string;
  comment: string;
  date: string;
  user: TUser;
};

export type { TComment };
