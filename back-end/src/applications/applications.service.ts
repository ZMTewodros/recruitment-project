import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application, ApplicationStatus } from './entities/applications.entity';
import { ApplyJobDto } from './dto/apply-job.dto';
import { User } from '../users/entities/user.entity';
import { Job } from '../jobs/entities/job.entity';
import { GoogleDriveService } from '../common/google-drive.service';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private applicationsRepository: Repository<Application>,
    @InjectRepository(Job)
    private jobsRepository: Repository<Job>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private googleDriveService: GoogleDriveService,
  ) {}

  async applyJob(userId: number, dto: ApplyJobDto, file?: Express.Multer.File) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    const job = await this.jobsRepository.findOne({
      where: { id: Number(dto.job_id) },
    });

    if (!user) throw new NotFoundException('User not found');
    if (!job) throw new NotFoundException('Job not found');

    const existing = await this.applicationsRepository.findOne({
      where: { user: { id: userId }, job: { id: Number(dto.job_id) } },
    });
    if (existing)
      throw new BadRequestException('You have already applied for this job');

    let cvUrl = dto.cv_file;
    if (file) {
      const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
      if (!folderId)
        throw new InternalServerErrorException(
          'Google Drive folder ID is not set',
        );
      cvUrl = await this.googleDriveService.uploadFile(file, folderId);
    }

    const application = this.applicationsRepository.create({
      user,
      job,
      cover_letter: dto.cover_letter,
      cv_file: cvUrl,
      status: ApplicationStatus.PENDING,
    });

    return await this.applicationsRepository.save(application);
  }

  // NEW: Get all applicants for a specific job (Employer view)
  async getJobApplications(jobId: number) {
    return await this.applicationsRepository.find({
      where: { job: { id: jobId } },
      relations: ['user'], // This is critical for the frontend to show names/emails
      order: { id: 'DESC' },
    });
  }

  // NEW: Update application status (Employer action)
  async updateStatus(applicationId: number, status: ApplicationStatus) {
    const application = await this.applicationsRepository.findOne({
      where: { id: applicationId },
    });
    if (!application) throw new NotFoundException('Application not found');

    application.status = status;
    return await this.applicationsRepository.save(application);
  }

  async getUserApplications(userId: number) {
    return await this.applicationsRepository.find({
      where: { user: { id: userId } },
      relations: ['job', 'job.company'],
      order: { id: 'DESC' },
    });
  }
}
