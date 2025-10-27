import { Controller, Get, UseGuards } from '@nestjs/common';
import { AnalyticsService } from '../services/analytics.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

/**
 * Analytics Controller
 * Provides analytics endpoints for admins
 */
@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('Admin')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  /**
   * Get events per month
   * @route GET /api/analytics/events-per-month
   * @access Private/Admin
   */
  @Get('events-per-month')
  async getEventsPerMonth() {
    return this.analyticsService.getEventsPerMonth();
  }

  /**
   * Get top 3 events by registration count
   * @route GET /api/analytics/top-events
   * @access Private/Admin
   */
  @Get('top-events')
  async getTopEvents() {
    return this.analyticsService.getTopEvents();
  }
}
