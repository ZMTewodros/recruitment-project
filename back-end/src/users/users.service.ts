import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { name, email, password, role } = createUserDto;

    // Check if email already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    // Hash password
    // use a typed wrapper for bcrypt.hash to avoid unsafe any/member-access lint errors
    const hashFn: (s: string, r: number) => Promise<string> = (
      bcrypt as unknown as {
        hash: (s: string, r: number) => Promise<string>;
      }
    ).hash;
    const hashedPassword = await hashFn(password, 10);

    const newUser = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    return this.userRepository.save(newUser);
  }

  async findByEmail(email: string): Promise<User | null> {
    // Using the findOne options with explicit select should work,
    // but let's make it even more robust for bcrypt:
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'name', 'email', 'password', 'role'], // Must include 'password' explicitly
    });

    return user;
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }
}
