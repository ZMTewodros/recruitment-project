import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

// This automatically takes all fields from CreateUserDto and makes them optional
export class UpdateUserDto extends PartialType(CreateUserDto) {}
