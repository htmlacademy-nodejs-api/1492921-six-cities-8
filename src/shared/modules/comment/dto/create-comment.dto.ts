import {
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { CreateCommentMessages } from './create-comment.messages.js';
import { CommentLength, RatingLimit } from '../../../../const/index.js';

export class CreateCommentDto {
  @MinLength(CommentLength.min, {
    message: CreateCommentMessages.comment.minLength,
  })
  @MaxLength(CommentLength.max, {
    message: CreateCommentMessages.comment.maxLength,
  })
  @IsString({ message: CreateCommentMessages.comment.invalidFormat })
  public comment: string;

  @IsNumber(
    { maxDecimalPlaces: 1 },
    { message: CreateCommentMessages.rating.invalidFormat }
  )
  @Min(RatingLimit.min, { message: CreateCommentMessages.rating.minValue })
  @Max(RatingLimit.max, { message: CreateCommentMessages.rating.maxValue })
  public rating: number;

  public offerId: string;

  public userId: string;
}
