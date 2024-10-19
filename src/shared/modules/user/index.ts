import { DocumentType } from '@typegoose/typegoose';
import { UserEntity } from './user.entity.js';

export {
  UserModel,
  UserEntity,
} from './user.entity.js';

export { CreateUserDto } from './dto/create-user.dto.js';
export { UpdateUserDto } from './dto/update-user.dto.js';
export { LoginUserDto } from './dto/login-user.dto.js';
export { UserRdo } from './rdo/user.rdo.js';
export { DefaultUserService } from './default-user.service.js';
export { createUserContainer } from './user.container.js';
export { IUserService } from './user-service.interface.js';
export { UserController } from './user.controller.js';

export type UserEntityDocument = DocumentType<UserEntity>;
