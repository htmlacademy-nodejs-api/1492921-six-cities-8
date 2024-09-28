import { inject, injectable } from 'inversify';
import { ILogger } from '../shared/libs/logger/index.js';
import { IConfig, TRestSchema } from '../shared/libs/config/index.js';
import { Component } from '../shared/types/index.js';
@injectable()
export class RestApplication {
  constructor(
    @inject(Component.Logger) private readonly logger: ILogger,
    @inject(Component.Config) private readonly config: IConfig<TRestSchema>,
  ) {}

  public async init() {
    this.logger.info('Приложение инициализировано');
    this.logger.info(`Значение из env $PORT: ${this.config.get('PORT')}`);
  }
}
