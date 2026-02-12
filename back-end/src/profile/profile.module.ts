import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { User } from '../users/entities/user.entity';
import { GoogleDriveService } from '../common/google-drive.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [ProfileService, GoogleDriveService],
  controllers: [ProfileController],
})
export class ProfileModule {}
