import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { SEQUELIZE } from '../../core/constants';
import { SignupDto } from '../dto/signup.dto';
import { Roles } from './role.provider';
import { UserModule } from './user.module';
import { UserService } from './user.service';

describe('UserService', () => {
  let mockModule: TestingModule;
  let userService: UserService;
  const defaultUser: SignupDto = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    phone: faker.phone.number(),
  };

  beforeAll(async () => {
    mockModule = await Test.createTestingModule({
      imports: [UserModule],
    }).compile();

    // get user service
    userService = await mockModule.resolve(UserService);

    // insert default user
    await userService.createUser(defaultUser);
  });

  afterAll(async () => {
    await mockModule.get(SEQUELIZE).close();
  });

  describe('findOneById', () => {
    it('should return a user with the id provided', async () => {
      const newUser: SignupDto = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      const createdUser = await userService.createUser(newUser);

      const dbUser = await userService.findOneById(createdUser.id);

      expect(createdUser.toJSON()).toStrictEqual(dbUser.toJSON());
    });

    it('should throw a BadRequestException if invalid uuid provided', async () => {
      try {
        await userService.findOneById('invalid-uuid');
      } catch (error) {
        expect(error.message).toBe('Invalid UUID');
      }
    });

    it('should throw a NotFoundException if user not found', async () => {
      const nonExistentUserId = '00000000-0000-0000-0000-000000000000';

      try {
        await userService.findOneById(nonExistentUserId);
      } catch (error) {
        expect(error.message).toBe('User not found');
      }
    });
  });

  describe('findOneByEmailOrPhone', () => {
    it('should return a user with the email and phone provided', async () => {
      const user = await userService.findOneByEmailOrPhone({
        email: defaultUser.email,
        phone: defaultUser.phone,
      });

      expect(user).toMatchObject(defaultUser);
    });

    it('should return a user if email only provided', async () => {
      const user = await userService.findOneByEmailOrPhone({
        email: defaultUser.email,
      });

      expect(user).toMatchObject(defaultUser);
    });

    it('should return a user if phone only provided', async () => {
      const user = await userService.findOneByEmailOrPhone({
        email: null,
        phone: defaultUser.phone,
      });

      expect(user).toMatchObject(defaultUser);
    });

    it('should return null if no user found', async () => {
      const nonExistentUserEmail = 'non-user@test.go.ke';
      const nonExistentUserPhone = '11111';

      const user = await userService.findOneByEmailOrPhone({
        email: nonExistentUserEmail,
        phone: nonExistentUserPhone,
      });

      expect(user).toBe(null);
    });

    it('should return null if no email or phone provided', async () => {
      const user = await userService.findOneByEmailOrPhone({
        email: null,
        phone: null,
      });

      expect(user).toBe(null);
    });
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const newUser: SignupDto = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      const user = await userService.createUser(newUser);

      expect(user).toMatchObject(newUser);
    });

    it('should throw a ConflictException if user already exists', async () => {
      try {
        await userService.createUser(defaultUser);
      } catch (error) {
        expect(error.message).toBe('User with email or phone already exists');
      }
    });

    it('should throw a ConflictException if user with email already exists', async () => {
      const newUser: SignupDto = {
        ...defaultUser,
        phone: faker.phone.number(),
      };

      try {
        await userService.createUser(newUser);
      } catch (error) {
        expect(error.message).toBe('User with email or phone already exists');
      }
    });

    it('should throw a ConflictException if user with phone already exists', async () => {
      const newUser: SignupDto = {
        ...defaultUser,
        email: faker.internet.email(),
      };

      try {
        await userService.createUser(newUser);
      } catch (error) {
        expect(error.message).toBe('User with email or phone already exists');
      }
    });
  });

  describe('updateUserRole', () => {
    it('should update user role', async () => {
      const newUser: SignupDto = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      const user = await userService.createUser(newUser);
      expect(user.role).toBe(Roles.USER);

      const updatedUser = await userService.updateUserRole(user.id, 'admin');
      expect(updatedUser.role).toBe(Roles.ADMIN);
    });

    it('should throw a BadRequestException if invalid uuid provided', async () => {
      try {
        await userService.updateUserRole('invalid-uuid', 'admin');
      } catch (error) {
        expect(error.message).toBe('Invalid UUID');
      }
    });

    it('should throw a NotFoundException if user not found', async () => {
      const nonExistentUserId = '00000000-0000-0000-0000-000000000000';

      try {
        await userService.updateUserRole(nonExistentUserId, 'admin');
      } catch (error) {
        expect(error.message).toBe('User not found');
      }
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = await userService.findAll();

      expect(users.length).toBeGreaterThanOrEqual(1);
    });
  });
});
