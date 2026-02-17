import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { SearchJobDto } from './dto/search-job.dto';
import { JobStatus } from './entities/job.entity';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  create(@Body() createJobDto: CreateJobDto) {
    return this.jobsService.create(createJobDto);
  }

  @Get()
  findAll(@Query() searchDto: SearchJobDto) {
    return this.jobsService.findAll(searchDto);
  }
  @Patch(':id')
  async updateJob(
    @Param('id') id: string,
    @Body() updateJobDto: Partial<CreateJobDto>,
  ) {
    return this.jobsService.update(+id, updateJobDto);
  }
  @Delete(':id')
  async deleteJob(@Param('id') id: string) {
    return this.jobsService.remove(+id);
  }
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: JobStatus,
  ) {
    return this.jobsService.changeStatus(+id, status);
  }
}
