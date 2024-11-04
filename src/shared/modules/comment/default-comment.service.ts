import { inject, injectable } from 'inversify';
import { types } from '@typegoose/typegoose';

import { Component } from '../../types/index.js';
import {
  CommentEntity,
  CreateCommentDto,
  ICommentService,
  TCommentEntityDocument,
} from './index.js';
import { DefaultCount } from '../../../const/index.js';
import { ILogger } from '../../libs/logger/index.js';

@injectable()
export class DefaultCommentService implements ICommentService {
  constructor(
    @inject(Component.Logger) private readonly logger: ILogger,
    @inject(Component.CommentModel)
    private readonly commentModel: types.ModelType<CommentEntity>
  ) {}

  public async create(dto: CreateCommentDto): Promise<TCommentEntityDocument> {
    const comment = await this.commentModel.create(dto);
    this.logger.info(
      `Комментарий с id = ${comment.id} добавлен к предложению с id = ${dto.offerId}`
    );
    return comment.populate('userId');
  }

  public async findByOfferId(
    offerId: string,
    limit?: number
  ): Promise<TCommentEntityDocument[]> {
    const limitComments = limit ?? DefaultCount.comment;
    return this.commentModel
      .find({ offerId }, {}, { limitComments })
      .populate('userId')
      .exec();
  }

  public async deleteByOfferId(offerId: string): Promise<number> {
    const result = await this.commentModel.deleteMany({ offerId }).exec();
    this.logger.info(`Все комментарии к предложению с id = ${offerId} удалены`);
    return result.deletedCount;
  }
}
