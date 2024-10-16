import { inject, injectable } from 'inversify';
import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import {
  BaseController,
  HttpError,
  HttpMethod,
} from '../../libs/rest/index.js';
import { ILogger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { TCreateUserRequest } from './create-user-request.type.js';
import { IUserService } from './user-service.interface.js';
import { IConfig, TRestSchema } from '../../libs/config/index.js';
import { fillDTO } from '../../helpers/index.js';
import { UserRdo } from './rdo/user.rdo.js';
import { TLoginUserRequest } from './login-user-request.type.js';

@injectable()
export class UserController extends BaseController {
  private salt: string;

  constructor(
    @inject(Component.Logger) protected readonly logger: ILogger,
    @inject(Component.UserService) private readonly userService: IUserService,
    @inject(Component.Config)
    private readonly configService: IConfig<TRestSchema>
  ) {
    super(logger);
    this.salt = this.configService.get('SALT');

    this.logger.info('Регистрация маршрутов для UserController ...');

    this.addRoute({
      path: '/register',
      method: HttpMethod.Post,
      handler: this.create,
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Post,
      handler: this.login,
    });
    /*
    this.addRoute({
      path: '/login',
      method: HttpMethod.Get,
      handler: this.getState,
    });

    this.addRoute({
      path: '/logout',
      method: HttpMethod.Delete,
      handler: this.logout,
    });
    */
  }

  public async create(
    { body }: TCreateUserRequest,
    res: Response
  ): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);

    if (existsUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `Пользователь с email ${body.email} уже существует.`,
        'UserController'
      );
    }

    const result = await this.userService.create(body, this.salt);
    this.created(res, fillDTO(UserRdo, result));
  }

  public async login(
    { body }: TLoginUserRequest,
    res: Response
  ): Promise<void> {
    if (!body.email || !body.password) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Ошибка тела запроса',
        'UserController'
      );
    }

    const user = await this.userService.findByEmail(body.email);

    if (!user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        `Пользователь с email ${body.email} не найден.`,
        'UserController'
      );
    }

    if (!user.isValidPassword(body.password, this.salt)) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Пользователь не авторизован',
        'UserController'
      );
    }

    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Пока не реализовано',
      'UserController'
    );

    this.ok(res, user);
  }

  public async getState(_req: Request, _res: Response): Promise<void> {
    // Код обработчика
  }

  public logout(_req: Request, _res: Response): void {
    // Код обработчика
  }
}
