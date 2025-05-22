import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
  @IsEmail()
  @Expose()
  @IsNotEmpty()
  email: string;

  @IsString()
  @Expose()
  @IsNotEmpty()
  password: string;
}
