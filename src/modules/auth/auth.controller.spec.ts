import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { SEQUELIZE } from '../../core/constants';
import { SignupDto } from '../dto/signup.dto';
import { AuthModule } from './auth.module';

describe('AuthController', () => {
  const validPassword = 'SomePassword123!';
  const accessToken = 'access-token';
  const defaultUser: SignupDto = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: validPassword,
    phone: '0711111111',
  };
  let app: INestApplication;
  let mockModule: TestingModule;

  beforeAll(async () => {
    mockModule = await Test.createTestingModule({
      imports: [AuthModule],
    })
      .overrideProvider(JwtService)
      .useValue({
        signAsync: () => accessToken,
      })
      .compile();

    // create the app instance
    app = mockModule.createNestApplication();
    await app.init();

    // signup default user
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send(defaultUser)
      .expect(201)
      .expect((response) => {
        expect(response.body.accessToken).toBe(accessToken);
      });
  });

  afterAll(async () => {
    await app.close();
    await mockModule.get(SEQUELIZE).close();
  });

  describe('POST /auth/login', () => {
    it('should login a user successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: defaultUser.email, password: defaultUser.password })
        .expect(200);

      expect(response.body.accessToken).toBe(accessToken);
    });

    describe('should return bad request error 400 if', () => {
      it('email is missing', async () => {
        await request(app.getHttpServer())
          .post('/auth/login')
          .send({
            password: defaultUser.password,
          })
          .expect(400)
          .expect((response) => {
            expect(response.body.message).toBe('email cannot be empty');
          });
      });

      it('email is empty', async () => {
        await request(app.getHttpServer())
          .post('/auth/login')
          .send({
            email: '',
            password: defaultUser.password,
          })
          .expect(400)
          .expect((response) => {
            expect(response.body.message).toBe('email cannot be empty');
          });
      });

      it('password is missing', async () => {
        await request(app.getHttpServer())
          .post('/auth/login')
          .send({
            email: defaultUser.email,
          })
          .expect(400)
          .expect((response) => {
            expect(response.body.message).toBe('password cannot be empty');
          });
      });

      it('password is empty', async () => {
        await request(app.getHttpServer())
          .post('/auth/login')
          .send({
            email: defaultUser.email,
            password: '',
          })
          .expect(400)
          .expect((response) => {
            expect(response.body.message).toBe('password cannot be empty');
          });
      });

      describe('should return unauthorized error 401 if', () => {
        it('email is invalid', async () => {
          const nonExistentUserEmail = 'non-user@test.go.ke';

          await request(app.getHttpServer())
            .post('/auth/login')
            .send({
              email: nonExistentUserEmail,
              password: defaultUser.password,
            })
            .expect(401)
            .expect((response) => {
              expect(response.body.message).toBe('Invalid email or password');
            });
        });

        it('password is invalid', async () => {
          const invalidPassword = 'invalid-password';

          await request(app.getHttpServer())
            .post('/auth/login')
            .send({
              email: defaultUser.email,
              password: invalidPassword,
            })
            .expect(401)
            .expect((response) => {
              expect(response.body.message).toBe('Invalid email or password');
            });
        });
      });
    });
  });

  describe('POST /auth/signup', () => {
    it('should signup a user successfully', async () => {
      const newUser: SignupDto = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: validPassword,
      };

      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(newUser)
        .expect(201)
        .expect((response) => {
          expect(response.body.accessToken).toBe(accessToken);
        });
    });

    it('should signup a user without a phone number successfully', async () => {
      const newUser: SignupDto = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: validPassword,
      };

      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(newUser)
        .expect(201)
        .expect((response) => {
          expect(response.body.accessToken).toBe(accessToken);
        });
    });

    it('should signup a user with a middle name successfully', async () => {
      const newUser: SignupDto = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: validPassword,
        middleName: faker.person.firstName(),
      };

      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(newUser)
        .expect(201)
        .expect((response) => {
          expect(response.body.accessToken).toBe(accessToken);
        });
    });

    describe('should return bad request error 400 if', () => {
      it('first name is missing', async () => {
        await request(app.getHttpServer())
          .post('/auth/signup')
          .send({
            lastName: defaultUser.lastName,
            email: defaultUser.email,
            password: defaultUser.password,
          })
          .expect(400)
          .expect((response) => {
            expect(response.body.message).toBe('firstName cannot be empty');
          });
      });

      it('first name is empty', async () => {
        await request(app.getHttpServer())
          .post('/auth/signup')
          .send({
            firstName: '',
            lastName: defaultUser.lastName,
            email: defaultUser.email,
            password: defaultUser.password,
          })
          .expect(400)
          .expect((response) => {
            expect(response.body.message).toBe('firstName cannot be empty');
          });
      });

      it('last name is missing', async () => {
        await request(app.getHttpServer())
          .post('/auth/signup')
          .send({
            firstName: defaultUser.firstName,
            email: defaultUser.email,
            password: defaultUser.password,
          })
          .expect(400)
          .expect((response) => {
            expect(response.body.message).toBe('lastName name cannot be empty');
          });
      });

      it('last name is empty', async () => {
        await request(app.getHttpServer())
          .post('/auth/signup')
          .send({
            firstName: defaultUser.firstName,
            lastName: '',
            email: defaultUser.email,
            password: defaultUser.password,
          })
          .expect(400)
          .expect((response) => {
            expect(response.body.message).toBe('lastName name cannot be empty');
          });
      });

      it('email is missing', async () => {
        await request(app.getHttpServer())
          .post('/auth/signup')
          .send({
            firstName: defaultUser.firstName,
            lastName: defaultUser.lastName,
            password: defaultUser.password,
          })
          .expect(400)
          .expect((response) => {
            expect(response.body.message).toBe('email cannot be empty');
          });
      });

      it('email is empty', async () => {
        await request(app.getHttpServer())
          .post('/auth/signup')
          .send({
            firstName: defaultUser.firstName,
            lastName: defaultUser.lastName,
            email: '',
            password: defaultUser.password,
          })
          .expect(400)
          .expect((response) => {
            expect(response.body.message).toBe('email cannot be empty');
          });
      });

      it('email is invalid', async () => {
        const invalidEmail = 'invalid-email';
        await request(app.getHttpServer())
          .post('/auth/signup')
          .send({
            firstName: defaultUser.firstName,
            lastName: defaultUser.lastName,
            email: invalidEmail,
            password: defaultUser.password,
          })
          .expect(400)
          .expect((response) => {
            expect(response.body.message).toBe('invalid email address');
          });
      });

      it('password is missing', async () => {
        await request(app.getHttpServer())
          .post('/auth/signup')
          .send({
            firstName: defaultUser.firstName,
            lastName: defaultUser.lastName,
            email: defaultUser.email,
          })
          .expect(400)
          .expect((response) => {
            expect(response.body.message).toBe('password cannot be empty');
          });
      });

      it('password is empty', async () => {
        await request(app.getHttpServer())
          .post('/auth/signup')
          .send({
            firstName: defaultUser.firstName,
            lastName: defaultUser.lastName,
            email: defaultUser.email,
            password: '',
          })
          .expect(400)
          .expect((response) => {
            expect(response.body.message).toBe('password cannot be empty');
          });
      });

      it('password is less than 10 characters', async () => {
        const invalidPassword = 'short';

        await request(app.getHttpServer())
          .post('/auth/signup')
          .send({
            firstName: defaultUser.firstName,
            lastName: defaultUser.lastName,
            email: defaultUser.email,
            password: invalidPassword,
          })
          .expect(400)
          .expect((response) => {
            expect(response.body.message).toBe(
              'password must be at least 10 characters',
            );
          });
      });

      it('password does not contain an uppercase letter', async () => {
        const invalidPassword = 'lowercasepassword';

        await request(app.getHttpServer())
          .post('/auth/signup')
          .send({
            firstName: defaultUser.firstName,
            lastName: defaultUser.lastName,
            email: defaultUser.email,
            password: invalidPassword,
          })
          .expect(400)
          .expect((response) => {
            expect(response.body.message).toBe(
              'password must contain at least one uppercase letter',
            );
          });
      });

      it('password does not contain a digit', async () => {
        const invalidPassword = 'PasswordWithoutDigit';

        await request(app.getHttpServer())
          .post('/auth/signup')
          .send({
            firstName: defaultUser.firstName,
            lastName: defaultUser.lastName,
            email: defaultUser.email,
            password: invalidPassword,
          })
          .expect(400)
          .expect((response) => {
            expect(response.body.message).toBe(
              'password must contain at least one digit',
            );
          });
      });

      it('password does not contain a special character', async () => {
        const invalidPassword = 'PasswordWithoutSpecialCharacter123';

        await request(app.getHttpServer())
          .post('/auth/signup')
          .send({
            firstName: defaultUser.firstName,
            lastName: defaultUser.lastName,
            email: defaultUser.email,
            password: invalidPassword,
          })
          .expect(400)
          .expect((response) => {
            expect(response.body.message).toBe(
              'password must contain at least one special character',
            );
          });
      });

      it('phone number is present and is less than 10 digits', async () => {
        const shortPhoneNumber = '071234567';
        const newUser: SignupDto = {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          email: faker.internet.email(),
          password: validPassword,
          phone: shortPhoneNumber,
        };

        await request(app.getHttpServer())
          .post('/auth/signup')
          .send(newUser)
          .expect(400)
          .expect((response) => {
            expect(response.body.message).toBe('phone must be 10 digits');
          });
      });

      it('phone number is present and has more than 10 digits', async () => {
        const longPhoneNumber = '07123456789';
        const newUser: SignupDto = {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          email: faker.internet.email(),
          password: validPassword,
          phone: longPhoneNumber,
        };

        await request(app.getHttpServer())
          .post('/auth/signup')
          .send(newUser)
          .expect(400)
          .expect((response) => {
            expect(response.body.message).toBe('phone must be 10 digits');
          });
      });

      it('phone number is present and has non-numbers', async () => {
        const invalidPhoneNumber = '071234567a';
        const newUser: SignupDto = {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          email: faker.internet.email(),
          password: validPassword,
          phone: invalidPhoneNumber,
        };

        await request(app.getHttpServer())
          .post('/auth/signup')
          .send(newUser)
          .expect(400)
          .expect((response) => {
            expect(response.body.message).toBe(
              'phone must contain only numbers',
            );
          });
      });
    });

    it('should return conflict error 409 if user already exists', async () => {
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(defaultUser)
        .expect(409)
        .expect((response) => {
          expect(response.body.message).toBe(
            'User with email or phone already exists',
          );
        });
    });

    it('should return conflict error 409 if user with email already exists', async () => {
      const newUser: SignupDto = {
        ...defaultUser,
        phone: '0733333333', // different phone number
      };

      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(newUser)
        .expect(409)
        .expect((response) => {
          expect(response.body.message).toBe(
            'User with email or phone already exists',
          );
        });
    });

    it('should return conflict error 409 if user with phone already exists', async () => {
      const newUser: SignupDto = {
        ...defaultUser,
        email: faker.internet.email(),
      };

      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(newUser)
        .expect(409)
        .expect((response) => {
          expect(response.body.message).toBe(
            'User with email or phone already exists',
          );
        });
    });
  });
});
