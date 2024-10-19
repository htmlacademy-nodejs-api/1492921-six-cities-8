import { Expose, Type } from 'class-transformer';
import {
  TCity,
  TOfferGoods,
  TOfferType,
  TPoint,
} from '../../../types/index.js';
import { UserRdo } from '../../user/index.js';

export class OfferRdo {
  @Expose()
  public id: string;

  @Expose()
  public title: string;

  @Expose()
  public description: string;

  @Expose()
  public createdDate: string;

  @Expose()
  public city: TCity;

  @Expose()
  public previewImage: string;

  @Expose()
  public images: string[];

  @Expose()
  public isPremium: boolean;

  @Expose()
  public isFavorite: boolean;

  @Expose()
  public rating: number;

  @Expose()
  public type: TOfferType;

  @Expose()
  public bedrooms: number;

  @Expose()
  public maxAdults: number;

  @Expose()
  public price: number;

  @Expose()
  public goods: TOfferGoods[];

  @Expose({ name: 'hostId' })
  @Type(() => UserRdo)
  public host: UserRdo;

  @Expose()
  public commentCount: number;

  @Expose()
  public location: TPoint;
}
