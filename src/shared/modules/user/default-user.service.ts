import { types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/index.js';
import { ILogger } from '../../libs/logger/index.js';
import {
  CreateUserDto,
  IUserService,
  UpdateUserDto,
  UserEntityDocument,
  UserEntity,
} from './index.js';

@injectable()
export class DefaultUserService implements IUserService {
  constructor(
    @inject(Component.Logger) private readonly logger: ILogger,
    @inject(Component.UserModel)
    private readonly userModel: types.ModelType<UserEntity>
  ) {}

  public async create(
    dto: CreateUserDto,
    salt: string
  ): Promise<UserEntityDocument> {
    const user = new UserEntity(dto);
    user.setPassword(dto.password, salt);

    const result = await this.userModel.create(user);
    this.logger.info(`Новый пользователь создан: ${user.email}`);
    return result;
  }

  public async findByEmail(email: string): Promise<UserEntityDocument | null> {
    return this.userModel.findOne({ email });
  }

  public async findOrCreate(
    dto: CreateUserDto,
    salt: string
  ): Promise<UserEntityDocument> {
    const existedUser = await this.findByEmail(dto.email);

    if (existedUser) {
      return existedUser;
    }

    return this.create(dto, salt);
  }

  public async updateById(
    userId: string,
    dto: UpdateUserDto
  ): Promise<UserEntityDocument | null> {
    return this.userModel.findByIdAndUpdate(userId, dto, { new: true }).exec();
  }
}
