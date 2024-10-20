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
import { UserEntity } from '../user/index.js';
@injectable()
export class DefaultOfferService implements IOfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: ILogger,
    @inject(Component.OfferModel)
    private readonly offerModel: types.ModelType<OfferEntity>,
    @inject(Component.CommentModel)
    private readonly commentModel: types.ModelType<CommentEntity>,
    @inject(Component.UserModel)
    private readonly userModel: types.ModelType<UserEntity>
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
    const offers = await this.offerModel
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
            isFavorite: false,
            commentsCount: { $size: '$comments' },
          },
        },
        // { $unset: ['comments'] },
      ])
      .limit(count)
      .exec();

    if (userId) {
      const user = await this.userModel.findById(userId);
      if (user) {
        offers.map((offer) => {
          offer.isFavorite = user.favoriteOffers.includes(offer.id);
        });
      }
    }
    return offers;
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
    const offers = await this.offerModel
      .find({ 'city.name': cityName, isPremium: true })
      .sort({ date: SortType.Down })
      .limit(count)
      .populate('hostId')
      .exec();

    if (userId) {
      const user = await this.userModel.findById(userId);
      if (user) {
        offers.map((offer) => {
          offer.isFavorite = user.favoriteOffers.includes(offer.id);
        });
      }
    }
    return offers;
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.offerModel.exists({ _id: documentId })) !== null;
  }

  public async findNew(count: number): Promise<OfferEntityDocument[]> {
    const limit = count ?? DefaultCount.offer;
    return this.offerModel
      .find()
      .sort({ createdAt: SortType.Down })
      .limit(limit)
      .populate('hostId')
      .exec();
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
