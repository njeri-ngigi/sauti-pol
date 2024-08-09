import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from '../../core/constants';
import { SignupDto } from '../dto/signup.dto';
import { User } from './user.model';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userModel: typeof User,
  ) {}

  async findOneByEmail(email: string): Promise<User> {
    return await this.userModel.findOne<User>({ where: { email } });
  }

  async createUser(user: SignupDto): Promise<User> {
    const dbUser = await this.findOneByEmail(user.email);
    if (dbUser) {
      throw new ConflictException('User already exists');
    }

    return await this.userModel.create<User>(user);
  }
}
