import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { isUUID } from 'validator';
import { USER_REPOSITORY } from '../../core/constants';
import { SignupDto } from '../dto/signup.dto';
import { Role } from './role.provider';
import { User } from './user.model';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userModel: typeof User,
  ) {}

  async findOneByEmail(email: string): Promise<User> {
    return await this.userModel.findOne<User>({ where: { email } });
  }

  async findOneByPhone(phone: string): Promise<User> {
    return await this.userModel.findOne<User>({ where: { phone } });
  }

  async findOneById(id: string): Promise<User> {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }

    const user = await this.userModel.findByPk<User>(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async createUser(user: SignupDto): Promise<User> {
    const dbUserByEmail = await this.findOneByEmail(user.email);
    if (dbUserByEmail) {
      throw new ConflictException('User already exists');
    }

    if (user.phone) {
      const dbUserByPhone = await this.findOneByPhone(user.phone);
      if (dbUserByPhone) {
        throw new ConflictException('User with phone number already exists');
      }
    }

    return await this.userModel.create<User>(user);
  }

  async updateUserRole(id: string, role: Role): Promise<User> {
    const dbUser = await this.findOneById(id);

    return await dbUser.update({ role });
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.findAll<User>();
  }
}
