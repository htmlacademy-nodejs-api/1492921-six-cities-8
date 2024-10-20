import { Container } from 'inversify';

import { IFavoriteService } from './favorite-service.interface.js';
import { Component } from '../../types/index.js';
import { DefaultFavoriteService } from './default-favorite.service.js';
import { IController } from '../../libs/rest/index.js';
import { FavoriteController } from './favorite.controller.js';

export function createFavoriteContainer() {
  const favoriteContainer = new Container();
  favoriteContainer
    .bind<IFavoriteService>(Component.FavoriteService)
    .to(DefaultFavoriteService)
    .inSingletonScope();
  favoriteContainer
    .bind<IController>(Component.FavoriteController)
    .to(FavoriteController)
    .inSingletonScope();

  return favoriteContainer;
}
