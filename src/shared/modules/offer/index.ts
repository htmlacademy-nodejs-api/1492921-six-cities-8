import { DocumentType } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';

export { OfferEntity, OfferModel } from './offer.entity.js';
export { CreateOfferDto } from './dto/create-offer.dto.js';
export { UpdateOfferDto } from './dto/update-offer.dto.js';
export { IOfferService } from './offer-service.interface.js';
export { DefaultOfferService } from './default-offer.service.js';
export { createOfferContainer } from './offer.container.js';
export { DefaultCount } from './offer.constant.js';

export type OfferEntityDocument = DocumentType<OfferEntity>;
