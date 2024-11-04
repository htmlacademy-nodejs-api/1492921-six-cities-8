import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';

import {
  BaseController,
  DocumentExistsMiddleware,
  HttpError,
  HttpMethod,
  PrivateRouteMiddleware,
  ValidateObjectIdMiddleware,
} from '../../libs/rest/index.js';
import { ILogger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { IFavoriteService } from './index.js';
import { fillDTO } from '../../helpers/index.js';
import { OfferListRdo } from '../offer/rdo/offer-list.rdo.js';
import { OfferRdo } from '../offer/rdo/offer.rdo.js';
import { StatusCodes } from 'http-status-codes';
import { TParamOfferId } from '../offer/type/param-offer.type.js';
import { IOfferService } from '../offer/index.js';
@injectable()
export default class FavoriteController extends BaseController {
  constructor(
    @inject(Component.Logger)
    protected readonly logger: ILogger,
    @inject(Component.FavoriteService)
    private readonly favoriteService: IFavoriteService,
    @inject(Component.OfferService)
    private readonly offerService: IOfferService
  ) {
    super(logger);

    this.logger.info('Регистрация маршрутов для FavoriteController ...');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Post,
      handler: this.add,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new PrivateRouteMiddleware(),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new PrivateRouteMiddleware(),
      ],
    });
  }

  public async index({ tokenPayload }: Request, res: Response): Promise<void> {
    const favorites = await this.favoriteService.find(tokenPayload?.id);
    this.ok(res, fillDTO(OfferListRdo, favorites));
  }

  public async add(
    { params, tokenPayload }: Request<TParamOfferId>,
    res: Response
  ): Promise<void> {
    const { offerId } = params;
    if (await this.favoriteService.exists(tokenPayload.id, offerId)) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        'Это предложение по аренде уже находится в избранном',
        'FavoriteController'
      );
    }
    const offer = await this.favoriteService.addFavorite(
      tokenPayload.id,
      offerId
    );
    this.ok(res, fillDTO(OfferRdo, offer));
  }

  public async delete(
    { params, tokenPayload }: Request<TParamOfferId>,
    res: Response
  ): Promise<void> {
    const { offerId } = params;

    if (!(await this.favoriteService.exists(tokenPayload.id, offerId))) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        'Это предложение по аренде не находится в избранном',
        'FavoriteController'
      );
    }
    const offer = await this.favoriteService.delFavorite(
      tokenPayload.id,
      offerId
    );
    this.ok(res, fillDTO(OfferRdo, offer));
  }
}
