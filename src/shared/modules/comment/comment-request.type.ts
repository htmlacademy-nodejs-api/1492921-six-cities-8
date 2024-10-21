import { Request } from 'express';

import { TRequestBody } from '../../libs/rest/index.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { TParamOfferId } from '../offer/type/param-offer.type.js';

export type TCreateCommentRequest = Request<
  TParamOfferId,
  TRequestBody,
  CreateCommentDto
>;
