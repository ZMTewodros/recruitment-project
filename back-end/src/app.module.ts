import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
@Module({
  imports: [
    // 1. Load the .env file globally
    ConfigModule.forRoot({ isGlobal: true }),

    // 2. Configure TypeORM with the environment variables
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true, // Automatically find your .entity.ts files
        synchronize: true, // Set to false in production to prevent data loss!
      }),
    }),
    UsersModule, // Import the UsersModule to use its services and controllers
  ],
})
export class AppModule {}
