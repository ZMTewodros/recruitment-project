import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  UseGuards,
  Req,
  Param,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  // Get dashboard summary and all lists
  @Get('jobseeker')
  async getJobSeekerDashboard(
    @Req() req: Request & { user?: { userId: number } },
  ) {
    return this.dashboardService.getJobSeekerData(Number(req.user?.userId));
  }

  // Save a job
  @Post('save/:jobId')
  async saveJob(
    @Param('jobId') jobId: number,
    @Req() req: Request & { user?: { userId: number } },
  ) {
    return this.dashboardService.saveJob(
      Number(req.user?.userId),
      Number(jobId),
    );
  }

  // Un-save a job
  @Delete('unsave/:jobId')
  async unsaveJob(
    @Param('jobId') jobId: number,
    @Req() req: Request & { user?: { userId: number } },
  ) {
    return this.dashboardService.unsaveJob(
      Number(req.user?.userId),
      Number(jobId),
    );
  }

  // Mark notification as read
  @Patch('notifications/:id/read')
  async markAsRead(
    @Param('id') id: number,
    @Req() req: Request & { user?: { userId: number } },
  ) {
    return this.dashboardService.markAsRead(
      Number(req.user?.userId),
      Number(id),
    );
  }
}
