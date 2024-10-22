import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsMongoId,
  IsObject,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

import {
  TCity,
  TOfferGoods,
  TOfferType,
  TPoint,
} from '../../../types/index.js';
//import { CityDto } from './city-dto.js';
import { OfferValidationMessage } from './offer-validator.messages.js';
import { OFFER_GOODS, OFFER_TYPES } from '../../../../const/data.js';

export class CreateOfferDto {
  @MinLength(10, { message: OfferValidationMessage.title.minLength })
  @MaxLength(100, { message: OfferValidationMessage.title.maxLength })
  @IsString({ message: OfferValidationMessage.title.invalidFormat })
  public title: string;

  @MinLength(20, {
    message: OfferValidationMessage.description.minLength,
  })
  @MaxLength(1024, {
    message: OfferValidationMessage.description.maxLength,
  })
  public description: string;

  @IsDateString({}, { message: OfferValidationMessage.date.invalidFormat })
  public date: Date;

  @ValidateNested()
  public city: TCity;
  // @Type(() => CityDto)
  // public city: CityDto;

  // @IsString({
  //   message: OfferValidationMessage.previewImage.invalidFormat,
  // })
  @IsUrl(
    { protocols: ['http', 'https'] },
    { message: OfferValidationMessage.previewImage.invalidFormat }
  )
  public previewImage: string;

  @IsArray({ message: OfferValidationMessage.images.invalidFormat })
  @ArrayMinSize(6, { message: OfferValidationMessage.images.length })
  @ArrayMaxSize(6, { message: OfferValidationMessage.images.length })
  @IsUrl(
    { protocols: ['http', 'https'] },
    {
      each: true,
      message: OfferValidationMessage.images.invalidElements,
    }
  )
  public images: string[];

  @IsBoolean({ message: OfferValidationMessage.isPremium.invalidFormat })
  public isPremium: boolean;

  @IsEnum(OFFER_TYPES, { message: OfferValidationMessage.type.invalid })
  public type: TOfferType;

  @IsInt({ message: OfferValidationMessage.bedrooms.invalidFormat })
  @Min(1, { message: OfferValidationMessage.bedrooms.minValue })
  @Max(8, { message: OfferValidationMessage.bedrooms.maxValue })
  public bedrooms: number;

  @IsInt({ message: OfferValidationMessage.maxAdults.invalidFormat })
  @Min(1, { message: OfferValidationMessage.maxAdults.minValue })
  @Max(10, { message: OfferValidationMessage.maxAdults.maxValue })
  public maxAdults: number;

  @IsInt({ message: OfferValidationMessage.price.invalidFormat })
  @Min(100, { message: OfferValidationMessage.price.minValue })
  @Max(100000, { message: OfferValidationMessage.price.maxValue })
  public price: number;

  @IsArray({ message: OfferValidationMessage.goods.invalidFormat })
  @IsEnum(OFFER_GOODS, {
    each: true,
    message: OfferValidationMessage.goods.invalidElements,
  })
  public goods: TOfferGoods[];

  @IsMongoId({ message: OfferValidationMessage.hostId.invalidId })
  public hostId: string;

  @IsObject({ message: OfferValidationMessage.location.invalidFormat })
  public location: TPoint;
}
