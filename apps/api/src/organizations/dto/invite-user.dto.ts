import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class InviteUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  role: string;
}
