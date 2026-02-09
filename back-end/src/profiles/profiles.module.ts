import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import { Profile } from './entities/profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Profile])], // Registers the 'profiles' table
  controllers: [ProfilesController],
  providers: [ProfilesService],
})
export class ProfilesModule {}
