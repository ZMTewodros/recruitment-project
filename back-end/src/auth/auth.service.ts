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
    const user = await this.usersService.create(registerDto);
    const token = randomBytes(32).toString('hex');

    await this.usersService.updateVerificationToken(user.id, token);

    await this.mailService.sendEmail(
      user.email,
      'Verify your account',
      `Click to verify: http://localhost:5000/api/auth/verify-email?token=${token}`,
    );

    return user;
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    const user = await this.usersService.verifyEmail(token);
    if (!user) {
      throw new BadRequestException('Invalid or expired token');
    }
    return { message: 'Email verified successfully' };
  }

  async signIn(
    email: string,
    pass: string,
  ): Promise<{
    access_token: string;
    user: { id: number; name: string; role: string };
  }> {
    const user = await this.usersService.findByEmail(email);

    if (
      !user ||
      !(await bcrypt.compare(pass, user.password)) ||
      !user.isEmailVerified
    ) {
      throw new UnauthorizedException(
        'Invalid email or password, or account not verified',
      );
    }

    const payload = { sub: user.id, email: user.email, role: user.role };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
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
      message:
        'If the email exists in our system, password reset instructions will be sent.',
    };
  }

  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    const user = await this.usersService.resetPassword(token, newPassword);
    if (!user) {
      throw new BadRequestException('Invalid or expired token');
    }
    return { message: 'Password reset successfully' };
  }
}
