import { IsString, IsNumber, IsDateString } from 'class-validator';

export class CreateJobDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  category: string;

  @IsString()
  location: string;

  @IsNumber()
  salary: number;

  @IsDateString()
  deadline: Date;

  @IsNumber()
  companyId: number;
}
