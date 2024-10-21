import { Request } from 'express';
import { TRequestBody, TRequestParams } from '../../../libs/rest/index.js';
import { CreateOfferDto, UpdateOfferDto } from '../index.js';
import { TParamOfferId } from './param-offer.type.js';

type TCreateOfferRequest = Request<
  TRequestParams,
  TRequestBody,
  CreateOfferDto
>;

type TUpdateOfferRequest = Request<TParamOfferId, TRequestBody, UpdateOfferDto>;

export type { TCreateOfferRequest, TUpdateOfferRequest };
