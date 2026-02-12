import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { GoogleDriveService } from '../common/google-drive.service';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly googleDriveService: GoogleDriveService,
  ) {}

  async getMyProfile(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: [
        'id',
        'name',
        'email',
        'phone',
        'address',
        'bio',
        'skills',
        'experience',
        'education',
        'cv',
        'avatar',
      ],
    });

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async uploadCVToDrive(userId: number, file: Express.Multer.File) {
    if (!file) throw new InternalServerErrorException('File is missing');

    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    if (!folderId)
      throw new InternalServerErrorException(
        'Google Drive folder ID is not set',
      );

    const url = await this.googleDriveService.uploadFile(file, folderId);

    await this.userRepository.update(userId, { cv: url });

    return { message: 'CV uploaded successfully', url };
  }

  async uploadAvatarToDrive(userId: number, file: Express.Multer.File) {
    if (!file) throw new InternalServerErrorException('File is missing');

    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    if (!folderId)
      throw new InternalServerErrorException(
        'Google Drive folder ID is not set',
      );

    const url = await this.googleDriveService.uploadFile(file, folderId);

    await this.userRepository.update(userId, { avatar: url });

    return { message: 'Avatar uploaded successfully', url };
  }
}
