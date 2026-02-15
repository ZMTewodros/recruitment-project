// src/applications/dto/apply-job.dto.ts
import { IsNotEmpty, IsOptional } from 'class-validator';

export class ApplyJobDto {
  @IsNotEmpty()
  job_id: number;

  @IsOptional()
  cover_letter?: string;

  @IsOptional()
  cv_file?: string; // path or URL to the uploaded CV
}
