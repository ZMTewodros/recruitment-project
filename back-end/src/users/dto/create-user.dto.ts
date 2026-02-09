import {
  IsEmail,
  IsString,
  MinLength,
  IsEnum,
  IsNotEmpty,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsEnum(['jobseeker', 'employer', 'admin'], {
    message: 'Role must be either jobseeker, employer, or admin',
  })
  role: string;
}
