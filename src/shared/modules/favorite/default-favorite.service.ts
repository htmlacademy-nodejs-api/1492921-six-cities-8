import { types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import { Component, SortType } from '../../types/index.js';
import { ILogger } from '../../libs/logger/index.js';
import { IFavoriteService } from './index.js';
import { OfferEntity, OfferEntityDocument } from '../offer/index.js';
import { UserEntity } from '../user/index.js';
@injectable()
export class DefaultFavoriteService implements IFavoriteService {
  constructor(
    @inject(Component.Logger) private readonly logger: ILogger,
    @inject(Component.OfferModel)
    private readonly offerModel: types.ModelType<OfferEntity>,
    @inject(Component.UserModel)
    private readonly userModel: types.ModelType<UserEntity>
  ) {}

  public async getFavorites(userId: string): Promise<string[]> {
    const user = await this.userModel.findById(userId).exec();
    return user?.favoriteOffers ?? [];
  }

  public async exists(userId: string, offerId: string): Promise<boolean> {
    const favorites = await this.getFavorites(userId);
    return favorites.includes(offerId);
  }

  public async addFavorite(
    userId: string,
    offerId: string
  ): Promise<OfferEntityDocument | null> {
    if (!(await this.exists(userId, offerId))) {
      const favorites = await this.getFavorites(userId);
      const offer = await this.offerModel.findById(offerId);
      if (offer) {
        favorites.push(offerId);
        await this.userModel
          .findByIdAndUpdate(userId, { favoriteOffers: favorites })
          .exec();
        offer.isFavorite = true;
        this.logger.info(
          `Предложение аренды с id = ${offerId} добавлено в избранное`
        );
        return offer;
      }
    }
    return null;
  }

  public async delFavorite(
    userId: string,
    offerId: string
  ): Promise<OfferEntityDocument | null> {
    if (await this.exists(userId, offerId)) {
      const favorites = await this.getFavorites(userId);
      const offer = await this.offerModel.findById(offerId);
      if (offer) {
        await this.userModel
          .findByIdAndUpdate(userId, {
            favoriteOffers: favorites.filter((id) => id !== offerId),
          })
          .exec();
        offer.isFavorite = false;
        this.logger.info(
          `Предложение аренды с id = ${offerId} удалено из избранного`
        );
        return offer;
      }
    }
    return null;
  }

  public async find(userId: string): Promise<OfferEntityDocument[]> {
    const favorites = await this.getFavorites(userId);
    if (favorites.length === 0) {
      return [];
    }
    return this.offerModel
      .aggregate([
        {
          $addFields: {
            id: { $toString: '$_id' },
          },
        },
        { $match: { id: { $in: favorites } } },
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
            isFavorite: true,
            commentsCount: { $size: '$comments' },
          },
        },
        { $unset: ['comments'] },
      ])
      .sort({ date: SortType.Down })
      .exec();
  }
}
