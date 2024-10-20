import { inject, injectable } from 'inversify';
import { mongoose, types } from '@typegoose/typegoose';

import { Component, SortType, TCityName } from '../../types/index.js';
import { ILogger } from '../../libs/logger/index.js';
import {
  CreateOfferDto,
  DefaultCount,
  IOfferService,
  OfferEntity,
  OfferEntityDocument,
  UpdateOfferDto,
} from './index.js';
import { CommentEntity } from '../comment/index.js';
import { IFavoriteService } from '../favorite/favorite-service.interface.js';
@injectable()
export class DefaultOfferService implements IOfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: ILogger,
    @inject(Component.OfferModel)
    private readonly offerModel: types.ModelType<OfferEntity>,
    @inject(Component.CommentModel)
    private readonly commentModel: types.ModelType<CommentEntity>,
    @inject(Component.FavoriteService)
    private readonly favoriteService: IFavoriteService
  ) {}

  public async create(dto: CreateOfferDto): Promise<OfferEntityDocument> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`Новое предложение аренды с id = ${result.id} создано`);
    return result;
  }

  public async findById(offerId: string): Promise<OfferEntityDocument | null> {
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
    }
    return result;
  }

  public async find(
    userId: string,
    count: number = DefaultCount.offer
  ): Promise<OfferEntityDocument[]> {
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
      .limit(count)
      .exec();
  }

  public async deleteById(
    offerId: string
  ): Promise<OfferEntityDocument | null> {
    const result = this.offerModel.findByIdAndDelete(offerId).exec();
    this.logger.info(`Предложение аренды с id = ${offerId} удалено`);
    return result;
  }

  public async updateById(
    offerId: string,
    dto: UpdateOfferDto
  ): Promise<OfferEntityDocument | null> {
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
    count: number = DefaultCount.premium
  ): Promise<OfferEntityDocument[]> {
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
      .limit(count)
      .exec();
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.offerModel.exists({ _id: documentId })) !== null;
  }

  async updateRating(offerId: string): Promise<OfferEntityDocument | null> {
    const [{ averageRating }] = await this.commentModel.aggregate([
      { $match: { offerId } },
      { $group: { _id: null, averageRating: { $avg: '$rating' } } },
    ]);

    return this.offerModel
      .findByIdAndUpdate(offerId, [{ rating: averageRating }], { new: true })
      .populate(['userId'])
      .exec();
  }
}
