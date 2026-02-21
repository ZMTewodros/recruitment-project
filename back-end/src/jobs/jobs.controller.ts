import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { JobStatus } from './entities/job.entity';
import { SearchJobDto } from './dto/search-job.dto';

// src/jobs/jobs.controller.ts
@Controller('jobs')
@UseGuards(JwtAuthGuard)
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  async findAll(@Query() searchDto: SearchJobDto) {
    return this.jobsService.findAll(searchDto);
  }

  // 1. Specific routes MUST come before generic :id routes
  @Get('my')
  getMyJobs(@Req() req) {
    // req.user.userId comes from your JwtStrategy
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return this.jobsService.getEmployerJobs(req.user.userId);
  }

  // 2. Generic :id route comes after
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.jobsService.findOne(+id);
  }

  @Post()
  create(@Body() createJobDto: CreateJobDto) {
    return this.jobsService.create(createJobDto);
  }

  @Patch(':id')
  updateJob(
    @Param('id') id: string,
    @Body() updateJobDto: Partial<CreateJobDto>,
  ) {
    return this.jobsService.update(+id, updateJobDto);
  }

  @Delete(':id')
  deleteJob(@Param('id') id: string) {
    return this.jobsService.remove(+id);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: JobStatus) {
    return this.jobsService.changeStatus(+id, status);
  }
}
