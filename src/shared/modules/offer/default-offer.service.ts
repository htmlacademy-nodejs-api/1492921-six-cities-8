import { inject, injectable } from 'inversify';
import { types } from '@typegoose/typegoose';
import mongoose from 'mongoose';

import { Component, SortType, TCityName } from '../../types/index.js';
import { ILogger } from '../../libs/logger/index.js';
import {
  CreateOfferDto,
  IOfferService,
  OfferEntity,
  TOfferEntityDocument,
  UpdateOfferDto,
} from './index.js';
import { DefaultCount } from '../../../const/index.js';
import { CommentEntity, ICommentService } from '../comment/index.js';
import { IFavoriteService } from '../favorite/favorite-service.interface.js';

@injectable()
export class DefaultOfferService implements IOfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: ILogger,
    @inject(Component.OfferModel)
    private readonly offerModel: types.ModelType<OfferEntity>,
    @inject(Component.CommentModel)
    private readonly commentModel: types.ModelType<CommentEntity>,
    @inject(Component.CommentService)
    private readonly commentService: ICommentService,
    @inject(Component.FavoriteService)
    private readonly favoriteService: IFavoriteService
  ) {}

  public async create(dto: CreateOfferDto): Promise<TOfferEntityDocument> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`Новое предложение аренды с id = ${result.id} создано`);
    return result;
  }

  public async findById(
    offerId: string,
    userId: string
  ): Promise<TOfferEntityDocument | null> {
    const [comments] = await this.commentModel.aggregate([
      { $match: { offerId: new mongoose.Types.ObjectId(offerId) } },
      { $count: 'count' },
    ]);
    const result = await this.offerModel
      .findById(offerId)
      .populate('hostId')
      .exec();
    if (result) {
      result.commentsCount = comments?.count ?? 0;
      const favorites = await this.favoriteService.getFavorites(userId);
      result.isFavorite = favorites.includes(offerId);
    }
    return result;
  }

  public async find(
    userId: string,
    limit?: number
  ): Promise<TOfferEntityDocument[]> {
    const favorites = await this.favoriteService.getFavorites(userId);
    return this.offerModel
      .aggregate([
        {
          $lookup: {
            from: 'comments',
            localField: '_id',
            foreignField: 'offerId',
            as: 'comments',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'hostId',
            foreignField: '_id',
            as: 'hostId',
          },
        },
        {
          $addFields: {
            id: { $toString: '$_id' },
            commentsCount: { $size: '$comments' },
          },
        },
        {
          $addFields: {
            isFavorite: { $in: ['$id', favorites] },
          },
        },
        { $unset: ['comments'] },
      ])
      .sort({ date: SortType.Down })
      .limit(limit ?? DefaultCount.offer)
      .exec();
  }

  public async deleteById(
    offerId: string
  ): Promise<TOfferEntityDocument | null> {
    await this.commentService.deleteByOfferId(offerId);
    const result = this.offerModel.findByIdAndDelete(offerId).exec();
    this.logger.info(`Предложение аренды с id = ${offerId} удалено`);
    return result;
  }

  public async updateById(
    offerId: string,
    dto: UpdateOfferDto
  ): Promise<TOfferEntityDocument | null> {
    const result = this.offerModel
      .findByIdAndUpdate(offerId, dto, { new: true })
      .populate('hostId')
      .exec();
    this.logger.info(`Предложение аренды с id = ${offerId} изменено`);
    return result;
  }

  public async findPremium(
    cityName: TCityName,
    userId: string,
    limit?: number
  ): Promise<TOfferEntityDocument[]> {
    const favorites = await this.favoriteService.getFavorites(userId);
    return this.offerModel
      .aggregate([
        { $match: { 'city.name': cityName, isPremium: true } },
        {
          $lookup: {
            from: 'comments',
            localField: '_id',
            foreignField: 'offerId',
            as: 'comments',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'hostId',
            foreignField: '_id',
            as: 'hostId',
          },
        },
        {
          $addFields: {
            id: { $toString: '$_id' },
            commentsCount: { $size: '$comments' },
          },
        },
        {
          $addFields: {
            isFavorite: { $in: ['$id', favorites] },
          },
        },
        { $unset: ['comments'] },
      ])
      .sort({ date: SortType.Down })
      .limit(limit ?? DefaultCount.premium)
      .exec();
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.offerModel.exists({ _id: documentId })) !== null;
  }

  async updateRating(offerId: string): Promise<TOfferEntityDocument | null> {
    const [{ averageRating }] = await this.commentModel.aggregate<
      Record<string, number>
    >([
      { $match: { offerId: new mongoose.Types.ObjectId(offerId) } },
      { $group: { _id: null, averageRating: { $avg: '$rating' } } },
    ]);
    const offerRating = (averageRating ?? 0).toFixed(1);
    return this.offerModel
      .findByIdAndUpdate(offerId, { rating: offerRating }, { new: true })
      .populate('hostId')
      .exec();
  }
}
