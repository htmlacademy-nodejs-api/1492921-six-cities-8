import { types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/index.js';
import { ILogger } from '../../libs/logger/index.js';
import {
  IFavoriteService,
  UpdateFavoriteDto,
  FavoriteEntity,
} from './index.js';
import { OfferEntity, OfferEntityDocument } from '../offer/index.js';

@injectable()
export class DefaultFavoriteService implements IFavoriteService {
  constructor(
    @inject(Component.Logger) private readonly logger: ILogger,
    @inject(Component.FavoriteModel)
    private readonly FavoriteModel: types.ModelType<FavoriteEntity>,
    @inject(Component.OfferModel)
    private readonly offerModel: types.ModelType<OfferEntity>
  ) {}

  private async exists(dto: UpdateFavoriteDto): Promise<boolean> {
    return (await this.FavoriteModel.exists(dto)) !== null;
  }

  public async addFavorite(
    dto: UpdateFavoriteDto
  ): Promise<OfferEntityDocument | null> {
    if (!this.exists(dto)) {
      const result = await this.FavoriteModel.create(dto);
      if (result) {
        this.logger.info(
          `Предложение аренды с id = ${dto.offerId} добавлено в избранное пользователя с id =  ${dto.userId}`
        );
        return result.populate('offerId');
      }
    }
    return null;
  }

  public async delFavorite(
    dto: UpdateFavoriteDto
  ): Promise<OfferEntityDocument | null> {
    if (!(await this.exists(dto))) {
      if (await this.FavoriteModel.findOneAndDelete(dto)) {
        this.logger.info(
          `Предложение аренды с id = ${dto.offerId} удалено из избранного пользователя с id =  ${dto.userId}`
        );
        return this.offerModel.findById(dto.offerId);
      }
    }
    return null;
  }

  public async find(userId: string): Promise<OfferEntityDocument[]> {
    return this.offerModel
      .find({ userId: userId }, {}, {})
      .populate('offerId')
      .exec();
  }
}
