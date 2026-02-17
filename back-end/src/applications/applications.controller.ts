import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Req,
  Param,
  Patch,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ApplicationsService } from './applications.service';
import { ApplyJobDto } from './dto/apply-job.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { ApplicationStatus } from './entities/applications.entity';

@Controller('applications')
@UseGuards(JwtAuthGuard)
export class ApplicationsController {
  constructor(private applicationsService: ApplicationsService) {}

  @Post('apply')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async apply(
    @Req() req: Request & { user: { userId: string } },
    @Body() dto: ApplyJobDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const userId = Number(req.user.userId);
    if (!file && !dto.cv_file) {
      throw new BadRequestException('Please upload a CV file');
    }
    return this.applicationsService.applyJob(userId, dto, file);
  }

  @Get('my')
  async getMyApplications(@Req() req: Request & { user: { userId: string } }) {
    const userId = Number(req.user.userId);
    return this.applicationsService.getUserApplications(userId);
  }

  // NEW: Route for Employers to see applicants for their jobs
  @Get('job/:jobId')
  async getJobApplications(@Param('jobId') jobId: string) {
    return this.applicationsService.getJobApplications(Number(jobId));
  }

  // NEW: Route for Employers to change status
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: ApplicationStatus,
  ) {
    return this.applicationsService.updateStatus(Number(id), status);
  }
}
