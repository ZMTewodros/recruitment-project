import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './entities/company.entity';
import { User } from '../users/entities/user.entity';
import { Job } from '../jobs/entities/job.entity';
import {
  Application,
  ApplicationStatus,
} from '../applications/entities/applications.entity';
import { CreateCompanyDto } from './dto/create-company.dto';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private companyRepo: Repository<Company>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Job)
    private jobRepo: Repository<Job>,
    @InjectRepository(Application)
    private appRepo: Repository<Application>,
  ) {}

  async createCompany(userId: number, dto: CreateCompanyDto) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['company'],
    });

    if (!user) throw new NotFoundException('User not found');
    if (user.role !== 'employer')
      throw new ForbiddenException('Only employers can create company');
    if (user.company)
      throw new ForbiddenException('Company profile already exists');

    const company = this.companyRepo.create({ ...dto, user });
    return this.companyRepo.save(company);
  }

  async getMyCompany(userId: number) {
    return this.companyRepo.findOne({
      where: { user: { id: userId } },
    });
  }

  // --- NEW: Dashboard Stats Logic ---
  async getDashboardStats(userId: number) {
    const company = await this.getMyCompany(userId);
    if (!company) throw new NotFoundException('Company not found');

    // 1. Total Jobs Posted
    const totalJobs = await this.jobRepo.count({
      where: { company: { id: company.id } },
    });

    // 2. Total Applicants (across all jobs belonging to this company)
    const totalApplicants = await this.appRepo.count({
      where: { job: { company: { id: company.id } } },
    });

    // 3. Shortlisted Candidates (Status: Interviewing)
    const shortlisted = await this.appRepo.count({
      where: {
        job: { company: { id: company.id } },
        status: ApplicationStatus.INTERVIEWING, // Ensure this matches your Enum
      },
    });

    return {
      totalJobs,
      totalApplicants,
      shortlisted,
      companyName: company.name,
    };
  }
}
