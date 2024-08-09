export class SignupDto {
  readonly firstName: string;
  readonly middleName?: string;
  readonly lastName: string;
  readonly email: string;
  readonly password: string;
  readonly phone?: string;
}
