import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { Role } from './entities/roles.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role])], // Registers the 'roles' table
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
