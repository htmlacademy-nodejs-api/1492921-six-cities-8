import { ILogger } from '../shared/libs/logger/index.js';
import { IConfig, RestSchema } from '../shared/libs/config/index.js';

export class RestApplication {
  constructor(
    private readonly logger: ILogger,
    private readonly config: IConfig<RestSchema>
  ) {}

  public async init() {
    this.logger.info('Приложение инициализировано');
    this.logger.info(`Значение из env $PORT: ${this.config.get('PORT')}`);
  }
}
