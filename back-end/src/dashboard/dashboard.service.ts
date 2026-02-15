import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SavedJob } from '../dashboard/entities/saved-job.entity';
import { Notification } from '../dashboard/entities/notification.entity';
import { Application } from '../applications/entities/applications.entity';

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
    const [applied, saved, notifications] = await Promise.all([
      this.applicationRepo.find({
        where: { user: { id: userId } },
        relations: ['job', 'job.company'],
      }),
      this.savedJobRepo.find({
        where: { user: { id: userId } },
        relations: ['job', 'job.company'],
      }),
      this.notificationRepo.find({
        where: { user: { id: userId } },
        order: { createdAt: 'DESC' },
        take: 10,
      }),
    ]);

    return {
      appliedJobs: applied,
      savedJobs: saved,
      notifications: notifications,
      stats: {
        appliedCount: applied.length,
        savedCount: saved.length,
        unreadNotifications: notifications.filter((n) => !n.isRead).length,
      },
    };
  }

  // Used by applications or internally
  async createNotification(userId: number, message: string) {
    return this.notificationRepo.save({ user: { id: userId }, message });
  }

  async saveJob(userId: number, jobId: number) {
    const existing = await this.savedJobRepo.findOne({
      where: { user: { id: userId }, job: { id: jobId } },
    });

    if (existing) {
      return { message: 'Already saved' };
    }
    return this.savedJobRepo.save({
      user: { id: userId },
      job: { id: jobId },
    });
  }

  async unsaveJob(userId: number, jobId: number) {
    return this.savedJobRepo.delete({
      user: { id: userId },
      job: { id: jobId },
    });
  }

  async markAsRead(userId: number, notificationId: number) {
    // Only let user mark their own notifications
    const notif = await this.notificationRepo.findOne({
      where: { id: notificationId, user: { id: userId } },
    });
    if (!notif) return { success: false, message: 'Not found' };
    notif.isRead = true;
    await this.notificationRepo.save(notif);
    return { success: true };
  }
}
