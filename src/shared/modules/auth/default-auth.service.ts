import { inject, injectable } from 'inversify';
import * as crypto from 'node:crypto';
import { SignJWT } from 'jose';

import { IAuthService } from './auth-service.interface.js';
import { Component } from '../../types/index.js';
import { ILogger } from '../../libs/logger/index.js';
import { IUserService, LoginUserDto, UserEntity } from '../user/index.js';
import { TTokenPayload } from './types/tokenPayload.js';
import { IConfig, TRestSchema } from '../../libs/config/index.js';
import { JwtOptions } from './auth.constant.js';
import {
  UserNotFoundException,
  UserPasswordIncorrectException,
} from './errors/index.js';

@injectable()
export class DefaultAuthService implements IAuthService {
  constructor(
    @inject(Component.Logger) private readonly logger: ILogger,
    @inject(Component.UserService) private readonly userService: IUserService,
    @inject(Component.Config) private readonly config: IConfig<TRestSchema>
  ) {}

  public async authenticate(user: UserEntity): Promise<string> {
    const jwtSecret = this.config.get('JWT_SECRET');
    const secretKey = crypto.createSecretKey(jwtSecret, 'utf-8');
    const tokenPayload: TTokenPayload = {
      email: user.email,
      name: user.name,
      id: user.id,
    };

    this.logger.info(`Create token for ${user.email}`);
    return new SignJWT(tokenPayload)
      .setProtectedHeader({ alg: JwtOptions.algoritm })
      .setIssuedAt()
      .setExpirationTime(JwtOptions.expired)
      .sign(secretKey);
  }

  public async verify(dto: LoginUserDto): Promise<UserEntity> {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) {
      this.logger.warn(`User with ${dto.email} not found`);
      throw new UserNotFoundException();
    }

    if (!user.isValidPassword(dto.password, this.config.get('SALT'))) {
      this.logger.warn(`Incorrect password for ${dto.email}`);
      throw new UserPasswordIncorrectException();
    }

    return user;
  }
}
