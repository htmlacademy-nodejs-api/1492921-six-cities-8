import { inject, injectable } from 'inversify';
import express, { Express } from 'express';

import { ILogger } from '../shared/libs/logger/index.js';
import { IConfig, TRestSchema } from '../shared/libs/config/index.js';
import { Component } from '../shared/types/index.js';
import { IDatabaseClient } from '../shared/libs/database-client/index.js';
import { getMongoURI } from '../shared/helpers/index.js';
import { IController, IExceptionFilter } from '../shared/libs/rest/index.js';
@injectable()
export class RestApplication {
  private readonly server: Express;
  constructor(
    @inject(Component.Logger) private readonly logger: ILogger,
    @inject(Component.Config) private readonly config: IConfig<TRestSchema>,
    @inject(Component.DatabaseClient)
    private readonly databaseClient: IDatabaseClient,
    @inject(Component.FavoriteController)
    private readonly favoriteController: IController,
    @inject(Component.ExceptionFilter)
    private readonly appExceptionFilter: IExceptionFilter,
    @inject(Component.UserController)
    private readonly userController: IController,
    @inject(Component.OfferController)
    private readonly offerController: IController,
    @inject(Component.CommentController)
    private readonly commentController: IController
  ) {
    this.server = express();
  }

  private async initDb() {
    const mongoUri = getMongoURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME')
    );

    return this.databaseClient.connect(mongoUri);
  }

  private async _initServer() {
    const port = this.config.get('PORT');
    this.server.listen(port);
  }

  private async _initControllers() {
    this.server.use('/favorites', this.favoriteController.router);
    this.server.use('/users', this.userController.router);
    this.server.use('/', this.offerController.router);
    this.server.use('/comments', this.commentController.router);
  }

  private async _initMiddleware() {
    this.server.use(express.json());
    this.server.use(
      '/upload',
      express.static(this.config.get('UPLOAD_DIRECTORY'))
    );
  }

  private async _initExceptionFilters() {
    this.server.use(
      this.appExceptionFilter.catch.bind(this.appExceptionFilter)
    );
  }

  public async init() {
    this.logger.info('Приложение инициализировано.');

    this.logger.info('Инициализация базы данных ...');
    await this.initDb();
    this.logger.info('Инициализация базы данных завершена.');

    this.logger.info(
      'Инициализация промежуточного программного обеспечения на уровне приложения ...'
    );
    await this._initMiddleware();
    this.logger.info(
      'Инициализация промежуточного программного обеспечения на уровне приложения завершена.'
    );

    this.logger.info('Инициализация контроллеров ...');
    await this._initControllers();
    this.logger.info('Инициализация контроллеров завершена.');

    this.logger.info('Инициализация фильтрации ошибок ...');
    await this._initExceptionFilters();
    this.logger.info('Инициализация фильтрации ошибок завершена.');

    this.logger.info('Попытка запустить сервер ...');
    await this._initServer();
    this.logger.info(
      `🚀 Сервер запущен и ожидает обращений по адресу  http://${this.config.get('DB_HOST')}:${this.config.get('PORT')}`
    );
  }
}
