import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { TokenBlacklistService } from '../services/token-blacklist.service';

/**
 * JWT Strategy for Passport
 * Validates JWT tokens and extracts user payload
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private tokenBlacklistService: TokenBlacklistService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
      passReqToCallback: true
    });
  }

  /**
   * Validate JWT payload
   * @param req - Request object (to get token)
   * @param payload - JWT payload
   * @returns User data
   */
  async validate(req: any, payload: any) {
    // Extract token from header
    const token = req.headers.authorization?.replace('Bearer ', '');

    // Check if token is blacklisted
    if (token && this.tokenBlacklistService.isBlacklisted(token)) {
      throw new UnauthorizedException('Token has been invalidated. Please login again');
    }

    return {
      id: payload.id,
      username: payload.username,
      role: payload.role
    };
  }
}
