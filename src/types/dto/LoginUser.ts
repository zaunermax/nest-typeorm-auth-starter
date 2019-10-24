import { IsString } from 'class-validator';

export class LoginUser {
  @IsString()
  readonly username!: string;

  @IsString()
  password!: string;
}
