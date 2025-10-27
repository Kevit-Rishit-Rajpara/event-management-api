import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { EventsService } from '../services/events.service';
import { RegistrationService } from '../services/registration.service';
import { CreateEventDto } from '../dto/create-event.dto';
import { UpdateEventDto } from '../dto/update-event.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

/**
 * Events Controller
 * Handles event management and registration endpoints
 */
@Controller('events')
@UseGuards(JwtAuthGuard)
export class EventsController {
  constructor(
    private eventsService: EventsService,
    private registrationService: RegistrationService
  ) {}

  /**
   * Create a new event
   * @route POST /api/events
   * @access Private/Admin
   */
  @Post()
  @UseGuards(RolesGuard)
  @Roles('Admin')
  async create(@Body() createEventDto: CreateEventDto, @CurrentUser() user: any) {
    const event = await this.eventsService.create(createEventDto, user.id);
    return {
      success: true,
      message: 'Event created successfully',
      event
    };
  }

  /**
   * Get all events with optional filtering
   * @route GET /api/events
   * @access Private
   */
  @Get()
  async findAll(@Query('date') date?: string, @Query('location') location?: string) {
    const events = await this.eventsService.findAll(date, location);
    return {
      success: true,
      count: events.length,
      events
    };
  }

  /**
   * Get event by ID
   * @route GET /api/events/:id
   * @access Private
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const event = await this.eventsService.findById(id);
    return {
      success: true,
      event
    };
  }

  /**
   * Update an event
   * @route PUT /api/events/:id
   * @access Private/Admin
   */
  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles('Admin')
  async update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    const event = await this.eventsService.update(id, updateEventDto);
    return {
      success: true,
      message: 'Event updated successfully',
      event
    };
  }

  /**
   * Delete an event
   * @route DELETE /api/events/:id
   * @access Private/Admin
   */
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('Admin')
  async delete(@Param('id') id: string) {
    await this.eventsService.delete(id);
    return {
      success: true,
      message: 'Event deleted successfully'
    };
  }

  /**
   * Register for an event
   * @route POST /api/events/:id/register
   * @access Private
   */
  @Post(':id/register')
  async register(@Param('id') id: string, @CurrentUser() user: any) {
    const registration = await this.registrationService.registerForEvent(id, user.id);
    return {
      success: true,
      message: 'Successfully registered for event',
      registration
    };
  }

  /**
   * Cancel registration
   * @route DELETE /api/events/:id/register
   * @access Private
   */
  @Delete(':id/register')
  async cancelRegistration(@Param('id') id: string, @CurrentUser() user: any) {
    await this.registrationService.cancelRegistration(id, user.id);
    return {
      success: true,
      message: 'Registration cancelled successfully'
    };
  }
}
