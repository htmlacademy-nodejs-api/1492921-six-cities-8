import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { TCityName } from '../../types/city.type.js';
import { TOfferEntityDocument } from './index.js';
import { IDocumentExists } from '../../types/index.js';

export interface IOfferService extends IDocumentExists {
  create(dto: CreateOfferDto): Promise<TOfferEntityDocument>;
  findById(offerId: string): Promise<TOfferEntityDocument | null>;
  find(userId: string, limit?: number): Promise<TOfferEntityDocument[]>;
  deleteById(offerId: string): Promise<TOfferEntityDocument | null>;
  updateById(
    offerId: string,
    dto: UpdateOfferDto
  ): Promise<TOfferEntityDocument | null>;
  findPremium(
    cityName: TCityName,
    userId: string,
    limit?: number
  ): Promise<TOfferEntityDocument[]>;
  exists(documentId: string): Promise<boolean>;
  updateRating(offerId: string): Promise<TOfferEntityDocument | null>;
}
