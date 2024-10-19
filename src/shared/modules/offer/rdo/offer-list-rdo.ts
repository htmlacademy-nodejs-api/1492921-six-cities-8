import { Expose, Type } from 'class-transformer';
import { TCity, TOfferType, TPoint } from '../../../types/index.js';
import { UserRdo } from '../../user/index.js';

export class OfferListRdo {
  @Expose()
  public id: string;

  @Expose()
  public title: string;

  @Expose()
  public description: string;

  @Expose()
  public date: string;

  @Expose()
  public city: TCity;

  @Expose()
  public previewImage: string;

  @Expose()
  public isPremium: boolean;

  @Expose()
  public isFavorite: boolean;

  @Expose()
  public rating: number;

  @Expose()
  public type: TOfferType;

  @Expose()
  public price: number;

  @Expose()
  @Type(() => UserRdo)
  public host: UserRdo;

  @Expose()
  public commentsCount: number;

  @Expose()
  public location: TPoint;
}
