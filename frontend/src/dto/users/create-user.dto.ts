export class CreateUserDto {
  public name!: string;
  public email!: string;
  public avatar?: File | undefined;
  public password!: string;
  public isPro!: boolean;
}
