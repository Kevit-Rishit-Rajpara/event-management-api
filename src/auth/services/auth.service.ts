import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/services/users.service';
import { TokenBlacklistService } from './token-blacklist.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';

/**
 * Auth Service
 * Handles authentication logic
 */
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private tokenBlacklistService: TokenBlacklistService
  ) {}

  /**
   * Register a new user
   * @param registerDto - Registration data
   * @returns Success message and user ID
   */
  async register(registerDto: RegisterDto) {
    const { username, password, role } = registerDto;

    const user = await this.usersService.create(username, password, role || 'User');

    return {
      success: true,
      message: 'User registered successfully',
      userId: user._id
    };
  }

  /**
   * Login user
   * @param loginDto - Login credentials
   * @returns JWT token and user info
   */
  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;

    const user = await this.usersService.findByUsername(username);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.usersService.validatePassword(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      id: user._id,
      username: user.username,
      role: user.role
    };

    const token = this.jwtService.sign(payload);

    return {
      success: true,
      token,
      role: user.role,
      userId: user._id
    };
  }

  /**
   * Logout user by blacklisting token
   * @param token - JWT token to blacklist
   * @returns Success message
   */
  async logout(token: string) {
    this.tokenBlacklistService.addToBlacklist(token);

    return {
      success: true,
      message: 'Logged out successfully'
    };
  }
}
