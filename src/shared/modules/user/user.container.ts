import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';

import { IUserService } from './user-service.interface.js';
import { Component } from '../../types/index.js';
import { DefaultUserService } from './default-user.service.js';
import { UserEntity, UserModel } from './user.entity.js';
import { UserController } from './index.js';
import { IController } from '../../libs/rest/index.js';

export function createUserContainer() {
  const userContainer = new Container();
  userContainer
    .bind<IUserService>(Component.UserService)
    .to(DefaultUserService)
    .inSingletonScope();
  userContainer
    .bind<types.ModelType<UserEntity>>(Component.UserModel)
    .toConstantValue(UserModel);
  userContainer
    .bind<IController>(Component.UserController)
    .to(UserController)
    .inSingletonScope();

  return userContainer;
}
