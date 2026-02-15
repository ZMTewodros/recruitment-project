import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { User } from '../users/entities/user.entity';
// import { OtpLoginDto } from './dto/otp-login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto): Promise<User> {
    return this.authService.register(registerDto);
  }
  @Post('login') // Simple login endpoint
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto) {
    return this.authService.signIn(loginDto.email, loginDto.password);
  }

  // @Post('login/request-otp')
  // @HttpCode(HttpStatus.OK)
  // loginRequestOtp(@Body() loginDto: LoginDto): Promise<{ message: string }> {
  //   return this.authService.requestLoginOtp(loginDto.email, loginDto.password);
  // }

  // @Post('login/verify-otp')
  // @HttpCode(HttpStatus.OK)
  // loginWithOtp(@Body() otpLoginDto: OtpLoginDto) {
  //   return this.authService.loginWithOtp(otpLoginDto.email, otpLoginDto.otp);
  // }

  @Post('forgot-password')
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }

  @Post('reset-password')
  resetPassword(@Body() dto: { token: string; newPassword: string }) {
    return this.authService.resetPassword(dto.token, dto.newPassword);
  }
}
