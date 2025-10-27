import { IsString, IsNotEmpty, IsDateString, IsOptional, IsNumber, Min, MinLength } from 'class-validator';

/**
 * DTO for creating an event
 */
export class CreateEventDto {
  /**
   * Event title
   */
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'Title must be at least 3 characters long' })
  title: string;

  /**
   * Event description (optional)
   */
  @IsOptional()
  @IsString()
  description?: string;

  /**
   * Event date and time (ISO 8601 format)
   */
  @IsNotEmpty()
  @IsDateString()
  date: string;

  /**
   * Event location (optional)
   */
  @IsOptional()
  @IsString()
  location?: string;

  /**
   * Maximum number of attendees (optional, minimum 1)
   */
  @IsOptional()
  @IsNumber()
  @Min(1, { message: 'Maximum attendees must be at least 1' })
  maxAttendees?: number;
}
