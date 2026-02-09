import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // This registers the User table
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService], // Export it so AuthModule can use it later
})
export class UsersModule {}
