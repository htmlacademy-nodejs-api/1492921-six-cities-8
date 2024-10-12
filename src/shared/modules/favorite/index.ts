import { DocumentType } from '@typegoose/typegoose';
import { FavoriteEntity } from './favorite.entity.js';

export {
  FavoriteModel,
  FavoriteEntity,
} from './favorite.entity.js';

export { UpdateFavoriteDto } from './dto/update-favorite.dto.js';
export { DefaultFavoriteService } from './default-favorite.service.js';
export { createFavoriteContainer } from './favorite.container.js';
export { IFavoriteService } from './favorite-service.interface.js';

export type FavoriteEntityDocument = DocumentType<FavoriteEntity>;
