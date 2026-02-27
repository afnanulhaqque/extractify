import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: any) {
    return this.authService.login(req.user);
  }

  @Post('logout')
  async logout() {
    return { success: true, message: 'Logged out successfully' };
  }

  @Post('refresh')
  async refresh() {
    // JWT handles expiration, this endpoint usually generates a new token using refresh token
    // For MVP we just return a stub or implement if needed
    return { success: true, message: 'Not implemented in MVP' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req: any) {
    return { success: true, data: req.user };
  }
}
