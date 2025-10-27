import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Registration, RegistrationDocument } from '../schemas/registration.schema';
import { Event, EventDocument } from '../schemas/event.schema';

/**
 * Registration Service
 * Handles event registration operations
 */
@Injectable()
export class RegistrationService {
  constructor(
    @InjectModel(Registration.name) private registrationModel: Model<RegistrationDocument>,
    @InjectModel(Event.name) private eventModel: Model<EventDocument>
  ) {}

  /**
   * Register user for an event
   * @param eventId - Event ID
   * @param userId - User ID
   * @returns Registration document
   */
  async registerForEvent(eventId: string, userId: string): Promise<RegistrationDocument> {
    const event = await this.eventModel.findById(eventId);
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const existingRegistration = await this.registrationModel.findOne({
      user: userId,
      event: eventId
    });
    if (existingRegistration) {
      throw new BadRequestException('You are already registered for this event');
    }

    if (event.maxAttendees) {
      const registrationCount = await this.registrationModel.countDocuments({ event: eventId });
      if (registrationCount >= event.maxAttendees) {
        throw new BadRequestException('Event is full');
      }
    }

    const registration = new this.registrationModel({
      user: userId,
      event: eventId
    });

    return registration.save();
  }

  /**
   * Cancel registration
   * @param eventId - Event ID
   * @param userId - User ID
   */
  async cancelRegistration(eventId: string, userId: string): Promise<void> {
    const result = await this.registrationModel.findOneAndDelete({
      user: userId,
      event: eventId
    });

    if (!result) {
      throw new NotFoundException('You are not registered for this event');
    }
  }
}
