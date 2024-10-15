import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtProvider } from '../jwt/jwt.provider';
import { UserService } from './user.service';

export const RolesGuard = (...roles: string[]) => SetMetadata('roles', roles);

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtProvider,
    private userService: UserService,
  ) {}

  async getUserFromToken(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      throw new UnauthorizedException('authorization header not found');
    }

    const { id } = await this.jwtService.getUserJWTPayloadFromToken(authHeader);
    if (!id) {
      throw new UnauthorizedException('Invalid token');
    }

    return this.userService.findOneById(id);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    if (!requiredRoles) {
      return true; // No roles required, allow access
    }

    const user = await this.getUserFromToken(context);

    const hasAccess = requiredRoles.includes(user.role);
    if (!hasAccess) {
      throw new ForbiddenException('insufficient permissions');
    }

    return hasAccess;
  }
}
