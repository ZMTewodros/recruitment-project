import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers(): Promise<User[]> {
    // Added await to satisfy the 'no await expression' linting rule
    const users = await this.usersService.findAll();
    return users;
  }

  @Get(':email')
  async getUserByEmail(@Param('email') email: string): Promise<User> {
    // Added await for consistency and better error handling
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      // It is best practice to throw a 404 if the user isn't found
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return user;
  }
}
