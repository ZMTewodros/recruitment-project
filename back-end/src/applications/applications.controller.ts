// src/applications/applications.controller.ts
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Req,
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
    // req.user.userId comes from your JwtStrategy validate() method
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
}
