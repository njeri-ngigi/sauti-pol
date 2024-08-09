import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class SignupValidatorMiddleware implements NestMiddleware {
  validatePhone(phone: string) {
    // TODO validate email by sending a confirmation text

    if (!phone) {
      return;
    }

    const hasNonNumbers = /[^0-9]/.test(phone);
    if (hasNonNumbers) {
      throw new BadRequestException('phone number must contain only numbers');
    }

    if (phone && phone.length !== 10) {
      throw new BadRequestException('phone number must be 10 digits');
    }
  }

  validateNames(firstName: string, lastName: string) {
    if (!firstName || firstName.trim().length === 0) {
      throw new BadRequestException('firstName cannot be empty');
    }

    if (!lastName || lastName.trim().length === 0) {
      throw new BadRequestException('lastName name cannot be empty');
    }
  }

  validateEmail(email: string) {
    // TODO validate email by sending a confirmation email

    if (!email || email.trim().length === 0) {
      throw new BadRequestException('email cannot be empty');
    }

    const validateEmail = new RegExp(
      "([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|\"([]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|[[\t -Z^-~]*])",
    );

    if (!validateEmail.test(email)) {
      throw new BadRequestException('invalid email address');
    }
  }

  validatePassword(password: string) {
    if (!password || password.trim().length === 0) {
      throw new BadRequestException('password cannot be empty');
    }

    if (password.length < 10) {
      throw new BadRequestException('password must be at least 10 characters');
    }

    const hasUpperCase = /[A-Z]/.test(password);
    if (!hasUpperCase) {
      throw new BadRequestException(
        'password must contain at least one uppercase letter',
      );
    }

    const hasDigits = /\d/.test(password);
    if (!hasDigits) {
      throw new BadRequestException('password must contain at least one digit');
    }

    const hasSpecialCharacters = /[^a-zA-Z0-9]/i.test(password);
    if (!hasSpecialCharacters) {
      throw new BadRequestException(
        'password must contain at least one special character',
      );
    }
  }

  saltPassword(password: string): string {
    // TODO: calculate cost factor depending on cpu speed
    // It should take at least 250ms to calculate the hash
    const BCRYPT_DEFAULT_COST = 10;
    return bcrypt.hashSync(password, BCRYPT_DEFAULT_COST);
  }

  use(req: Request, _: Response, next: NextFunction) {
    const { email, password, phone, firstName, lastName } = req.body;

    this.validateEmail(email);
    this.validatePassword(password);
    this.validateNames(firstName, lastName);
    this.validatePhone(phone);

    req.body.password = this.saltPassword(password);

    next();
  }
}
