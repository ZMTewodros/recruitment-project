import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
  ) {}

  async updateOrCreate(
    userId: number,
    profileData: UpdateProfileDto,
  ): Promise<Profile> {
    let profile = await this.profileRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (profile) {
      Object.assign(profile, profileData);
    } else {
      profile = this.profileRepository.create({
        ...profileData,
        skills: profileData.skills
          ? Array.isArray(profileData.skills)
            ? profileData.skills
            : [profileData.skills]
          : undefined,
        user: { id: userId },
      });
    }

    return this.profileRepository.save(profile);
  }

  async getProfile(userId: number): Promise<Profile> {
    const profile = await this.profileRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return profile;
  }
}
