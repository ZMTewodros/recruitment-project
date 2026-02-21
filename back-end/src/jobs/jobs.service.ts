import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job, JobStatus } from './entities/job.entity';
import { Company } from '../companies/entities/company.entity';
import { CreateJobDto } from './dto/create-job.dto';
import { SearchJobDto } from './dto/search-job.dto';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  // 1. CREATE JOB
  async create(createJobDto: CreateJobDto) {
    const company = await this.companyRepository.findOne({
      where: { id: createJobDto.companyId },
    });

    if (!company) throw new NotFoundException('Company not found');

    const job = this.jobRepository.create({
      ...createJobDto,
      company,
      status: JobStatus.OPEN, // Defaulting to OPEN so it shows up in dashboard
    });

    return await this.jobRepository.save(job);
  }

  // 2. FIND ALL (For Job Seekers)
  async findAll(searchDto: SearchJobDto) {
    try {
      const { title, category, location, page = 1, limit = 10 } = searchDto;

      const query = this.jobRepository
        .createQueryBuilder('job')
        .leftJoinAndSelect('job.company', 'company')
        .where('job.status = :status', { status: JobStatus.OPEN });

      if (title) {
        query.andWhere('LOWER(job.title) LIKE LOWER(:title)', {
          title: `%${title}%`,
        });
      }

      if (category) {
        query.andWhere('LOWER(job.category) = LOWER(:category)', { category });
      }

      if (location) {
        query.andWhere('LOWER(job.location) LIKE LOWER(:location)', {
          location: `%${location}%`,
        });
      }

      const currentPage = Math.max(1, Number(page));
      const take = Math.max(1, Number(limit));
      const skip = (currentPage - 1) * take;

      const [jobs, total] = await query
        .orderBy('job.createdAt', 'DESC')
        .skip(skip)
        .take(take)
        .getManyAndCount();

      return {
        total,
        page: currentPage,
        limit: take,
        data: jobs,
      };
    } catch (error) {
      console.error('CRITICAL DB ERROR:', error);
      throw new InternalServerErrorException('Database query failed');
    }
  }

  // 3. FIND ONE (For Job Details)
  async findOne(id: number) {
    const job = await this.jobRepository.findOne({
      where: { id },
      relations: ['company'],
    });
    if (!job) throw new NotFoundException('Job not found');
    return job;
  }

  // 4. GET EMPLOYER JOBS
  async getEmployerJobs(userId: number) {
    return this.jobRepository.find({
      where: { company: { user: { id: userId } } },
      relations: ['company'],
    });
  }

  // 5. UPDATE JOB
  async update(id: number, updateJobDto: Partial<CreateJobDto>) {
    const job = await this.jobRepository.findOne({ where: { id } });
    if (!job) throw new NotFoundException('Job not found');
    Object.assign(job, updateJobDto);
    return this.jobRepository.save(job);
  }

  // 6. REMOVE JOB
  async remove(id: number) {
    const result = await this.jobRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Job not found');
    return { message: 'Job deleted successfully' };
  }

  // 7. CHANGE STATUS
  async changeStatus(id: number, status: JobStatus) {
    const job = await this.jobRepository.findOne({ where: { id } });
    if (!job) throw new NotFoundException('Job not found');
    job.status = status;
    return this.jobRepository.save(job);
  }
}
