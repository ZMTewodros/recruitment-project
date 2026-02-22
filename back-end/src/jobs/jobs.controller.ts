// src/jobs/jobs.controller.ts
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

@Controller('jobs')
// Removed class-level JwtAuthGuard to make GET routes public
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get() // Public
  async findAll(@Query() searchDto: SearchJobDto) {
    return this.jobsService.findAll(searchDto);
  }

  @Get('my') // Private
  @UseGuards(JwtAuthGuard)
  getMyJobs(@Req() req) {
    return this.jobsService.getEmployerJobs(req.user.userId);
  }

  @Get(':id') // Public
  async findOne(@Param('id') id: string) {
    return this.jobsService.findOne(+id);
  }

  @Post() // Private
  @UseGuards(JwtAuthGuard)
  create(@Body() createJobDto: CreateJobDto) {
    return this.jobsService.create(createJobDto);
  }

  @Patch(':id') // Private
  @UseGuards(JwtAuthGuard)
  updateJob(
    @Param('id') id: string,
    @Body() updateJobDto: Partial<CreateJobDto>,
  ) {
    return this.jobsService.update(+id, updateJobDto);
  }

  @Delete(':id') // Private
  @UseGuards(JwtAuthGuard)
  deleteJob(@Param('id') id: string) {
    return this.jobsService.remove(+id);
  }

  @Patch(':id/status') // Private
  @UseGuards(JwtAuthGuard)
  updateStatus(@Param('id') id: string, @Body('status') status: JobStatus) {
    return this.jobsService.changeStatus(+id, status);
  }
}
