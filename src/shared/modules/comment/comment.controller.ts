import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';

import {
  BaseController,
  HttpMethod,
  TRequestQueryLimit,
  ValidateObjectIdMiddleware,
} from '../../libs/rest/index.js';
import { Component } from '../../types/index.js';
import { ILogger } from '../../libs/logger/index.js';
import { fillDTO } from '../../helpers/index.js';
import { CommentRdo, ICommentService } from './index.js';
import {
  DefaultCount,
  IOfferService,
  OfferController,
} from '../offer/index.js';
import { TParamOfferId } from '../offer/type/param-offer.type.js';
import { USER_ID } from '../user/user.controller.js';
import { TCreateCommentRequest } from './comment-request.type.js';

@injectable()
export default class CommentController extends BaseController {
  constructor(
    @inject(Component.Logger)
    protected readonly logger: ILogger,
    @inject(Component.CommentService)
    private readonly commentService: ICommentService,
    @inject(Component.OfferService)
    private readonly offerService: IOfferService,
    @inject(Component.OfferController)
    private readonly offerController: OfferController
  ) {
    super(logger);

    this.logger.info('Регистрация маршрутов для CommentController ...');
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.index,
      middlewares: [new ValidateObjectIdMiddleware('offerId')],
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateObjectIdMiddleware('offerId')],
    });
  }

  public async index(
    {
      params,
      query,
    }: Request<TParamOfferId, undefined, undefined, TRequestQueryLimit>,
    res: Response
  ): Promise<void> {
    const { offerId } = params;
    if (await this.offerController.checkOffer(offerId)) {
      const comments = await this.commentService.findByOfferId(
        offerId,
        query.limit === undefined ? DefaultCount.comment : Number(query.limit)
      );
      this.ok(res, fillDTO(CommentRdo, comments));
    }
  }

  public async create(
    { params, body }: TCreateCommentRequest,
    res: Response
  ): Promise<void> {
    const { offerId } = params;
    if (await this.offerController.checkOffer(offerId)) {
      const comment = await this.commentService.create({
        ...body,
        offerId: offerId,
        userId: USER_ID,
      });
      await this.offerService.updateRating(offerId);
      this.created(res, fillDTO(CommentRdo, comment));
    }
  }
}
