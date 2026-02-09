import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Controller('users') // This means all routes start with /users
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register') // POST http://localhost:5000/users/register
  async create(@Body() userData: Partial<User>) {
    return this.usersService.create(userData);
  }

  @Get() // GET http://localhost:5000/users
  async findAll() {
    return this.usersService.findAll();
  }
}
