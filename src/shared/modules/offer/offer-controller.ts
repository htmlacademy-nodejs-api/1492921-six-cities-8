import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';

import { IOfferService } from './offer-service.interface.js';
import { OfferRdo } from './rdo/offer.rdo.js';
import {
  TCreateOfferRequest,
  TUpdateOfferRequest,
} from './offer-request.type.js';
import {
  BaseController,
  HttpError,
  HttpMethod,
} from '../../libs/rest/index.js';
import { ILogger } from '../../libs/logger/logger.interface.js';
import { Component, TCityName } from '../../types/index.js';
import { fillDTO } from '../../helpers/index.js';
import { cityNames } from '../../../const/data.js';
import { OfferListRdo } from './rdo/offer-list.rdo.js';
import { USER_ID, UserController } from '../user/user.controller.js';
@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger)
    protected readonly logger: ILogger,
    @inject(Component.OfferService)
    private readonly offerService: IOfferService,
    @inject(Component.UserController)
    private readonly userController: UserController
  ) {
    super(logger);

    this.logger.info('Регистрация маршрутов для OfferController ...');

    this.addRoute({
      path: '/',
      method: HttpMethod.Get,
      handler: this.index,
    });

    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Patch,
      handler: this.update,
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
    });

    this.addRoute({
      path: '/premium',
      method: HttpMethod.Get,
      handler: this.getPremium,
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.getOffer,
    });
  }

  public async checkOffer(offerId: string): Promise<boolean> {
    const offer = await this.offerService.findById(offerId);
    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        'Предложение по аренде не найдено',
        'OfferController'
      );
      return false;
    }
    return true;
  }

  public async index(_req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.find(USER_ID);
    this.ok(res, fillDTO(OfferListRdo, offers));
  }

  public async create(req: TCreateOfferRequest, res: Response): Promise<void> {
    const { body } = req;
    if (
      !body.title ||
      !body.description ||
      !body.date ||
      !body.city ||
      !body.previewImage ||
      !body.images ||
      body.isPremium === undefined ||
      !body.type ||
      !body.bedrooms ||
      !body.maxAdults ||
      !body.price ||
      !body.goods ||
      !body.hostId ||
      !body.location
    ) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Ошибка тела запроса',
        'OfferController'
      );
    }
    if (this.userController.checkUser('token')) {
      const result = await this.offerService.create(body);
      const offer = await this.offerService.findById(result.id);
      this.created(res, fillDTO(OfferRdo, offer));
    }
  }

  public async update(req: TUpdateOfferRequest, res: Response): Promise<void> {
    const { params, body } = req;
    const offerId = params.offerId as string;

    this.checkOffer(offerId);

    if (
      !body.title &&
      !body.description &&
      !body.date &&
      !body.city &&
      !body.previewImage &&
      !body.images &&
      !body.isPremium &&
      !body.type &&
      !body.bedrooms &&
      !body.maxAdults &&
      !body.price &&
      !body.goods &&
      !body.hostId &&
      !body.location
    ) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Ошибка тела запроса',
        'OfferController'
      );
    }
    if (
      this.userController.checkUser('token') &&
      (await this.checkOffer(offerId))
    ) {
      const result = await this.offerService.updateById(offerId, body);
      if (result) {
        const offer = await this.offerService.findById(offerId);
        this.ok(res, fillDTO(OfferRdo, offer));
      }
    }
  }

  public async delete(req: TUpdateOfferRequest, res: Response) {
    const offerId = req.params.offerId as string;
    if (await this.checkOffer(offerId)) {
      await this.offerService.deleteById(offerId);
      this.ok(res, null);
    }
  }

  public async getOffer(
    req: TUpdateOfferRequest,
    res: Response
  ): Promise<void> {
    const offerId = req.params.offerId as string;
    if (await this.checkOffer(offerId)) {
      const offer = await this.offerService.findById(offerId);
      this.ok(res, fillDTO(OfferRdo, offer));
    }
  }

  public async getPremium(req: Request, res: Response): Promise<void> {
    const param = req.query.city as string;
    if (!param) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Ошибка в параметре запроса',
        'OfferController'
      );
    }

    const cityName = cityNames.find(
      (city) => city.toLowerCase() === param.toLowerCase()
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
      USER_ID
    );
    this.ok(res, fillDTO(OfferListRdo, offers));
  }
}
