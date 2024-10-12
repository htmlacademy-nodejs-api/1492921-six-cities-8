import { OfferEntityDocument } from '../offer/index.js';
import { UpdateFavoriteDto } from './dto/update-favorite.dto.js';

export interface IFavoriteService {
  addFavorite(dto: UpdateFavoriteDto): Promise<OfferEntityDocument | null>;
  delFavorite(dto: UpdateFavoriteDto): Promise<OfferEntityDocument | null>;
  find(userId: string): Promise<OfferEntityDocument[]>;
}
