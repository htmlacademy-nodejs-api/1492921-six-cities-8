import { Request } from 'express';

import { TRequestBody, TRequestParams } from '../../libs/rest/index.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { LoginUserDto } from './dto/login-user.dto.js';

type TCreateUserRequest = Request<TRequestParams, TRequestBody, CreateUserDto>;

type TLoginUserRequest = Request<TRequestParams, TRequestBody, LoginUserDto>;

export type { TCreateUserRequest, TLoginUserRequest };
