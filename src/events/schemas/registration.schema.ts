import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Event } from './event.schema';

/**
 * Registration document type
 */
export type RegistrationDocument = Registration & Document;

/**
 * Registration Schema
 * Links users to events they've registered for
 */
@Schema({ timestamps: true })
export class Registration {
  /**
   * User who registered
   */
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  /**
   * Event being registered for
   */
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Event', required: true })
  event: Event;
}

export const RegistrationSchema = SchemaFactory.createForClass(Registration);

// Create compound index to ensure user can only register once per event
RegistrationSchema.index({ user: 1, event: 1 }, { unique: true });
