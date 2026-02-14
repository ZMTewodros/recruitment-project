import { IsOptional, IsString, IsNumberString } from 'class-validator';

export class SearchJobDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsNumberString()
  minSalary?: string;

  @IsOptional()
  @IsNumberString()
  maxSalary?: string;

  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;
}
