import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from 'src/core/constants';
import { UserDto } from './dto/user.dto';
import { User } from './user.model';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userModel: typeof User,
  ) {}

  async createUser(user: UserDto): Promise<User> {
    return await this.userModel.create<User>(user);
  }

  async findOneByEmail(email: string): Promise<User> {
    console.log('>>>>> email', email);
    return await this.userModel.findOne<User>({ where: { email } });
  }
}

// Write answer on stackoverflow
//  /opt/homebrew/var/log/postgres.log
// $ initdb /opt/homebrew/var/postgresql@14
