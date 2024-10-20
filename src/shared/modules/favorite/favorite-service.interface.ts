import { OfferEntityDocument } from '../offer/index.js';

export interface IFavoriteService {
  exists(userId: string, offerId: string): Promise<boolean>;
  addFavorite(
    userId: string,
    offerId: string
  ): Promise<OfferEntityDocument | null>;
  delFavorite(
    userId: string,
    offerId: string
  ): Promise<OfferEntityDocument | null>;
  find(userId: string): Promise<OfferEntityDocument[]>;
}
