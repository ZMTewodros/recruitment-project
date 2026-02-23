import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { ApplicationsModule } from './applications/applications.module';
import { JobsModule } from './jobs/jobs.module';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { CompanyModule } from './companies/companies.module';
import { AdminModule } from './admin/admin.module';
import { MessagesModule } from './messages/messages.module';
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
    // 3. Register all feature modules
    UsersModule,
    AdminModule,
    CompanyModule,
    JobsModule,
    ApplicationsModule,
    AuthModule,
    ProfileModule,
    DashboardModule,
    MessagesModule,
  ],
})
export class AppModule {}
