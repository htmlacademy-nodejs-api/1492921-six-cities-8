import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';

import { ICommentService } from './comment-service.interface.js';
import { Component } from '../../types/index.js';
import { CommentEntity, CommentModel } from './comment.entity.js';
import { DefaultCommentService } from './default-comment.service.js';
import CommentController from './comment.controller.js';
import { IController } from '../../libs/rest/index.js';

export function createCommentContainer() {
  const commentContainer = new Container();

  commentContainer
    .bind<ICommentService>(Component.CommentService)
    .to(DefaultCommentService)
    .inSingletonScope();
  commentContainer
    .bind<types.ModelType<CommentEntity>>(Component.CommentModel)
    .toConstantValue(CommentModel);
  commentContainer
    .bind<IController>(Component.CommentController)
    .to(CommentController)
    .inSingletonScope();

  return commentContainer;
}
