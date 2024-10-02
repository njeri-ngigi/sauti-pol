import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class SignupDto {
  @IsNotEmpty()
  readonly firstName: string;

  @IsOptional()
  readonly middleName?: string;

  @IsNotEmpty()
  readonly lastName: string;

  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;

  @IsOptional()
  readonly phone?: string;
}
