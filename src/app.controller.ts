import { Controller, Get } from '@nestjs/common';

/**
 * Root application controller
 */
@Controller()
export class AppController {
  /**
   * Health check endpoint
   * @returns API information
   */
  @Get()
  getInfo() {
    return {
      success: true,
      message: 'Event Management API - NestJS',
      version: '1.0.0',
      documentation: '/api'
    };
  }
}
