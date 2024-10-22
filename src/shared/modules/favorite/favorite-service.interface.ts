import { TOfferEntityDocument } from '../offer/index.js';

export interface IFavoriteService {
  getFavorites(userId: string): Promise<string[]>;
  exists(userId: string, offerId: string): Promise<boolean>;
  addFavorite(
    userId: string,
    offerId: string
  ): Promise<TOfferEntityDocument | null>;
  delFavorite(
    userId: string,
    offerId: string
  ): Promise<TOfferEntityDocument | null>;
  find(userId: string): Promise<TOfferEntityDocument[]>;
}
