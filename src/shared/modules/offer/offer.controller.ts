import { Request, Response } from 'express';
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
  HttpError,
  HttpMethod,
  TRequestQueryLimit,
  ValidateDtoMiddleware,
  ValidateObjectIdMiddleware,
} from '../../libs/rest/index.js';
import { ILogger } from '../../libs/logger/logger.interface.js';
import { Component, TCityName } from '../../types/index.js';
import { fillDTO } from '../../helpers/index.js';
import { cityNames } from '../../../const/data.js';
import { OfferListRdo } from './rdo/offer-list.rdo.js';
import { USER_ID, UserController } from '../user/user.controller.js';
import { CreateOfferDto, DefaultCount, UpdateOfferDto } from './index.js';

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
      path: '/offers',
      method: HttpMethod.Get,
      handler: this.index,
    });

    this.addRoute({
      path: '/offers',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateOfferDto)],
    });

    this.addRoute({
      path: '/offers/:offerId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(UpdateOfferDto),
      ],
    });

    this.addRoute({
      path: '/offers/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [new ValidateObjectIdMiddleware('offerId')],
    });

    this.addRoute({
      path: '/offers/:offerId',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [new ValidateObjectIdMiddleware('offerId')],
    });

    this.addRoute({
      path: '/premium/:cityName',
      method: HttpMethod.Get,
      handler: this.findPremium,
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

  public async index(
    { query }: Request<unknown, unknown, unknown, TRequestQueryLimit>,
    res: Response
  ): Promise<void> {
    const offers = await this.offerService.find(
      USER_ID,
      query.limit === undefined ? DefaultCount.premium : Number(query.limit)
    );
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

  public async update(
    { body, params }: TUpdateOfferRequest,
    res: Response
  ): Promise<void> {
    const { offerId } = params;

    // НЕ ПОНЯТНО почему не видно полей
    // if (
    //   !body.title &&
    //   !body.description &&
    //   !body.date &&
    //   !body.city &&
    //   !body.previewImage &&
    //   !body.images &&
    //   !body.isPremium &&
    //   !body.type &&
    //   !body.bedrooms &&
    //   !body.maxAdults &&
    //   !body.price &&
    //   !body.goods &&
    //   !body.hostId &&
    //   !body.location
    // ) {
    //   throw new HttpError(
    //     StatusCodes.BAD_REQUEST,
    //     'Ошибка тела запроса',
    //     'OfferController'
    //   );
    // }
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

  public async delete(
    { params }: Request<TParamOfferId>,
    res: Response
  ): Promise<void> {
    const { offerId } = params;
    if (await this.checkOffer(offerId)) {
      await this.offerService.deleteById(offerId);
      this.ok(res, null);
    }
  }

  public async show(
    { params }: Request<TParamOfferId>,
    res: Response
  ): Promise<void> {
    const { offerId } = params;
    if (await this.checkOffer(offerId)) {
      const offer = await this.offerService.findById(offerId);
      this.ok(res, fillDTO(OfferRdo, offer));
    }
  }

  public async findPremium(
    {
      params,
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
      USER_ID,
      query.limit === undefined ? DefaultCount.premium : Number(query.limit)
    );
    this.ok(res, fillDTO(OfferListRdo, offers));
  }
}
