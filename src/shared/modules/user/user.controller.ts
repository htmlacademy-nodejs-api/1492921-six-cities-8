import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import {
  BaseController,
  HttpError,
  HttpMethod,
  // PrivateRouteMiddleware,
  UploadFileMiddleware,
  ValidateDtoMiddleware,
  ValidateObjectIdMiddleware,
} from '../../libs/rest/index.js';
import { ILogger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { TCreateUserRequest, TLoginUserRequest } from './user-request.type.js';
import { IUserService } from './user-service.interface.js';
import { IConfig, TRestSchema } from '../../libs/config/index.js';
import { fillDTO, generateRandomValue } from '../../helpers/index.js';
import { UserRdo } from './rdo/user.rdo.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { LoginUserDto } from './dto/login-user.dto.js';
import { UploadAvatarUserRdo } from './index.js';
import { IAuthService } from '../auth/index.js';
import { LoggedUserRdo } from './rdo/logged-user.rdo.js';

// Временно константа для отладки, пока не научились считывать данные о пользователе из токена
export const USER_ID = '6713ca5c6dc3e0bcd4ada1cd';
@injectable()
export default class UserController extends BaseController {
  private salt: string;

  constructor(
    @inject(Component.Logger)
    protected readonly logger: ILogger,
    @inject(Component.UserService)
    private readonly userService: IUserService,
    @inject(Component.Config)
    private readonly configService: IConfig<TRestSchema>,
    @inject(Component.AuthService)
    private readonly authService: IAuthService
  ) {
    super(logger);
    this.salt = this.configService.get('SALT');

    this.logger.info('Регистрация маршрутов для UserController ...');

    this.addRoute({
      path: '/register',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateUserDto)],
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Post,
      handler: this.login,
      middlewares: [new ValidateDtoMiddleware(LoginUserDto)],
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Get,
      handler: this.checkAuthenticate,
      // middlewares: [new PrivateRouteMiddleware()],
    });
    this.addRoute({
      path: '/logout',
      method: HttpMethod.Delete,
      handler: this.logout,
    });
    this.addRoute({
      path: '/avatar/:userId',
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new ValidateObjectIdMiddleware('userId'),
        new UploadFileMiddleware(
          this.configService.get('UPLOAD_DIRECTORY'),
          'avatar'
        ),
      ],
    });
  }

  public checkUser(_token: string): boolean {
    // Пока заглушка
    if (generateRandomValue(1, 2) === 1) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Пользователь не авторизован',
        'UserController'
      );
      return false;
    }
    return true;
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

    const user = await this.authService.verify(body);
    const token = await this.authService.authenticate(user);
    const responseData = fillDTO(LoggedUserRdo, user);
    this.ok(res, Object.assign(responseData, { token }));
  }

  public async checkAuthenticate({ tokenPayload }: Request, res: Response) {
    if (!tokenPayload) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController'
      );
    }
    const { email } = tokenPayload;
    const foundedUser = await this.userService.findByEmail(email);

    if (!foundedUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController'
      );
    }

    this.ok(res, fillDTO(LoggedUserRdo, foundedUser));
  }

  public async logout(req: TLoginUserRequest, res: Response): Promise<void> {
    const {
      tokenPayload: { email },
    } = req;
    await this.userService.findByEmail(email);
    this.noContent(res, {});
  }

  public async uploadAvatar({ params, file }: Request, res: Response) {
    const { userId } = params;
    const uploadFile = { avatarUrl: file?.filename };
    await this.userService.updateById(userId, uploadFile);
    this.created(
      res,
      fillDTO(UploadAvatarUserRdo, { filepath: uploadFile.avatarUrl })
    );
  }
}
