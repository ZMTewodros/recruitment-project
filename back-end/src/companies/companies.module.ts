import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { User } from '../users/entities/user.entity';
import { CompanyService } from '../companies/companies.service';
import { CompanyController } from '../companies/companies.controller';
import { Job } from 'src/jobs/entities/job.entity';
import { Application } from 'src/applications/entities/applications.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Company, User, Job, Application])],
  controllers: [CompanyController],
  providers: [CompanyService],
})
export class CompanyModule {}
