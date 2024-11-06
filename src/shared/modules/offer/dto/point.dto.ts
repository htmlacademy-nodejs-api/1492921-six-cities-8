import { IsLatitude, IsLongitude } from 'class-validator';
import { OfferValidationMessage } from './offer-validator.messages.js';

export class PointDto {
  @IsLatitude({ message: OfferValidationMessage.location.invalidLatitude })
  public latitude: number;

  @IsLongitude({ message: OfferValidationMessage.location.invalidLongitude })
  public longitude: number;
}
