import { ILogger } from '../shared/libs/logger/index.js';
import { IConfig, TRestSchema } from '../shared/libs/config/index.js';

export class RestApplication {
  constructor(
    private readonly logger: ILogger,
    private readonly config: IConfig<TRestSchema>
  ) {}

  public async init() {
    this.logger.info('Приложение инициализировано');
    this.logger.info(`Значение из env $PORT: ${this.config.get('PORT')}`);
  }
}
