import { defaultClasses, getModelForClass, prop } from '@typegoose/typegoose';

import { EMPTY_AVATAR } from '../../../const/data.js';
import { TUser } from '../../types/index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface UserEntity extends defaultClasses.Base {}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class UserEntity extends defaultClasses.TimeStamps implements TUser {
  @prop({ trim: true, required: true, default: '' })
  public name: string;

  @prop({ unique: true, required: true })
  public email: string;

  @prop({ required: false, default: EMPTY_AVATAR })
  public avatarUrl?: string;

  @prop({ required: true, default: '' })
  public password: string;

  @prop({ required: true })
  public isPro: boolean;
}

export const UserModel = getModelForClass(UserEntity);
