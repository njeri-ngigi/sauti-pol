import {
  BadRequestException,
  Injectable,
  Logger,
  NestMiddleware,
} from '@nestjs/common';

@Injectable()
export class LoginValidatorMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoginValidatorMiddleware.name, {
    timestamp: true,
  });

  use(req: any, _: any, next: (error?: Error | any) => void) {
    this.logger.debug('Validating login request in login middleware');

    const { email, password } = req.body;

    if (!email || email.trim().length === 0) {
      this.logger.error('Missing email');
      throw new BadRequestException('email cannot be empty');
    }

    if (!password || password.trim().length === 0) {
      this.logger.error('Missing password');
      throw new BadRequestException('password cannot be empty');
    }

    next();
  }
}
