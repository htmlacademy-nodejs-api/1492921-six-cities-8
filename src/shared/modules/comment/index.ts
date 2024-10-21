import { DocumentType } from '@typegoose/typegoose';

import { CommentEntity } from './comment.entity.js';

export { CreateCommentDto } from './dto/create-comment.dto.js';
export { ICommentService } from './comment-service.interface.js';
export { CommentEntity, CommentModel } from './comment.entity.js';
export { DefaultCommentService } from './default-comment.service.js';
export { createCommentContainer } from './comment.container.js';
export { CommentRdo } from './rdo/comment.rdo.js';

export type TCommentEntityDocument = DocumentType<CommentEntity>;
