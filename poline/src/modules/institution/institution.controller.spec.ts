import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { SEQUELIZE } from '../../core/constants';
import { AuthDto } from '../dto/auth.dto';
import { SignupDto } from '../dto/signup.dto';
import { JwtProvider } from '../jwt/jwt.provider';
import { Roles } from '../user/role.provider';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { InstitutionModule } from './institution.module';

describe('InstitutionController', () => {
  let app: INestApplication;
  let mockModule: TestingModule;
  let adminToken: AuthDto;
  let clerkToken: AuthDto;
  let regularToken: AuthDto;

  const newUser: SignupDto = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    phone: faker.phone.number(),
  };

  beforeAll(async () => {
    mockModule = await Test.createTestingModule({
      imports: [InstitutionModule, UserModule],
    }).compile();

    // create the app instance
    app = mockModule.createNestApplication();
    await app.init();

    // get user service
    const userService = await mockModule.resolve(UserService);

    // create admin user
    const dbUser = await userService.createUser(newUser);
    const adminUser = await userService.updateUserRole(dbUser.id, Roles.ADMIN);
    adminToken = await mockModule
      .get(JwtProvider)
      .generateAccessToken(adminUser);

    const clerkUser = await userService.createUser({
      ...newUser,
      email: faker.internet.email(),
      phone: faker.phone.number(),
    });
    await userService.updateUserRole(clerkUser.id, Roles.CLERK);
    clerkToken = await mockModule
      .get(JwtProvider)
      .generateAccessToken(clerkUser);

    const regularUser = await userService.createUser({
      ...newUser,
      email: faker.internet.email(),
      phone: faker.phone.number(),
    });
    regularToken = await mockModule
      .get(JwtProvider)
      .generateAccessToken(regularUser);
  });

  afterAll(async () => {
    await app.close();
    await mockModule.get(SEQUELIZE).close();
  });

  describe('POST /institutions', () => {
    describe('should return 201 created if [ADMIN]', () => {
      it('creates institution successfully', async () => {
        const institution = {
          name: faker.company.name(),
          code: faker.string.alphanumeric(5),
          level: 'country',
          address: '123 Main St',
        };

        await request(app.getHttpServer())
          .post('/institutions')
          .set('Authorization', `Bearer ${adminToken.accessToken}`)
          .send({ institution })
          .expect(201)
          .expect(({ body }) => {
            expect(body).toMatchObject({ institution });
          });
      });

      it('creates institution and levels successfully', async () => {
        const institution = {
          name: faker.company.name(),
          code: faker.string.alphanumeric(5),
          level: 'country',
          address: '123 Main St',
        };

        const levels = [
          {
            name: 'state',
            level: 1,
            description: 'State level',
          },
          {
            name: 'city',
            level: 2,
          },
        ];

        await request(app.getHttpServer())
          .post('/institutions')
          .set('Authorization', `Bearer ${adminToken.accessToken}`)
          .send({
            institution,
            levels,
          })
          .expect(201)
          .expect(({ body }) => {
            expect(body).toMatchObject({
              institution,
              levels,
            });
          });
      });

      it('creates institution and levels successfully but levels are duplicated > should only create unique levels', async () => {
        const institution = {
          name: faker.company.name(),
          code: faker.string.alphanumeric(5),
          level: 'country',
          address: '123 Main St',
        };

        const levels = [
          {
            name: 'state',
            level: 1,
            description: 'State level',
          },
          {
            name: 'state',
            level: 1,
            description: 'State level',
          },
        ];

        await request(app.getHttpServer())
          .post('/institutions')
          .set('Authorization', `Bearer ${adminToken.accessToken}`)
          .send({
            institution,
            levels,
          })
          .expect(201)
          .expect(({ body }) => {
            expect(body).toMatchObject({
              institution,
              levels: [
                {
                  name: 'state',
                  level: 1,
                  description: 'State level',
                },
              ],
            });

            expect(body.levels).toHaveLength(1);
          });
      });
    });

    describe('should return 400 bad request if', () => {
      it('institution is empty', async () => {
        await request(app.getHttpServer())
          .post('/institutions')
          .set('Authorization', `Bearer ${adminToken.accessToken}`)
          .send({})
          .expect(400)
          .expect(({ body }) => {
            expect(body.message).toBe('institution is required');
          });
      });

      it('institution name is empty', async () => {
        await request(app.getHttpServer())
          .post('/institutions')
          .set('Authorization', `Bearer ${adminToken.accessToken}`)
          .send({
            institution: {
              code: faker.string.alphanumeric(5),
              level: 'country',
              address: '123 Main St',
            },
          })
          .expect(400)
          .expect(({ body }) => {
            expect(body.message).toBe('institution name cannot be empty');
          });
      });

      it('institution level is empty', async () => {
        await request(app.getHttpServer())
          .post('/institutions')
          .set('Authorization', `Bearer ${adminToken.accessToken}`)
          .send({
            institution: {
              name: faker.company.name(),
              code: faker.string.alphanumeric(5),
              address: '123 Main St',
            },
          })
          .expect(400)
          .expect(({ body }) => {
            expect(body.message).toBe('institution level cannot be empty');
          });
      });

      it('institution code is empty', async () => {
        await request(app.getHttpServer())
          .post('/institutions')
          .set('Authorization', `Bearer ${adminToken.accessToken}`)
          .send({
            institution: {
              name: faker.company.name(),
              level: 'country',
              address: '123 Main St',
            },
          })
          .expect(400)
          .expect(({ body }) => {
            expect(body.message).toBe('institution code cannot be empty');
          });
      });

      it('institution address is empty', async () => {
        await request(app.getHttpServer())
          .post('/institutions')
          .set('Authorization', `Bearer ${adminToken.accessToken}`)
          .send({
            institution: {
              name: faker.company.name(),
              code: faker.string.alphanumeric(5),
              level: 'country',
            },
          })
          .expect(400)
          .expect(({ body }) => {
            expect(body.message).toBe('institution address cannot be empty');
          });
      });

      it('levels is not empty and name is empty', async () => {
        await request(app.getHttpServer())
          .post('/institutions')
          .set('Authorization', `Bearer ${adminToken.accessToken}`)
          .send({
            institution: {
              name: faker.company.name(),
              code: faker.string.alphanumeric(5),
              level: 'country',
              address: '123 Main St',
            },
            levels: [
              {
                level: 1,
                description: 'State level',
              },
            ],
          })
          .expect(400)
          .expect(({ body }) => {
            expect(body.message).toBe(
              'for each level, level name cannot be empty',
            );
          });
      });

      it('levels is not empty and level is empty', async () => {
        await request(app.getHttpServer())
          .post('/institutions')
          .set('Authorization', `Bearer ${adminToken.accessToken}`)
          .send({
            institution: {
              name: faker.company.name(),
              code: faker.string.alphanumeric(5),
              level: 'country',
              address: '123 Main St',
            },
            levels: [
              {
                name: 'state',
                description: 'State level',
              },
            ],
          })
          .expect(400)
          .expect(({ body }) => {
            expect(body.message).toBe('for each level, level cannot be empty');
          });
      });

      it('levels is not empty and level is not a number', async () => {
        await request(app.getHttpServer())
          .post('/institutions')
          .set('Authorization', `Bearer ${adminToken.accessToken}`)
          .send({
            institution: {
              name: faker.company.name(),
              code: faker.string.alphanumeric(5),
              level: 'country',
              address: '123 Main St',
            },
            levels: [
              {
                name: 'state',
                level: 'one',
                description: 'State level',
              },
            ],
          })
          .expect(400)
          .expect(({ body }) => {
            expect(body.message).toBe('for each level, level must be a number');
          });
      });

      it('levels is not empty and level is negative', async () => {
        await request(app.getHttpServer())
          .post('/institutions')
          .set('Authorization', `Bearer ${adminToken.accessToken}`)
          .send({
            institution: {
              name: faker.company.name(),
              code: faker.string.alphanumeric(5),
              level: 'country',
              address: '123 Main St',
            },
            levels: [
              {
                name: 'state',
                level: -1,
                description: 'State level',
              },
            ],
          })
          .expect(400)
          .expect(({ body }) => {
            expect(body.message).toBe(
              'for each level, level cannot be negative',
            );
          });
      });
    });

    describe('should return 409 conflict if', () => {
      it('institution name and code already exists', async () => {
        const institution = {
          name: faker.company.name(),
          code: faker.string.alphanumeric(5),
          level: 'country',
          address: '123 Main St',
        };

        await request(app.getHttpServer())
          .post('/institutions')
          .set('Authorization', `Bearer ${adminToken.accessToken}`)
          .send({ institution })
          .expect(201);

        await request(app.getHttpServer())
          .post('/institutions')
          .set('Authorization', `Bearer ${adminToken.accessToken}`)
          .send({ institution })
          .expect(409)
          .expect(({ body }) => {
            expect(body.message).toBe(
              'institution with name or code already exists',
            );
          });
      });

      it('institution name already exists', async () => {
        const institution = {
          name: faker.company.name(),
          code: faker.string.alphanumeric(5),
          level: 'country',
          address: '123 Main St',
        };

        await request(app.getHttpServer())
          .post('/institutions')
          .set('Authorization', `Bearer ${adminToken.accessToken}`)
          .send({ institution })
          .expect(201);

        await request(app.getHttpServer())
          .post('/institutions')
          .set('Authorization', `Bearer ${adminToken.accessToken}`)
          .send({
            institution: {
              ...institution,
              code: faker.string.alphanumeric(5),
            },
          })
          .expect(409)
          .expect(({ body }) => {
            expect(body.message).toBe(
              'institution with name or code already exists',
            );
          });
      });

      it('institution code already exists', async () => {
        const institution = {
          name: faker.company.name(),
          code: faker.string.alphanumeric(5),
          level: 'country',
          address: '123 Main St',
        };

        await request(app.getHttpServer())
          .post('/institutions')
          .set('Authorization', `Bearer ${adminToken.accessToken}`)
          .send({ institution })
          .expect(201);

        await request(app.getHttpServer())
          .post('/institutions')
          .set('Authorization', `Bearer ${adminToken.accessToken}`)
          .send({
            institution: {
              ...institution,
              name: faker.company.name(),
            },
          })
          .expect(409)
          .expect(({ body }) => {
            expect(body.message).toBe(
              'institution with name or code already exists',
            );
          });
      });
    });

    describe('should return 401 unauthorized if', () => {
      const institution = {
        name: faker.company.name(),
        code: faker.string.alphanumeric(5),
        level: 'country',
        address: '123 Main St',
      };

      it('authorization header is not found', async () => {
        await request(app.getHttpServer())
          .post('/institutions')
          .send({ institution })
          .expect(401)
          .expect(({ body }) => {
            expect(body.message).toBe('authorization header not found');
          });
      });

      it('invalid token', async () => {
        await request(app.getHttpServer())
          .post('/institutions')
          .set('Authorization', `Bearer invalid-token`)
          .send({ institution })
          .expect(401)
          .expect(({ body }) => {
            expect(body.message).toBe('Invalid token');
          });
      });

      it('user is not admin [USER]', async () => {
        await request(app.getHttpServer())
          .post('/institutions')
          .set('Authorization', `Bearer ${regularToken.accessToken}`)
          .send({ institution })
          .expect(403)
          .expect(({ body }) => {
            expect(body.message).toBe('insufficient permissions');
          });
      });

      it('user is not admin [CLERK]', async () => {
        await request(app.getHttpServer())
          .post('/institutions')
          .set('Authorization', `Bearer ${clerkToken.accessToken}`)
          .send({ institution })
          .expect(403)
          .expect(({ body }) => {
            expect(body.message).toBe('insufficient permissions');
          });
      });
    });
  });
});
