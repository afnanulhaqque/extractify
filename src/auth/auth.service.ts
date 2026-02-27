import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      success: true,
      data: {
        access_token: this.jwtService.sign(payload),
        user
      }
    };
  }

  async register(registerDto: RegisterDto) {
    const { name, email, password } = registerDto;
    const existing = await this.usersService.findByEmail(email);
    if (existing) {
      throw new UnauthorizedException('User already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersService.create({
      name,
      email,
      password: hashedPassword,
    });
    const { password: _, ...result } = user;
    return this.login(result);
  }
}
