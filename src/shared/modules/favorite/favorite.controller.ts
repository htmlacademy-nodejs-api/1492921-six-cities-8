import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';

import { BaseController, HttpMethod } from '../../libs/rest/index.js';
import { ILogger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { IFavoriteService } from './index.js';

@injectable()
export class FavoriteController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: ILogger,
    @inject(Component.FavoriteService)
    private readonly favoriteService: IFavoriteService
  ) {
    super(logger);

    this.logger.info('Регистрация маршрутов для FavoriteController ...');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Post,
      handler: this.add,
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
    });
  }

  public async index(_req: Request, res: Response): Promise<void> {
    this.logger.info('Вывод списка избранных');
    const favorites = await this.favoriteService.find('123'); // пока заглушка вместо userId
    this.ok(res, favorites);
  }

  public add(_req: Request, _res: Response): void {
    // Код обработчика
    this.logger.info('Добавляем в избранное');
  }

  public delete(_req: Request, _res: Response): void {
    // Код обработчика
    this.logger.info('Удаляем из избранного');
  }
}
