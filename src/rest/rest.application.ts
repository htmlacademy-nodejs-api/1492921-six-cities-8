import { ILogger } from '../shared/libs/logger/index.js';

export class RestApplication {
  constructor(
    private readonly logger: ILogger
  ) {}

  public async init() {
    this.logger.info('Приложение инициализировано');
  }
}
