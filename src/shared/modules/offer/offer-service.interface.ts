import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { TCityName } from '../../types/city.type.js';
import { OfferEntityDocument } from './index.js';

export interface IOfferService {
  create(dto: CreateOfferDto): Promise<OfferEntityDocument>;
  findById(offerId: string): Promise<OfferEntityDocument | null>;
  find(userId: string, limit?: number): Promise<OfferEntityDocument[]>;
  deleteById(offerId: string): Promise<OfferEntityDocument | null>;
  updateById(
    offerId: string,
    dto: UpdateOfferDto
  ): Promise<OfferEntityDocument | null>;
  findPremium(
    cityName: TCityName,
    userId: string,
    limit?: number
  ): Promise<OfferEntityDocument[]>;
  exists(documentId: string): Promise<boolean>;
  updateRating(offerId: string): Promise<OfferEntityDocument | null>;
}
