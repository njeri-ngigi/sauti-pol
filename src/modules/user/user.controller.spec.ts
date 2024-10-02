import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { SEQUELIZE } from '../../core/constants';
import { AuthDto } from '../dto/auth.dto';
import { SignupDto } from '../dto/signup.dto';
import { JwtProvider } from '../jwt/jwt.provider';
import { Roles } from './role.provider';
import { User } from './user.model';
import { UserModule } from './user.module';
import { UserService } from './user.service';

describe('UserController', () => {
  let app: INestApplication;
  let mockModule: TestingModule;
  let userService: UserService;
  let adminUser: User;
  let regularUser: User;
  let adminToken: AuthDto;
  let regularToken: AuthDto;
  let clerkToken: AuthDto;

  const newUser: SignupDto = {
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

    // create the app instance
    app = mockModule.createNestApplication();
    await app.init();

    // get user service
    userService = await mockModule.resolve(UserService);

    // create admin user
    const dbUser = await userService.createUser(newUser);
    adminUser = await userService.updateUserRole(dbUser.id, Roles.ADMIN);

    // create clerk user
    const clerkUser = await userService.createUser({
      ...newUser,
      email: faker.internet.email(),
      phone: faker.phone.number(),
    });
    await userService.updateUserRole(clerkUser.id, Roles.CLERK);

    // create regular user
    regularUser = await userService.createUser({
      ...newUser,
      email: faker.internet.email(),
      phone: faker.phone.number(),
    });

    // generate admin, clerk and user access tokens
    adminToken = await mockModule
      .get(JwtProvider)
      .generateAccessToken(adminUser);

    clerkToken = await mockModule
      .get(JwtProvider)
      .generateAccessToken(clerkUser);

    regularToken = await mockModule
      .get(JwtProvider)
      .generateAccessToken(regularUser);
  });

  afterAll(async () => {
    await app.close();
    await mockModule.get(SEQUELIZE).close();
  });

  describe('POST /users/:id/role', () => {
    it('should update the user role if admin', async () => {
      // create a regular user
      const user = await userService.createUser({
        ...newUser,
        email: faker.internet.email(),
        phone: faker.phone.number(),
      });
      expect(user.role).toBe(Roles.USER);

      await request(app.getHttpServer())
        .put(`/users/${user.id}/role`)
        .set('Authorization', `Bearer ${adminToken.accessToken}`)
        .send({ role: Roles.ADMIN })
        .expect(200)
        .expect((response) => {
          expect(response.body.role).toBe(Roles.ADMIN);
        });
    });

    describe('should return 401 unauthorized if', () => {
      it('authorization header is not found', async () => {
        await request(app.getHttpServer())
          .put(`/users/${regularUser.id}/role`)
          .send({ role: Roles.ADMIN })
          .expect(401)
          .expect((response) => {
            expect(response.body.message).toBe(
              'authorization header not found',
            );
          });
      });

      it('invalid token', async () => {
        await request(app.getHttpServer())
          .put(`/users/${regularUser.id}/role`)
          .set('Authorization', `Bearer invalid-token`)
          .send({ role: Roles.ADMIN })
          .expect(401)
          .expect((response) => {
            expect(response.body.message).toBe('Invalid token');
          });
      });
    });

    describe('should return bad request error 400 if', () => {
      it('invalid user id query param', async () => {
        const invalidUserUUID = 'invalid-uuid';

        await request(app.getHttpServer())
          .put(`/users/${invalidUserUUID}/role`)
          .set('Authorization', `Bearer ${adminToken.accessToken}`)
          .send({ role: Roles.ADMIN })
          .expect(400)
          .expect((response) => {
            expect(response.body.message).toBe('invalid user id');
          });
      });

      it('user updates their own role [ADMIN]', async () => {
        await request(app.getHttpServer())
          .put(`/users/${adminUser.id}/role`)
          .set('Authorization', `Bearer ${adminToken.accessToken}`)
          .send({ role: Roles.USER })
          .expect(400)
          .expect((response) => {
            expect(response.body.message).toBe('cannot update your own role');
          });
      });

      it('user updates their own role [USER]', async () => {
        await request(app.getHttpServer())
          .put(`/users/${regularUser.id}/role`)
          .set('Authorization', `Bearer ${regularToken.accessToken}`)
          .send({ role: Roles.ADMIN })
          .expect(400)
          .expect((response) => {
            expect(response.body.message).toBe('cannot update your own role');
          });
      });

      it('role is not provided', async () => {
        await request(app.getHttpServer())
          .put(`/users/${regularUser.id}/role`)
          .set('Authorization', `Bearer ${adminToken.accessToken}`)
          .send({})
          .expect(400)
          .expect((response) => {
            expect(response.body.message).toBe('role cannot be empty');
          });
      });

      it('role is empty', async () => {
        await request(app.getHttpServer())
          .put(`/users/${regularUser.id}/role`)
          .set('Authorization', `Bearer ${adminToken.accessToken}`)
          .send({ role: '' })
          .expect(400)
          .expect((response) => {
            expect(response.body.message).toBe('role cannot be empty');
          });
      });

      it('role is not a valid role', async () => {
        await request(app.getHttpServer())
          .put(`/users/${regularUser.id}/role`)
          .set('Authorization', `Bearer ${adminToken.accessToken}`)
          .send({ role: 'invalid-role' })
          .expect(400)
          .expect((response) => {
            expect(response.body.message).toBe('invalid role');
          });
      });
    });

    describe('should return 403 forbidden if', () => {
      it('regular user updates role', async () => {
        await request(app.getHttpServer())
          .put(`/users/${adminUser.id}/role`)
          .set('Authorization', `Bearer ${regularToken.accessToken}`)
          .send({ role: Roles.USER })
          .expect(403)
          .expect((response) => {
            expect(response.body.message).toBe('insufficient permissions');
          });
      });

      it('clerk user updates role', async () => {
        await request(app.getHttpServer())
          .put(`/users/${regularUser.id}/role`)
          .set('Authorization', `Bearer ${clerkToken.accessToken}`)
          .send({ role: Roles.ADMIN })
          .expect(403)
          .expect((response) => {
            expect(response.body.message).toBe('insufficient permissions');
          });
      });
    });
  });

  describe('GET /users', () => {
    it('should return all users if admin', async () => {
      await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${adminToken.accessToken}`)
        .expect(200)
        .expect((response) => {
          expect(response.body.length).toBeGreaterThanOrEqual(3);
        });
    });

    it('should return all users if clerk', async () => {
      await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${clerkToken.accessToken}`)
        .expect(200)
        .expect((response) => {
          expect(response.body.length).toBeGreaterThanOrEqual(3);
        });
    });

    it('should return 401 Unauthorized if not authenticated', async () => {
      await request(app.getHttpServer())
        .get('/users')
        .expect(401)
        .expect((response) => {
          expect(response.body.message).toBe('authorization header not found');
        });
    });

    it('should return 403 Forbidden if regular user', async () => {
      await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${regularToken.accessToken}`)
        .expect(403)
        .expect((response) => {
          expect(response.body.message).toBe('insufficient permissions');
        });
    });
  });
});
