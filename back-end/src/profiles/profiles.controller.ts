import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @UseGuards(JwtAuthGuard)
  @Post('me')
  updateMyProfile(
    @Request() req: { user: { userId: number } },
    @Body() profileData: UpdateProfileDto,
  ) {
    return this.profilesService.updateOrCreate(req.user.userId, profileData);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMyProfile(@Request() req: { user: { userId: number } }) {
    return this.profilesService.getProfile(req.user.userId);
  }
}
