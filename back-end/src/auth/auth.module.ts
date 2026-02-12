// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt'; // Added JwtModuleOptions
import { MailService } from './mail.service';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { ConfigService, ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ConfigModule,

    JwtModule.registerAsync({
      imports: [ConfigModule], // Best practice to import ConfigModule here too
      inject: [ConfigService],
      useFactory: (config: ConfigService): JwtModuleOptions => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          // Cast to any to bypass the strict StringValue check
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          expiresIn: config.get<string>('JWT_EXPIRES') as any,
        },
      }),
    }),
  ],
  providers: [AuthService, MailService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
