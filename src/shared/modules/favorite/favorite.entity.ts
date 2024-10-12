import {
  getModelForClass,
  prop,
  modelOptions,
  Ref,
} from '@typegoose/typegoose';
import { OfferEntity } from '../offer/index.js';
import { UserEntity } from '../user/index.js';

@modelOptions({
  schemaOptions: {
    collection: 'favorites',
  },
})
export class FavoriteEntity {
  @prop({ ref: OfferEntity, required: true })
  public offerId: Ref<OfferEntity>;

  @prop({ ref: UserEntity, required: true })
  public userId: Ref<UserEntity>;
}

export const FavoriteModel = getModelForClass(FavoriteEntity);
