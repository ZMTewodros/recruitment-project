import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UsersModule, // Needed to find users in the DB
    JwtModule.register({
      global: true,
      secret: 'YOUR_SECRET_KEY', // Use process.env.JWT_SECRET in production
      signOptions: { expiresIn: '1d' }, // Token valid for 1 day
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
