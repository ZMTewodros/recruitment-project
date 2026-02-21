// src/auth/auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { User } from '../users/entities/user.entity';
import { randomBytes } from 'crypto';
import { MailService } from './mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async register(registerDto: RegisterDto): Promise<User> {
    // User is created with isEmailVerified: true automatically in UsersService
    return await this.usersService.create(registerDto);
  }

  // Standard Login (No OTP)
  async signIn(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user || !(await bcrypt.compare(pass, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        profileCompleted: user.profileCompleted,
      },
    };
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (user) {
      const token = randomBytes(32).toString('hex');
      await this.usersService.saveResetToken(user.id, token);
      await this.mailService.sendEmail(
        email,
        'Password Reset',
        `Reset here: http://localhost:5000/api/auth/reset-password?token=${token}`,
      );
    }
    return {
      message: 'If the email exists, password reset instructions will be sent.',
    };
  }

  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    const user = await this.usersService.resetPassword(token, newPassword);
    if (!user) throw new BadRequestException('Invalid or expired token');
    return { message: 'Password reset successfully' };
  }
}
//   async requestLoginOtp(
//     email: string,
//     password: string,
//   ): Promise<{ message: string }> {
//     const user = await this.usersService.findByEmail(email);

//     if (!user || !(await bcrypt.compare(password, user.password))) {
//       throw new UnauthorizedException('Invalid email or password');
//     }

//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     const expiry = new Date(Date.now() + 10 * 60 * 1000);

//     await this.usersService.saveLoginOtp(user.id, otp, expiry);

//     await this.mailService.sendEmail(
//       user.email,
//       'Your Login OTP',
//       `Your login OTP is: ${otp}`,
//     );

//     return { message: 'OTP sent to your email.' };
//   }

//   async loginWithOtp(email: string, otp: string) {
//     const user = await this.usersService.findByEmail(email);

//     if (
//       !user ||
//       !user.loginOtp ||
//       !user.loginOtpExpiry ||
//       user.loginOtp !== otp ||
//       user.loginOtpExpiry.getTime() < Date.now()
//     ) {
//       throw new UnauthorizedException('Invalid or expired OTP');
//     }

//     await this.usersService.clearLoginOtp(user.id);

//     const payload = { sub: user.id, email: user.email, role: user.role };
//     return {
//       access_token: await this.jwtService.signAsync(payload),
//       user: { id: user.id, name: user.name, role: user.role },
//     };
//   }
// }
