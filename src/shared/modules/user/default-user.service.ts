import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';

import { IUserService } from './user-service.interface.js';
import { UserEntity, UserModel } from './user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { Component } from '../../types/index.js';
import { ILogger } from '../../libs/logger/index.js';

@injectable()
export class DefaultUserService implements IUserService {
  constructor(
    @inject(Component.Logger) private readonly logger: ILogger,
  ) {}

  public async create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity(dto);
    user.setPassword(dto.password, salt);

    const result = await userModel.create(user);
    this.logger.info(`Новый пользователь создан: ${user.email}`);

    return result;
  }
}

