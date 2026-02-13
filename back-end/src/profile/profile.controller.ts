import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Req,
  Get,
  Put,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { UpdateProfileDto } from './dto/update-profile.dto';

// Type-safe AuthRequest for JWT
interface AuthRequest extends Request {
  user: {
    userId: number;
    role: string;
    [key: string]: any;
  };
}

// Type-safe callback type for fileFilter
type FileFilterCallback = (error: Error | null, acceptFile: boolean) => void;

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}
  @Get('me')
  async getMyProfile(@Req() req: AuthRequest) {
    return await this.profileService.getMyProfile(req.user.userId);
  }

  @Put('me')
  async updateMyProfile(
    @Req() req: AuthRequest,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return await this.profileService.updateMyProfile(
      req.user.userId,
      updateProfileDto,
    );
  }

  @Post('upload/cv')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      fileFilter: (
        _req: any,
        file: Express.Multer.File,
        cb: FileFilterCallback,
      ) => {
        const allowedExtensions = /\.(pdf|doc|docx)$/;
        if (!allowedExtensions.test(file.originalname.toLowerCase())) {
          return cb(
            new BadRequestException('Only document files are allowed!'),
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
    if (!file) throw new BadRequestException('File is required');
    return await this.profileService.uploadCVToDrive(req.user.userId, file);
  }

  @Post('upload/avatar')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      fileFilter: (
        _req: any,
        file: Express.Multer.File,
        cb: FileFilterCallback,
      ) => {
        const allowedExtensions = /\.(jpg|jpeg|png)$/;
        if (!allowedExtensions.test(file.originalname.toLowerCase())) {
          return cb(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async uploadAvatar(
    @Req() req: AuthRequest,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('File is required');
    return await this.profileService.uploadAvatarToDrive(req.user.userId, file);
  }
}
