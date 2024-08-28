import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { SEQUELIZE } from '../../core/constants';
import { databaseProviders } from '../../core/database/database.providers';
import { SignupDto } from '../dto/signup.dto';
import { UserModule } from './user.module';
import { userProviders } from './user.provider';
import { UserService } from './user.service';

// Helper function to assert user
const assertUser = (user, newUser) => {
  expect(user.email).toBe(newUser.email);
  expect(user.password).toEqual(newUser.password);
  expect(user.firstName).toBe(newUser.firstName);
  expect(user.lastName).toBe(newUser.lastName);
  expect(user.isActive).toBe(true);
  expect(user.phone).toBe(null);
  expect(user.middleName).toBe(null);
};

describe('UserService', () => {
  let mockModule: TestingModule;
  let userService: UserService;
  const defaultUser: SignupDto = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };

  beforeAll(async () => {
    mockModule = await Test.createTestingModule({
      imports: [UserModule],
      providers: [UserService, ...databaseProviders, ...userProviders],
    }).compile();

    // get user service
    userService = await mockModule.resolve(UserService);

    // insert default user
    await userService.createUser(defaultUser);
  });

  afterAll(async () => {
    await mockModule.get(SEQUELIZE).close();
  });

  describe('findOneByEmail', () => {
    it('should return a user', async () => {
      const user = await userService.findOneByEmail(defaultUser.email);

      assertUser(user, defaultUser);
    });

    it('should return null if no user found', async () => {
      const nonExistentUserEmail = 'non-user@test.go.ke';
      const user = await userService.findOneByEmail(nonExistentUserEmail);

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

      assertUser(user, newUser);
    });

    it('should throw a ConflictException if user already exists', async () => {
      try {
        await userService.createUser(defaultUser);
      } catch (error) {
        expect(error.message).toBe('User already exists');
      }
    });
  });
});
