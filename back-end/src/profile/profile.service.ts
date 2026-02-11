import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import type { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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

  async updateProfile(userId: number, data: UpdateProfileDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    Object.assign(user, data);
    return this.userRepository.save(user);
  }

  async updateCV(userId: number, filePath: string) {
    await this.userRepository.update(userId, { cv: filePath });
    return { message: 'CV uploaded successfully', path: filePath };
  }

  async updateAvatar(userId: number, filePath: string) {
    await this.userRepository.update(userId, { avatar: filePath });
    return { message: 'Profile picture uploaded successfully', path: filePath };
  }
}
