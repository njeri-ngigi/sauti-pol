import { JwtModule } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { JwtProvider, UserJWTPayload } from './jwt.provider';

describe('JwtProvider', () => {
  let jwtProvider: JwtProvider;

  beforeAll(async () => {
    const mockModule = await Test.createTestingModule({
      providers: [JwtProvider],
      imports: [JwtModule.register({ secret: 'testing-secret' })],
    }).compile();

    jwtProvider = mockModule.get<JwtProvider>(JwtProvider);
  });

  describe('getUserJWTPayloadFromToken', () => {
    it('should decode the token and return the payload', async () => {
      const user: UserJWTPayload = {
        id: 'cc74b118-7cb9-11ef-82ff-0b36fc6f2963',
        email: 'john.doe@test.com',
      };
      const token = await jwtProvider.generateAccessToken(user);
      const authHeader = await `Bearer ${token.accessToken}`;

      const payload = await jwtProvider.getUserJWTPayloadFromToken(authHeader);

      expect(payload).toMatchObject({
        id: user.id,
        email: user.email,
      });
    });

    it('should throw an error if auth token is not found', async () => {
      const authHeader = '';

      try {
        await jwtProvider.getUserJWTPayloadFromToken(authHeader);
      } catch (error) {
        expect(error.message).toBe('Auth token not found');
      }
    });

    it('should throw an error if the token is invalid', async () => {
      const authHeader = 'Bearer invalid-token';

      try {
        await jwtProvider.getUserJWTPayloadFromToken(authHeader);
      } catch (error) {
        expect(error.message).toBe('Invalid token');
      }
    });
  });
});
