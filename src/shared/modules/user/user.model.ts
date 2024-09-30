import { Schema, Document, model } from 'mongoose';

import { TUser } from '../../types/index.js';

export interface IUserDocument extends TUser, Document {
  createdAt: Date,
  updatedAt: Date
}

const userSchema = new Schema({
  name: {
    type: String,
    minlength: [1, 'Имя пользователя (name) должно быть не менее 1 символа'],
    maxlength: [15, 'Имя пользователя (name) должно быть не более 15 символов'],
  },
  email: {
    type: String,
    unique: true,
    match: [/^([\w-\\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Email не корректный'],
    required: true,
  },
  avatarUrl: {
    type: String,
    match: [/\.(?:jpg|png)$/i, 'Файл с изображением пользователя (avatarUrl) должен быть в формате .jpg или .png'],
  },
  password: {
    type: String,
    required: true,
    minlength: [6, 'Длина пароля должна быть не менее 6 символов'],
    maxlength: [12, 'Длина пароля должна быть не более 12 символов'],
  },
  isPro: {
    type: Boolean,
    required: true,
  }
}, { timestamps: true });

export const UserModel = model<IUserDocument>('User', userSchema);
