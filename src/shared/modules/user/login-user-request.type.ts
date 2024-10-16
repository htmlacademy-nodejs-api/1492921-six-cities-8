import { Request } from 'express';

import { TRequestBody, TRequestParams } from '../../libs/rest/index.js';
import { LoginUserDto } from './dto/login-user.dto.js';

export type TLoginUserRequest = Request<
  TRequestParams,
  TRequestBody,
  LoginUserDto
>;
