import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { UserRoleDto } from '../dto/user.dto';
import { RoleGuard, RolesGuard } from './role.guard';
import { Roles } from './role.provider';
import { User } from './user.model';
import { UserService } from './user.service';

@Controller('users')
@UseGuards(RoleGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @RolesGuard(Roles.ADMIN)
  @Put('/:id/role')
  updateUserRole(
    @Param('id') id: string,
    @Body() user: UserRoleDto,
  ): Promise<User> {
    return this.userService.updateUserRole(id, user.role);
  }

  @RolesGuard(Roles.ADMIN, Roles.CLERK)
  @Get()
  getAllUsers(): Promise<User[]> {
    return this.userService.findAll();
  }
}
