import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsObject,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

import { TOfferGoods, TOfferType } from '../../../types/index.js';
import { OfferValidationMessage } from './offer-validator.messages.js';
import { CityDto } from './city.dto.js';
import {
  OFFER_GOODS,
  OFFER_TYPES,
  BedroomsLimit,
  DescriptionLength,
  ImagesLimit,
  MaxAdultsLimit,
  PriceLimit,
  TitleLength,
} from '../../../../const/index.js';
import { PointDto } from './point.dto.js';

export class UpdateOfferDto {
  @MinLength(TitleLength.min, {
    message: OfferValidationMessage.title.minLength,
  })
  @MaxLength(TitleLength.max, {
    message: OfferValidationMessage.title.maxLength,
  })
  @IsString({ message: OfferValidationMessage.title.invalidFormat })
  public title?: string;

  @MinLength(DescriptionLength.min, {
    message: OfferValidationMessage.description.minLength,
  })
  @MaxLength(DescriptionLength.max, {
    message: OfferValidationMessage.description.maxLength,
  })
  public description?: string;

  @IsDateString({}, { message: OfferValidationMessage.date.invalidFormat })
  public date?: Date;

  @IsObject({ message: OfferValidationMessage.city.invalidFormat })
  @ValidateNested()
  @Type(() => CityDto)
  public city?: CityDto;

  @IsUrl(
    { protocols: ['http', 'https'] },
    { message: OfferValidationMessage.previewImage.invalidFormat }
  )
  public previewImage?: string;

  @IsArray({ message: OfferValidationMessage.images.invalidFormat })
  @ArrayMinSize(ImagesLimit.min, {
    message: OfferValidationMessage.images.length,
  })
  @ArrayMaxSize(ImagesLimit.max, {
    message: OfferValidationMessage.images.length,
  })
  @IsUrl(
    { protocols: ['http', 'https'] },
    {
      each: true,
      message: OfferValidationMessage.images.invalidElements,
    }
  )
  public images?: string[];

  @IsBoolean({ message: OfferValidationMessage.isPremium.invalidFormat })
  public isPremium?: boolean;

  @IsEnum(OFFER_TYPES, { message: OfferValidationMessage.type.invalid })
  public type?: TOfferType;

  @IsInt({ message: OfferValidationMessage.bedrooms.invalidFormat })
  @Min(BedroomsLimit.min, { message: OfferValidationMessage.bedrooms.minValue })
  @Max(BedroomsLimit.max, { message: OfferValidationMessage.bedrooms.maxValue })
  public bedrooms?: number;

  @IsInt({ message: OfferValidationMessage.maxAdults.invalidFormat })
  @Min(MaxAdultsLimit.min, {
    message: OfferValidationMessage.maxAdults.minValue,
  })
  @Max(MaxAdultsLimit.max, {
    message: OfferValidationMessage.maxAdults.maxValue,
  })
  public maxAdults?: number;

  @IsInt({ message: OfferValidationMessage.price.invalidFormat })
  @Min(PriceLimit.min, { message: OfferValidationMessage.price.minValue })
  @Max(PriceLimit.max, { message: OfferValidationMessage.price.maxValue })
  public price?: number;

  @IsArray({ message: OfferValidationMessage.goods.invalidFormat })
  @IsEnum(OFFER_GOODS, {
    each: true,
    message: OfferValidationMessage.goods.invalidElements,
  })
  public goods?: TOfferGoods[];

  public hostId?: string;

  @IsObject({ message: OfferValidationMessage.location.invalidFormat })
  @ValidateNested()
  @Type(() => PointDto)
  public location?: PointDto;
}
