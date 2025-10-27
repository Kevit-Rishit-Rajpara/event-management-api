import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event, EventDocument } from '../../events/schemas/event.schema';

/**
 * Analytics Service
 * Provides analytics and reporting functionality
 */
@Injectable()
export class AnalyticsService {
  constructor(@InjectModel(Event.name) private eventModel: Model<EventDocument>) {}

  /**
   * Get events count per month for current year
   * @returns Events per month data
   */
  async getEventsPerMonth() {
    const currentYear = new Date().getFullYear();
    const startDate = new Date(currentYear, 0, 1);
    const endDate = new Date(currentYear, 11, 31, 23, 59, 59);

    const eventsPerMonth = await this.eventModel.aggregate([
      { $match: { date: { $gte: startDate, $lte: endDate } } },
      { $group: { _id: { $month: '$date' }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, month: '$_id', count: 1 } }
    ]);

    return {
      success: true,
      year: currentYear,
      eventsPerMonth
    };
  }

  /**
   * Get top 3 events by registration count
   * @returns Top events data
   */
  async getTopEvents() {
    const topEvents = await this.eventModel.aggregate([
      {
        $lookup: {
          from: 'registrations',
          localField: '_id',
          foreignField: 'event',
          as: 'registrations'
        }
      },
      { $addFields: { registrationCount: { $size: '$registrations' } } },
      { $sort: { registrationCount: -1 } },
      { $limit: 3 },
      {
        $project: {
          title: 1,
          description: 1,
          date: 1,
          location: 1,
          registrationCount: 1
        }
      }
    ]);

    return {
      success: true,
      count: topEvents.length,
      topEvents
    };
  }
}
