import 'reflect-metadata';
import { Container } from 'inversify';

import { ILogger, PinoLogger } from './shared/libs/logger/index.js';
import { RestApplication } from './rest/index.js';
import { IConfig, RestConfig, TRestSchema } from './shared/libs/config/index.js';
import { Component } from './shared/types/index.js';

async function bootstrap() {
  const container = new Container();
  container.bind<RestApplication>(Component.RestApplication).to(RestApplication).inSingletonScope();
  container.bind<ILogger>(Component.Logger).to(PinoLogger).inSingletonScope();
  container.bind<IConfig<TRestSchema>>(Component.Config).to(RestConfig).inSingletonScope();

  const application = container.get<RestApplication>(Component.RestApplication);
  await application.init();
}

bootstrap();
