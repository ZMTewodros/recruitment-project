// src/admin/admin.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Company } from '../companies/entities/company.entity';
import { Job, JobStatus } from '../jobs/entities/job.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Company) private companyRepo: Repository<Company>,
    @InjectRepository(Job) private jobRepo: Repository<Job>,
  ) {}

  // 1. Analytics Dashboard
  async getAnalytics() {
    const [userCount, companyCount, jobCount] = await Promise.all([
      this.userRepo.count(),
      this.companyRepo.count(),
      this.jobRepo.count(),
    ]);
    return { users: userCount, companies: companyCount, jobs: jobCount };
  }

  // 2. User Management (List & Block)
  async getAllUsers() {
    return this.userRepo.find();
  }

  async toggleUserStatus(id: number, isActive: boolean) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    user.isActive = isActive;
    return this.userRepo.save(user);
  }

  // 3. Company Management
  async getAllCompanies() {
    return this.companyRepo.find({ relations: ['user'] });
  }

  // 4. Job Approval System
  async getPendingJobs() {
    return this.jobRepo.find({
      where: { status: JobStatus.PENDING },
      relations: ['company'],
    });
  }
  // src/admin/admin.service.ts

  async getAllJobs() {
    return await this.jobRepo.find({
      relations: ['company'],
      order: { createdAt: 'DESC' }, // Newest jobs at the top
    });
  }

  async updateJobStatus(id: number, status: JobStatus) {
    const job = await this.jobRepo.findOne({ where: { id } });
    if (!job) throw new NotFoundException('Job not found');
    job.status = status;
    return this.jobRepo.save(job);
  }
}
