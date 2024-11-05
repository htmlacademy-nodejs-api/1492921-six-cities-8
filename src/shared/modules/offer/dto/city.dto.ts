import { Type } from 'class-transformer';
import { IsEnum, IsObject, ValidateNested } from 'class-validator';
import { OfferValidationMessage } from './offer-validator.messages.js';
import { PointDto } from './point.dto.js';
import { cityNames } from '../../../../const/data.js';

export class CityDto {
  @IsEnum(cityNames, { message: OfferValidationMessage.city.invalid })
  public name: string;

  @IsObject({ message: OfferValidationMessage.location.invalidFormat })
  @ValidateNested()
  @Type(() => PointDto)
  public location: PointDto;
}
