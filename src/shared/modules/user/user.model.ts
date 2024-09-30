import { Schema, Document, model } from 'mongoose';
import { TUser } from '../../types/index.js';

export interface IUserDocument extends TUser, Document {}

const userSchema = new Schema({
  name: String,
  email: String,
  avatarUrl: String,
  password: String,
  isPro: Boolean,
});

export const UserModel = model<IUserDocument>('User', userSchema);
