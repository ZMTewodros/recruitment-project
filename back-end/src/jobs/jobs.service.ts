import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from './entities/job.entity';
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

  // CREATE JOB
  async create(createJobDto: CreateJobDto) {
    const company = await this.companyRepository.findOne({
      where: { id: createJobDto.companyId },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    const job = this.jobRepository.create({
      ...createJobDto,
      salary: String(createJobDto.salary),
      company,
      status: 'open',
    });

    return this.jobRepository.save(job);
  }

  // GET + SEARCH JOBS
  async findAll(searchDto: SearchJobDto) {
    const {
      title,
      category,
      location,
      company,
      minSalary,
      maxSalary,
      page = '1',
      limit = '10',
    } = searchDto;

    const query = this.jobRepository
      .createQueryBuilder('job')
      .leftJoinAndSelect('job.company', 'company')
      .where('job.status = :status', { status: 'open' });

    if (title) {
      query.andWhere('LOWER(job.title) LIKE LOWER(:title)', {
        title: `%${title}%`,
      });
    }

    if (category) {
      query.andWhere('job.category = :category', { category });
    }

    if (location) {
      query.andWhere('job.location = :location', { location });
    }

    if (company) {
      query.andWhere('LOWER(company.name) LIKE LOWER(:company)', {
        company: `%${company}%`,
      });
    }

    if (minSalary) {
      query.andWhere('job.salary >= :minSalary', {
        minSalary: Number(minSalary),
      });
    }

    if (maxSalary) {
      query.andWhere('job.salary <= :maxSalary', {
        maxSalary: Number(maxSalary),
      });
    }

    const currentPage = Number(page);
    const take = Number(limit);

    query.skip((currentPage - 1) * take).take(take);

    const [jobs, total] = await query.getManyAndCount();

    return {
      total,
      page: currentPage,
      limit: take,
      data: jobs,
    };
  }
}
