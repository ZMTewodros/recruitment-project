// src/dashboard/dashboard.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { SavedJob } from '../dashboard/entities/saved-job.entity';
import { Notification } from '../dashboard/entities/notification.entity';
import { Application } from '../applications/entities/applications.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SavedJob, Notification, Application])],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService], // Export so ApplicationsService can send notifications
})
export class DashboardModule {}
