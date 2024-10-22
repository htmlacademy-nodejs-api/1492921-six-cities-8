import {
  IsMongoId,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { CreateCommentMessages } from './create-comment.messages.js';

export class CreateCommentDto {
  @MinLength(10, { message: CreateCommentMessages.comment.minLength })
  @MaxLength(100, { message: CreateCommentMessages.comment.maxLength })
  @IsString({ message: CreateCommentMessages.comment.invalidFormat })
  public comment: string;

  @IsNumber(
    { maxDecimalPlaces: 1 },
    { message: CreateCommentMessages.rating.invalidFormat }
  )
  @Min(1, { message: CreateCommentMessages.rating.minValue })
  @Max(5, { message: CreateCommentMessages.rating.maxValue })
  public rating: number;

  @IsMongoId({ message: CreateCommentMessages.offerId.invalidId })
  public offerId: string;

  public userId: string;
}
