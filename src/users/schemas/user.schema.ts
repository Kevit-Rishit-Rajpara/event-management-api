import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * User document type
 */
export type UserDocument = User & Document;

/**
 * User Schema
 * Defines the structure for user documents in MongoDB
 */
@Schema({ timestamps: true })
export class User {
  /**
   * Unique username for the user
   */
  @Prop({
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  })
  username: string;

  /**
   * Hashed password
   */
  @Prop({ required: true })
  password: string;

  /**
   * User role (User or Admin)
   */
  @Prop({
    type: String,
    enum: ['User', 'Admin'],
    default: 'User'
  })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
