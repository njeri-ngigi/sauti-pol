import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';

@Injectable()
export class LoginValidatorMiddleware implements NestMiddleware {
  use(req: any, _: any, next: (error?: Error | any) => void) {
    const { email, password } = req.body;

    if (!email || email.trim().length === 0) {
      throw new BadRequestException('email cannot be empty');
    }

    if (!password || password.trim().length === 0) {
      throw new BadRequestException('password cannot be empty');
    }

    next();
  }
}
