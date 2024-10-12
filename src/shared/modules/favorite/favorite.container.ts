import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';

import { IFavoriteService } from './favorite-service.interface.js';
import { Component } from '../../types/index.js';
import { DefaultFavoriteService } from './default-favorite.service.js';
import { FavoriteEntity, FavoriteModel } from './favorite.entity.js';

export function createFavoriteContainer() {
  const FavoriteContainer = new Container();
  FavoriteContainer.bind<IFavoriteService>(Component.FavoriteService)
    .to(DefaultFavoriteService)
    .inSingletonScope();
  FavoriteContainer.bind<types.ModelType<FavoriteEntity>>(
    Component.FavoriteModel
  ).toConstantValue(FavoriteModel);

  return FavoriteContainer;
}
