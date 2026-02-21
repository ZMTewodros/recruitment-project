// src/users/users.service.ts
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
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
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      role,
      isEmailVerified: true, // Automatically verified
    });

    return this.userRepository.save(newUser);
  }

  async saveResetToken(id: number, token: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    user.resetPasswordToken = token;
    await this.userRepository.save(user);
  }

  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { resetPasswordToken: token },
    });
    if (user) {
      user.password = await bcrypt.hash(newPassword, 10);
      user.resetPasswordToken = null;
      return await this.userRepository.save(user);
    }
    return null;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email },
      select: [
        'id',
        'name',
        'email',
        'password',
        'role',
        'profileCompleted',
        // 'loginOtp',
        // 'loginOtpExpiry',
      ],
    });
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }
}

//   async saveLoginOtp(id: number, otp: string, expiry: Date): Promise<void> {
//     const user = await this.userRepository.findOne({ where: { id } });
//     if (!user) throw new NotFoundException('User not found');
//     user.loginOtp = otp;
//     user.loginOtpExpiry = expiry;
//     await this.userRepository.save(user);
//   }

//   async clearLoginOtp(id: number): Promise<void> {
//     await this.userRepository.update(id, {
//       loginOtp: null,
//       loginOtpExpiry: null,
//     });
//   }
// }
