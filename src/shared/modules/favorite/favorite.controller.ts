import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';

import {
  BaseController,
  HttpError,
  HttpMethod,
} from '../../libs/rest/index.js';
import { ILogger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { IFavoriteService } from './index.js';
import { fillDTO } from '../../helpers/index.js';
import { OfferListRdo } from '../offer/rdo/offer-list.rdo.js';
import { UserController } from '../user/index.js';
import { OfferController } from '../offer/offer.controller.js';
import { OfferRdo } from '../offer/rdo/offer.rdo.js';
import { StatusCodes } from 'http-status-codes';
import { USER_ID } from '../user/user.controller.js';
import { TParamOfferId } from '../offer/type/param-offer.type.js';
@injectable()
export class FavoriteController extends BaseController {
  constructor(
    @inject(Component.Logger)
    protected readonly logger: ILogger,
    @inject(Component.FavoriteService)
    private readonly favoriteService: IFavoriteService,
    @inject(Component.UserController)
    private readonly userController: UserController,
    @inject(Component.OfferController)
    private readonly offerController: OfferController
  ) {
    super(logger);

    this.logger.info('Регистрация маршрутов для FavoriteController ...');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Post,
      handler: this.add,
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
    });
  }

  public async index(_req: Request, res: Response): Promise<void> {
    if (this.userController.checkUser('123')) {
      const favorites = await this.favoriteService.find(USER_ID); // пока заглушка вместо userId
      this.ok(res, fillDTO(OfferListRdo, favorites));
    }
  }

  public async add(
    { params }: Request<TParamOfferId>,
    res: Response
  ): Promise<void> {
    const { offerId } = params;
    if (this.userController.checkUser('123')) {
      if (await this.offerController.checkOffer(offerId)) {
        if (await this.favoriteService.exists(USER_ID, offerId)) {
          throw new HttpError(
            StatusCodes.CONFLICT,
            'Это предложение по аренде уже находится в избранном',
            'FavoriteController'
          );
        }
        const offer = await this.favoriteService.addFavorite(USER_ID, offerId);
        this.ok(res, fillDTO(OfferRdo, offer));
      }
    }
  }

  public async delete(
    { params }: Request<TParamOfferId>,
    res: Response
  ): Promise<void> {
    const { offerId } = params;
    if (this.userController.checkUser('123')) {
      if (await this.offerController.checkOffer(offerId)) {
        if (!(await this.favoriteService.exists(USER_ID, offerId))) {
          throw new HttpError(
            StatusCodes.CONFLICT,
            'Это предложение по аренде не находится в избранном',
            'FavoriteController'
          );
        }
        const offer = await this.favoriteService.delFavorite(USER_ID, offerId);
        this.ok(res, fillDTO(OfferRdo, offer));
      }
    }
  }
}
