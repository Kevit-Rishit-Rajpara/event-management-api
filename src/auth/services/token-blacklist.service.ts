import { Injectable } from '@nestjs/common';

/**
 * Token Blacklist Service
 * In-memory token blacklist for logout functionality
 * In production, use Redis or database
 */
@Injectable()
export class TokenBlacklistService {
  private blacklist: Set<string> = new Set();

  /**
   * Add token to blacklist
   * @param token - JWT token to blacklist
   */
  addToBlacklist(token: string): void {
    this.blacklist.add(token);
  }

  /**
   * Check if token is blacklisted
   * @param token - JWT token to check
   * @returns True if token is blacklisted
   */
  isBlacklisted(token: string): boolean {
    return this.blacklist.has(token);
  }

  /**
   * Clear all blacklisted tokens (for testing)
   */
  clearBlacklist(): void {
    this.blacklist.clear();
  }
}
