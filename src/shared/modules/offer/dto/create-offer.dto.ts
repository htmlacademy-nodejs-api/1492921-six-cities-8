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
import { CreateOfferValidationMessage } from './create-offer.messages.js';
import { OFFER_GOODS, OFFER_TYPES } from '../../../../const/data.js';

export class CreateOfferDto {
  @MinLength(10, { message: CreateOfferValidationMessage.title.minLength })
  @MaxLength(100, { message: CreateOfferValidationMessage.title.maxLength })
  @IsString({ message: CreateOfferValidationMessage.title.invalidFormat })
  public title: string;

  @MinLength(20, {
    message: CreateOfferValidationMessage.description.minLength,
  })
  @MaxLength(1024, {
    message: CreateOfferValidationMessage.description.maxLength,
  })
  public description: string;

  @IsDateString(
    {},
    { message: CreateOfferValidationMessage.date.invalidFormat }
  )
  public date: Date;

  @ValidateNested()
  public city: TCity;
  // @Type(() => CityDto)
  // public city: CityDto;

  // @IsString({
  //   message: CreateOfferValidationMessage.previewImage.invalidFormat,
  // })
  @IsUrl(
    { protocols: ['http', 'https'] },
    { message: CreateOfferValidationMessage.previewImage.invalidFormat }
  )
  public previewImage: string;

  @IsArray({ message: CreateOfferValidationMessage.images.invalidFormat })
  @ArrayMinSize(6, { message: CreateOfferValidationMessage.images.length })
  @ArrayMaxSize(6, { message: CreateOfferValidationMessage.images.length })
  @IsUrl(
    { protocols: ['http', 'https'] },
    {
      each: true,
      message: CreateOfferValidationMessage.images.invalidElements,
    }
  )
  public images: string[];

  @IsBoolean({ message: CreateOfferValidationMessage.isPremium.invalidFormat })
  public isPremium: boolean;

  @IsEnum(OFFER_TYPES, { message: CreateOfferValidationMessage.type.invalid })
  public type: TOfferType;

  @IsInt({ message: CreateOfferValidationMessage.bedrooms.invalidFormat })
  @Min(1, { message: CreateOfferValidationMessage.bedrooms.minValue })
  @Max(8, { message: CreateOfferValidationMessage.bedrooms.maxValue })
  public bedrooms: number;

  @IsInt({ message: CreateOfferValidationMessage.maxAdults.invalidFormat })
  @Min(1, { message: CreateOfferValidationMessage.maxAdults.minValue })
  @Max(10, { message: CreateOfferValidationMessage.maxAdults.maxValue })
  public maxAdults: number;

  @IsInt({ message: CreateOfferValidationMessage.price.invalidFormat })
  @Min(100, { message: CreateOfferValidationMessage.price.minValue })
  @Max(100000, { message: CreateOfferValidationMessage.price.maxValue })
  public price: number;

  @IsArray({ message: CreateOfferValidationMessage.goods.invalidFormat })
  @IsEnum(OFFER_GOODS, {
    each: true,
    message: CreateOfferValidationMessage.goods.invalidElements,
  })
  public goods: TOfferGoods[];

  @IsMongoId({ message: CreateOfferValidationMessage.hostId.invalidId })
  public hostId: string;

  @IsObject({ message: CreateOfferValidationMessage.location.invalidFormat })
  public location: TPoint;
}
