import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Op } from 'sequelize';
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

  async findOneByEmailOrPhone({
    email,
    phone,
  }: Pick<SignupDto, 'email' | 'phone'>): Promise<User> {
    return await this.userModel.findOne<User>({
      where: {
        [Op.or]: [
          email ? { email: { [Op.eq]: email } } : null,
          phone ? { phone: { [Op.eq]: phone } } : null,
        ],
      },
    });
  }

  async createUser(user: SignupDto): Promise<User> {
    const dbUserByEmailOrPhone = await this.findOneByEmailOrPhone({
      email: user.email,
      phone: user.phone,
    });

    if (dbUserByEmailOrPhone) {
      throw new ConflictException('User with email or phone already exists');
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
