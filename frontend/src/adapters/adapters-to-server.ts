import { UserType } from '../const';
import { CreateUserDto } from '../dto/users/create-user.dto';
import { UserRegister } from '../types/types';

export const adapterUserToServer = (user: UserRegister): CreateUserDto => ({
  name: user.name,
  avatar: user.avatar,
  isPro: user.type === UserType.Pro,
  email: user.email,
  password: user.password,
});
