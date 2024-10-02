import {
  defaultClasses,
  getModelForClass,
  modelOptions,
  prop,
  Ref
} from '@typegoose/typegoose';

import { TCity, TOfferGoods, TOfferType, TPoint } from '../../types/index.js';
import { UserEntity } from '../user/index.js';
import { OFFER_TYPES } from '../../../const/index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'offers',
    timestamps: true,
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({ trim: true, required: true })
  public title: string;

  @prop({ trim: true, required: true })
  public description: string;

  @prop({ required: true })
  public date: Date;

  @prop({ required: true })
  public city: TCity;

  @prop({ required: true })
  public previewImage: string;

  @prop({ required: true })
  public images: string[];

  @prop({ required: true })
  public isPremium: boolean;

  @prop({ required: true })
  public isFavorite: boolean;

  @prop({ required: true })
  public rating: number;

  @prop({ required: true, type: () => String, enum: OFFER_TYPES })
  public type: TOfferType;

  @prop({ required: true })
  public bedrooms: number;

  @prop({ required: true })
  public maxAdults: number;

  @prop({ required: true })
  public price: number;

  @prop({ required: true })
  public goods: TOfferGoods[];

  @prop({
    ref: UserEntity,
    required: true,
  })
  public userId: Ref<UserEntity>;

  @prop({ required: true })
  public location: TPoint;
}

export const OfferModel = getModelForClass(OfferEntity);
