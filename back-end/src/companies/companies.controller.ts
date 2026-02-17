import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CompanyService } from '../companies/companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { Request } from 'express';

@Controller('company')
@UseGuards(JwtAuthGuard)
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  create(
    @Body() dto: CreateCompanyDto,
    @Req() req: Request & { user?: { userId: number } },
  ) {
    return this.companyService.createCompany(Number(req.user?.userId), dto);
  }

  @Get('me')
  getMyCompany(@Req() req: Request & { user?: { userId: number } }) {
    return this.companyService.getMyCompany(Number(req.user?.userId));
  }
  // --- NEW: Stats Route ---
  @Get('stats')
  async getStats(@Req() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return this.companyService.getDashboardStats(Number(req.user.userId));
  }
}
