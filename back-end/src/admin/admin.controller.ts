import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator'; // Import the decorator you just created
import { JobStatus } from '../jobs/entities/job.entity';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard) // JwtAuthGuard populates req.user, RolesGuard checks the role
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('analytics')
  @Roles('admin') // Only 'admin' role can see stats
  getAnalytics() {
    return this.adminService.getAnalytics();
  }

  @Get('users')
  @Roles('admin')
  getUsers() {
    return this.adminService.getAllUsers();
  }

  @Patch('users/:id/block')
  @Roles('admin')
  blockUser(@Param('id') id: string, @Body('isActive') isActive: boolean) {
    return this.adminService.toggleUserStatus(+id, isActive);
  }

  @Get('jobs/pending')
  @Roles('admin')
  getPending() {
    return this.adminService.getPendingJobs();
  }

  @Patch('jobs/:id/approve')
  @Roles('admin')
  approveJob(@Param('id') id: string, @Body('status') status: JobStatus) {
    return this.adminService.updateJobStatus(+id, status);
  }
  // src/admin/admin.controller.ts

  @Get('jobs')
  @Roles('admin')
  async getAllJobs() {
    return this.adminService.getAllJobs();
  }
}
