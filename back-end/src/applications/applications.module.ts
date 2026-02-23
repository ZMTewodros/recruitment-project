// src/applications/applications.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
import { Application } from './entities/applications.entity';
import { User } from '../users/entities/user.entity';
import { Job } from '../jobs/entities/job.entity';
import { GoogleDriveService } from '../common/google-drive.service'; // Adjust path
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Application, User, Job]), // Add User and Job here
    AuthModule,
  ],
  controllers: [ApplicationsController],
  providers: [ApplicationsService, GoogleDriveService],
})
export class ApplicationsModule {}
