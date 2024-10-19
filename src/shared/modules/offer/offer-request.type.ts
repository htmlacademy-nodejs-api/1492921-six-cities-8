import { Request } from 'express';
import { TRequestBody, TRequestParams } from '../../libs/rest/index.js';
import { CreateOfferDto, UpdateOfferDto } from './index.js';

type TCreateOfferRequest = Request<
  TRequestParams,
  TRequestBody,
  CreateOfferDto
>;

type TUpdateOfferRequest = Request<
  TRequestParams,
  TRequestBody,
  UpdateOfferDto
>;

export type { TCreateOfferRequest, TUpdateOfferRequest };
