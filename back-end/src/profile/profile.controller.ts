import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateCompanyDto } from '../companies/dto/update-company.dto';

interface AuthRequest extends Request {
  user: {
    userId: number;
    role: string;
    [key: string]: any;
  };
}

type FileFilterCallback = (error: Error | null, acceptFile: boolean) => void;

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('me')
  async getMyProfile(@Req() req: AuthRequest) {
    return this.profileService.getMyProfile(req.user.userId);
  }

  @Put('me')
  async updateMyProfile(
    @Req() req: AuthRequest,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.profileService.updateMyProfile(req.user.userId, dto);
  }

  @Get('company')
  async getCompany(@Req() req: AuthRequest) {
    return this.profileService.getCompany(req.user.userId);
  }

  @Put('company')
  async updateCompany(@Req() req: AuthRequest, @Body() dto: UpdateCompanyDto) {
    return this.profileService.updateCompany(req.user.userId, dto);
  }

  @Post('upload/avatar')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      fileFilter: (_req, file: Express.Multer.File, cb: FileFilterCallback) => {
        const allowedExtensions = /\.(jpg|jpeg|png)$/;
        if (!allowedExtensions.test(file.originalname.toLowerCase())) {
          return cb(new BadRequestException('Only image files allowed'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadAvatar(
    @Req() req: AuthRequest,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.profileService.uploadAvatar(req.user.userId, file);
  }

  @Post('upload/cv')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      fileFilter: (_req, file: Express.Multer.File, cb: FileFilterCallback) => {
        const allowedExtensions = /\.(pdf|doc|docx)$/;
        if (!allowedExtensions.test(file.originalname.toLowerCase())) {
          return cb(
            new BadRequestException('Only document files allowed'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async uploadCV(
    @Req() req: AuthRequest,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.profileService.uploadCV(req.user.userId, file);
  }

  @Post('upload/companyLogo')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      fileFilter: (_req, file: Express.Multer.File, cb: FileFilterCallback) => {
        const allowedExtensions = /\.(jpg|jpeg|png)$/;
        if (!allowedExtensions.test(file.originalname.toLowerCase())) {
          return cb(new BadRequestException('Only image files allowed'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadCompanyLogo(
    @Req() req: AuthRequest,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.profileService.uploadCompanyLogo(req.user.userId, file);
  }
}
