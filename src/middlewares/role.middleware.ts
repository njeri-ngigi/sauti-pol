import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { isUUID } from 'validator';
import { JwtProvider } from '../modules/jwt/jwt.provider';
import { Roles } from '../modules/user/role.provider';

@Injectable()
export class RoleMiddleware {
  constructor(private jwtService: JwtProvider) {}

  async use(req: any, _: any, next: (error?: Error | any) => void) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header not found');
    }

    const { id: loggedInUserId } =
      await this.jwtService.getUserJWTPayloadFromToken(authHeader);
    if (!loggedInUserId) {
      throw new UnauthorizedException('Invalid token');
    }

    const { id } = req.params;
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid user id');
    }

    const { role } = req.body;
    if (!role || role.trim().length === 0) {
      throw new BadRequestException('role cannot be empty');
    }

    if (loggedInUserId === id) {
      throw new BadRequestException('Cannot update your own role');
    }

    const validRoles = Object.values(Roles);
    if (!validRoles.includes(role)) {
      throw new BadRequestException('invalid role');
    }

    next();
  }
}
