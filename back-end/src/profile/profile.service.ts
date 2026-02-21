import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Company } from '../companies/entities/company.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateCompanyDto } from '../companies/dto/update-company.dto';
import { GoogleDriveService } from '../common/google-drive.service';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,

    private readonly googleDriveService: GoogleDriveService,
  ) {}

  // ---------- User ----------

  async getMyProfile(userId: number) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['company'],
    });

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateMyProfile(userId: number, dto: UpdateProfileDto) {
    await this.userRepo.update(userId, {
      ...dto,
      profileCompleted: true,
    });

    return this.getMyProfile(userId);
  }

  // ---------- Company ----------

  async getCompany(userId: number) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['company'],
    });

    if (!user) throw new NotFoundException('User not found');
    return user.company || null;
  }

  async updateCompany(userId: number, dto: UpdateCompanyDto) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['company'],
    });

    if (!user) throw new NotFoundException('User not found');

    if (!user.company) {
      const newCompany = this.companyRepo.create({ ...dto, user });
      return await this.companyRepo.save(newCompany);
    }

    Object.assign(user.company, dto);
    return await this.companyRepo.save(user.company);
  }

  // ---------- File Upload ----------

  async uploadAvatar(userId: number, file: Express.Multer.File) {
    if (!file) throw new BadRequestException('File is required');

    const url = await this.uploadToDrive(file);
    await this.userRepo.update(userId, { avatar: url });

    return { message: 'Avatar uploaded successfully', url };
  }

  async uploadCV(userId: number, file: Express.Multer.File) {
    if (!file) throw new BadRequestException('File is required');

    const url = await this.uploadToDrive(file);
    await this.userRepo.update(userId, { cv: url });

    return { message: 'CV uploaded successfully', url };
  }

  async uploadCompanyLogo(userId: number, file: Express.Multer.File) {
    if (!file) throw new BadRequestException('File is required');

    const url = await this.uploadToDrive(file);

    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['company'],
    });

    if (!user) throw new NotFoundException('User not found');

    let company = user.company;

    // If company does not exist → create it automatically
    if (!company) {
      company = this.companyRepo.create({
        name: 'Temporary',
        description: '',
        address: '',
        user,
        logo: url,
      });
    } else {
      company.logo = url;
    }

    await this.companyRepo.save(company);

    return { message: 'Company logo uploaded successfully', url };
  }

  // ---------- Google Drive Helper ----------

  private async uploadToDrive(file: Express.Multer.File) {
    if (!file) throw new InternalServerErrorException('File missing');

    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

    if (!folderId)
      throw new InternalServerErrorException(
        'Google Drive folder ID is not set',
      );

    return this.googleDriveService.uploadFile(file, folderId);
  }
}
