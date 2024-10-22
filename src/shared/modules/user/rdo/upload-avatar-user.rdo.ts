import { Expose } from 'class-transformer';

export class UploadAvatarUserRdo {
  @Expose()
  public filepath: string;
}
