import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { inject, injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';

import { IOfferService } from './offer-service.interface.js';
import { OfferRdo } from './rdo/offer.rdo.js';
import {
  TCreateOfferRequest,
  TUpdateOfferRequest,
} from './type/offer-request.type.js';
import { TParamCityName, TParamOfferId } from './type/param-offer.type.js';
import {
  BaseController,
  DocumentExistsMiddleware,
  HttpError,
  HttpMethod,
  PrivateRouteMiddleware,
  TRequestParams,
  TRequestQueryLimit,
  ValidateDtoMiddleware,
  ValidateObjectIdMiddleware,
} from '../../libs/rest/index.js';
import { ILogger } from '../../libs/logger/logger.interface.js';
import { Component, TCityName } from '../../types/index.js';
import { fillDTO } from '../../helpers/index.js';
import { cityNames } from '../../../const/data.js';
import { OfferListRdo } from './rdo/offer-list.rdo.js';
import { CreateOfferDto, UpdateOfferDto } from './index.js';
import { DefaultCount } from '../../../const/index.js';
import { AppRoute } from '../../../rest/index.js';

@injectable()
export default class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger)
    protected readonly logger: ILogger,
    @inject(Component.OfferService)
    private readonly offerService: IOfferService
  ) {
    super(logger);

    this.logger.info('Регистрация маршрутов для OfferController ...');
    this.logger.info(AppRoute.Offers);

    this.addRoute({
      path: AppRoute.Offers,
      method: HttpMethod.Get,
      handler: this.index,
    });

    this.addRoute({
      path: AppRoute.Offers,
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateOfferDto),
      ],
    });

    this.addRoute({
      path: AppRoute.Offer,
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(UpdateOfferDto),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });

    this.addRoute({
      path: AppRoute.Offer,
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new PrivateRouteMiddleware(),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });

    this.addRoute({
      path: AppRoute.Offer,
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });

    this.addRoute({
      path: AppRoute.Premium,
      method: HttpMethod.Get,
      handler: this.findPremium,
    });
  }

  private async checkRights(offerId: string, userId: string): Promise<void> {
    const offer = await this.offerService.findById(offerId, userId);

    if (!offer?.hostId._id.equals(new Types.ObjectId(userId))) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        'Не достаточно прав для выполнения действия',
        'OfferController'
      );
    }
  }

  public async index(
    {
      tokenPayload,
      query,
    }: Request<TRequestParams, unknown, unknown, TRequestQueryLimit>,
    res: Response
  ): Promise<void> {
    const offers = await this.offerService.find(
      tokenPayload?.id,
      query.limit === undefined ? DefaultCount.offer : Number(query.limit)
    );
    this.ok(res, fillDTO(OfferListRdo, offers));
  }

  public async create(
    { body, tokenPayload }: TCreateOfferRequest,
    res: Response
  ): Promise<void> {
    const result = await this.offerService.create({
      ...body,
      hostId: tokenPayload.id,
      date: body.date ?? new Date().toISOString(),
    });
    const offer = await this.offerService.findById(result.id, tokenPayload.id);
    this.created(res, fillDTO(OfferRdo, offer));
  }

  public async update(
    { params, tokenPayload, body }: TUpdateOfferRequest,
    res: Response
  ): Promise<void> {
    const { offerId } = params;
    await this.checkRights(offerId, tokenPayload.id);
    const result = await this.offerService.updateById(offerId, body);
    if (result) {
      const offer = await this.offerService.findById(offerId, tokenPayload.id);
      this.ok(res, fillDTO(OfferRdo, offer));
    }
  }

  public async delete(
    { params, tokenPayload }: Request<TParamOfferId>,
    res: Response
  ): Promise<void> {
    const { offerId } = params;
    await this.checkRights(offerId, tokenPayload.id);
    await this.offerService.deleteById(offerId);
    this.noContent(res, null);
  }

  public async show(
    { params, tokenPayload }: Request<TParamOfferId>,
    res: Response
  ): Promise<void> {
    const { offerId } = params;
    const offer = await this.offerService.findById(offerId, tokenPayload?.id);
    this.ok(res, fillDTO(OfferRdo, offer));
  }

  public async findPremium(
    {
      params,
      tokenPayload,
      query,
    }: Request<TParamCityName, unknown, unknown, TRequestQueryLimit>,
    res: Response
  ): Promise<void> {
    const cityName = cityNames.find(
      (city) => city.toLowerCase() === params.cityName.toLowerCase()
    );
    if (!cityName) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        'Указанный город не найден',
        'OfferController'
      );
    }
    const offers = await this.offerService.findPremium(
      cityName as TCityName,
      tokenPayload?.id,
      query.limit === undefined ? DefaultCount.premium : Number(query.limit)
    );
    this.ok(res, fillDTO(OfferListRdo, offers));
  }
}
