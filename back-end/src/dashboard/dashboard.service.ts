// src/dashboard/dashboard.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SavedJob } from '../dashboard/entities/saved-job.entity';
import { Notification } from '../dashboard/entities/notification.entity';
import {
  Application,
  ApplicationStatus,
} from '../applications/entities/applications.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(SavedJob)
    private savedJobRepo: Repository<SavedJob>,
    @InjectRepository(Notification)
    private notificationRepo: Repository<Notification>,
    @InjectRepository(Application)
    private applicationRepo: Repository<Application>,
  ) {}

  async getJobSeekerData(userId: number) {
    try {
      const [applied, saved, notifications] = await Promise.all([
        this.applicationRepo.find({
          where: { user: { id: userId } },
          // Path: Application -> Job -> Company -> User
          relations: ['job', 'job.company', 'job.company.user'],
          order: { id: 'DESC' },
        }),
        this.savedJobRepo.find({
          where: { user: { id: userId } },
          relations: ['job', 'job.company'],
          order: { savedAt: 'DESC' },
        }),
        this.notificationRepo.find({
          where: { user: { id: userId } },
          order: { createdAt: 'DESC' },
          take: 10,
        }),
      ]);

      const shortlistedCount = applied.filter(
        (app) =>
          app.status === ApplicationStatus.SHORTLISTED ||
          app.status === ApplicationStatus.ACCEPTED,
      ).length;

      const pendingCount = applied.filter(
        (app) => app.status === ApplicationStatus.PENDING,
      ).length;

      return {
        appliedJobs: applied,
        savedJobs: saved,
        notifications: notifications,
        stats: {
          appliedCount: applied.length,
          shortlistedCount: shortlistedCount,
          pendingCount: pendingCount,
          savedCount: saved.length,
          unreadNotifications: notifications.filter((n) => !n.isRead).length,
        },
      };
    } catch (error) {
      console.error('DASHBOARD_ERROR:', error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async saveJob(userId: number, jobId: number) {
    const existing = await this.savedJobRepo.findOne({
      where: { user: { id: userId }, job: { id: jobId } },
    });
    if (existing) return { message: 'Already saved' };

    return this.savedJobRepo.save({
      user: { id: userId },
      job: { id: jobId },
    });
  }

  async unsaveJob(userId: number, jobId: number) {
    await this.savedJobRepo.delete({
      user: { id: userId },
      job: { id: jobId },
    });
    return { success: true };
  }

  async markAsRead(userId: number, notificationId: number) {
    const notif = await this.notificationRepo.findOne({
      where: { id: notificationId, user: { id: userId } },
    });
    if (!notif) return { success: false, message: 'Not found' };
    notif.isRead = true;
    await this.notificationRepo.save(notif);
    return { success: true };
  }
}
