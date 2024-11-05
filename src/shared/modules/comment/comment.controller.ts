import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';

import {
  BaseController,
  DocumentExistsMiddleware,
  HttpMethod,
  PrivateRouteMiddleware,
  TRequestQueryLimit,
  ValidateDtoMiddleware,
  ValidateObjectIdMiddleware,
} from '../../libs/rest/index.js';
import { Component } from '../../types/index.js';
import { ILogger } from '../../libs/logger/index.js';
import { fillDTO } from '../../helpers/index.js';
import { CommentRdo, CreateCommentDto, ICommentService } from './index.js';
import { IOfferService } from '../offer/index.js';
import { TParamOfferId } from '../offer/type/param-offer.type.js';
import { TCreateCommentRequest } from './comment-request.type.js';
import { DefaultCount } from '../../../const/index.js';

@injectable()
export default class CommentController extends BaseController {
  constructor(
    @inject(Component.Logger)
    protected readonly logger: ILogger,
    @inject(Component.CommentService)
    private readonly commentService: ICommentService,
    @inject(Component.OfferService)
    private readonly offerService: IOfferService
  ) {
    super(logger);

    this.logger.info('Регистрация маршрутов для CommentController ...');
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.index,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateCommentDto),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
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
    const comments = await this.commentService.findByOfferId(
      offerId,
      query.limit === undefined ? DefaultCount.comment : Number(query.limit)
    );
    this.ok(res, fillDTO(CommentRdo, comments));
  }

  public async create(
    { params, body, tokenPayload }: TCreateCommentRequest,
    res: Response
  ): Promise<void> {
    const { offerId } = params;
    const comment = await this.commentService.create({
      ...body,
      offerId: offerId,
      userId: tokenPayload.id,
    });
    await this.offerService.updateRating(offerId);
    this.created(res, fillDTO(CommentRdo, comment));
  }
}
