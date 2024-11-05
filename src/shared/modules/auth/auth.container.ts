import { Container } from 'inversify';

import { IAuthService } from './auth-service.interface.js';
import { Component } from '../../types/index.js';
import { DefaultAuthService } from './default-auth.service.js';
import { IExceptionFilter } from '../../libs/rest/index.js';
import { AuthExceptionFilter } from './auth.exception-filter.js';

export function createAuthContainer() {
  const authContainer = new Container();
  authContainer
    .bind<IAuthService>(Component.AuthService)
    .to(DefaultAuthService)
    .inSingletonScope();
  authContainer
    .bind<IExceptionFilter>(Component.AuthExceptionFilter)
    .to(AuthExceptionFilter)
    .inSingletonScope();

  return authContainer;
}
