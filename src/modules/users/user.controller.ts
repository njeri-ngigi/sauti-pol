import { Body, Controller, Post } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { User } from './user.model';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  login(@Body('email') email: string): Promise<User> {
    return this.userService.findOneByEmail(email);
  }

  @Post('signup')
  signup(@Body() user: UserDto): Promise<User> {
    return this.userService.createUser(user);
  }
}
