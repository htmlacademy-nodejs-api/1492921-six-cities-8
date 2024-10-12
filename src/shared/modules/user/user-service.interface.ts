import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UserEntityDocument } from './index.js';

export interface IUserService {
  create(dto: CreateUserDto, salt: string): Promise<UserEntityDocument>;
  findByEmail(email: string): Promise<UserEntityDocument | null>;
  findOrCreate(dto: CreateUserDto, salt: string): Promise<UserEntityDocument>;
  updateById(
    userId: string,
    dto: UpdateUserDto
  ): Promise<UserEntityDocument | null>;
}
