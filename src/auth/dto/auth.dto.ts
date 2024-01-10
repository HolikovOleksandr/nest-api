import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString() //<=== say about pass is string
  @IsNotEmpty()
  password: string; //<=== say about pass is string again???
}
