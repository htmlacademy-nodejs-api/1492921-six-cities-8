import { inject } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { ICommentService } from './comment-service.interface.js';
import { Component } from '../../types/index.js';
import { CommentEntity } from './comment.entity.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';

export class DefaultCommentService implements ICommentService {
  constructor(
    @inject(Component.CommentModel)
    private readonly commentModel: types.ModelType<CommentEntity>
  ) {}

  public async create(
    dto: CreateCommentDto
  ): Promise<DocumentType<CommentEntity>> {
    const comment = await this.commentModel.create(dto);
    return comment.populate('userId');
  }

  public async findByOfferId(
    offerId: string
  ): Promise<DocumentType<CommentEntity>[]> {
    return this.commentModel.find({ offerId }).populate('userId').exec();
  }

  public async deleteByOfferId(offerId: string): Promise<number> {
    const result = await this.commentModel.deleteMany({ offerId }).exec();

    return result.deletedCount;
  }
}
