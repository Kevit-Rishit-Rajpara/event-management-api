import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event, EventDocument } from '../schemas/event.schema';
import { CreateEventDto } from '../dto/create-event.dto';
import { UpdateEventDto } from '../dto/update-event.dto';

/**
 * Events Service
 * Handles event-related database operations
 */
@Injectable()
export class EventsService {
  constructor(@InjectModel(Event.name) private eventModel: Model<EventDocument>) {}

  /**
   * Create a new event
   * @param createEventDto - Event data
   * @param userId - ID of user creating the event
   * @returns Created event
   */
  async create(createEventDto: CreateEventDto, userId: string): Promise<EventDocument> {
    const event = new this.eventModel({
      ...createEventDto,
      createdBy: userId
    });
    return event.save();
  }

  /**
   * Find all events with optional filtering
   * @param date - Filter by date (YYYY-MM-DD)
   * @param location - Filter by location
   * @returns Array of events
   */
  async findAll(date?: string, location?: string): Promise<EventDocument[]> {
    const filter: any = {};

    if (date) {
      const queryDate = new Date(date);
      const nextDay = new Date(queryDate);
      nextDay.setDate(nextDay.getDate() + 1);
      filter.date = { $gte: queryDate, $lt: nextDay };
    }

    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    return this.eventModel.find(filter).populate('createdBy', 'username role').exec();
  }

  /**
   * Find event by ID
   * @param id - Event ID
   * @returns Event document
   */
  async findById(id: string): Promise<EventDocument> {
    const event = await this.eventModel.findById(id).populate('createdBy', 'username role').exec();
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return event;
  }

  /**
   * Update an event
   * @param id - Event ID
   * @param updateEventDto - Updated event data
   * @returns Updated event
   */
  async update(id: string, updateEventDto: UpdateEventDto): Promise<EventDocument> {
    const event = await this.eventModel.findByIdAndUpdate(id, updateEventDto, { new: true }).exec();
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return event;
  }

  /**
   * Delete an event
   * @param id - Event ID
   */
  async delete(id: string): Promise<void> {
    const result = await this.eventModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Event not found');
    }
  }
}
