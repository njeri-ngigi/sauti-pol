import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
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
  private readonly logger = new Logger(UserService.name, {
    timestamp: true,
  });

  constructor(
    @Inject(USER_REPOSITORY) private readonly userModel: typeof User,
  ) {}

  async findOneById(id: string): Promise<User> {
    if (!isUUID(id)) {
      this.logger.error('Invalid UUID');
      throw new BadRequestException('Invalid UUID');
    }

    const user = await this.userModel.findByPk<User>(id);
    if (!user) {
      this.logger.error('User not found');
      throw new NotFoundException('User not found');
    }

    this.logger.debug(`User ${user.email} found`);
    return user;
  }

  findOneByEmailOrPhone({
    email,
    phone,
  }: Pick<SignupDto, 'email' | 'phone'>): Promise<User> {
    return this.userModel.findOne<User>({
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
      this.logger.error('User with email or phone already exists');
      throw new ConflictException('User with email or phone already exists');
    }

    this.logger.debug(`Creating user ${user.email}`);
    return this.userModel.create<User>(user);
  }

  async updateUserRole(id: string, role: Role): Promise<User> {
    const dbUser = await this.findOneById(id);

    this.logger.debug(`Updating role for user ${dbUser.email} to ${role}`);
    return dbUser.update({ role });
  }

  findAll(): Promise<User[]> {
    return this.userModel.findAll<User>();
  }
}
