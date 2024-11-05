import { Expose, Type } from 'class-transformer';
import { UserRdo } from '../../user/index.js';
import { Matches } from 'class-validator';

export class CommentRdo {
  @Expose()
  public id: string;

  @Expose({ name: 'createdAt' })
  public date: string;

  @Expose({ name: 'userId' })
  @Type(() => UserRdo)
  public user: UserRdo;

  @Expose()
  public comment: string;

  @Expose()
  @Matches(/^\d+(\.0)?$/)
  public rating: number;
}
