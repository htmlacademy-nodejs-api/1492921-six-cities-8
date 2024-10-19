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
//import { Cities } from '../../../const/data.js';

@injectable()
export class DefaultOfferService implements IOfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: ILogger,
    @inject(Component.OfferModel)
    private readonly offerModel: types.ModelType<OfferEntity>,
    @inject(Component.CommentModel)
    private readonly commentModel: types.ModelType<CommentEntity>
  ) {}

  public async create(dto: CreateOfferDto): Promise<OfferEntityDocument> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`Новое предложение аренды создано: ${dto.title}`);
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
      result.commentCount = comments?.count ?? 0;
    }
    return result;
  }

  public async find(
    count: number = DefaultCount.offer
  ): Promise<OfferEntityDocument[]> {
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
            as: 'host',
          },
        },
        {
          $addFields: {
            id: { $toString: '$_id' },
            isFavorite: false,
            commentsCount: { $size: '$comments' },
          },
        },
        // { $unset: ['comments', 'hostId'] },
      ])
      .limit(count)
      .exec();
  }

  public async deleteById(
    offerId: string
  ): Promise<OfferEntityDocument | null> {
    return this.offerModel.findByIdAndDelete(offerId).exec();
  }

  public async updateById(
    offerId: string,
    dto: UpdateOfferDto
  ): Promise<OfferEntityDocument | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, dto, { new: true })
      .populate('hostId')
      .exec();
  }

  public async findPremium(
    cityName: TCityName
  ): Promise<OfferEntityDocument[]> {
    const limit = DefaultCount.premium;
    return this.offerModel
      .find({ 'city.name': cityName, isPremium: true }, {}, { limit })
      .populate('hostId')
      .exec();
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.offerModel.exists({ _id: documentId })) !== null;
  }

  public async incCommentCount(
    offerId: string
  ): Promise<OfferEntityDocument | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, {
        $inc: {
          commentCount: 1,
        },
      })
      .exec();
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
