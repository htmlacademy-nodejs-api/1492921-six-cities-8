import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { TCityName } from '../../types/city.type.js';
import { OfferEntityDocument } from './index.js';

export interface IOfferService {
  create(dto: CreateOfferDto): Promise<OfferEntityDocument>;
  findById(offerId: string): Promise<OfferEntityDocument | null>;
  find(userId: string): Promise<OfferEntityDocument[]>;
  deleteById(offerId: string): Promise<OfferEntityDocument | null>;
  updateById(
    offerId: string,
    dto: UpdateOfferDto
  ): Promise<OfferEntityDocument | null>;
  findPremium(
    cityName: TCityName,
    userId: string
  ): Promise<OfferEntityDocument[]>;
  exists(documentId: string): Promise<boolean>;
  findNew(count: number): Promise<OfferEntityDocument[]>;
  updateRating(offerId: string): Promise<OfferEntityDocument | null>;
}
