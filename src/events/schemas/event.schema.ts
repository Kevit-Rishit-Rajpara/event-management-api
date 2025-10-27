import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

/**
 * Event document type
 */
export type EventDocument = Event & Document;

/**
 * Event Schema
 * Defines the structure for event documents in MongoDB
 */
@Schema({ timestamps: true })
export class Event {
  /**
   * Event title
   */
  @Prop({
    required: true,
    trim: true,
    minlength: 3
  })
  title: string;

  /**
   * Event description
   */
  @Prop({ trim: true })
  description: string;

  /**
   * Event date and time
   */
  @Prop({ required: true, type: Date })
  date: Date;

  /**
   * Event location
   */
  @Prop({ trim: true })
  location: string;

  /**
   * Maximum number of attendees
   */
  @Prop({ min: 1 })
  maxAttendees: number;

  /**
   * User who created the event (Admin)
   */
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  createdBy: User;
}

export const EventSchema = SchemaFactory.createForClass(Event);
