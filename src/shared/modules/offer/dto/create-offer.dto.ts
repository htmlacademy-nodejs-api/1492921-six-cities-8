import { TCity, TOfferGoods, TOfferType, TPoint } from '../../../types/index.js';

export class CreateOfferDto {
  //public id: string;
  public title: string;
  public description: string;
  public date: string;
  public city: TCity;
  public previewImage: string;
  public images: string[];
  public isPremium: boolean;
  public isFavorite: boolean;
  public rating: number;
  public type: TOfferType;
  public bedrooms: number;
  public maxAdults: number;
  public price: number;
  public goods: TOfferGoods[];
  public hostId: string;
  public location: TPoint;
}
