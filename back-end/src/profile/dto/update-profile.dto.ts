import { IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  // @IsOptional()
  // @IsString()
  // address?: string;
  @IsOptional()
  @IsString()
  location?: string;
  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  skills?: any[];

  @IsOptional()
  experience?: any[];

  @IsOptional()
  education?: any[];
  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  cv?: string;
}
