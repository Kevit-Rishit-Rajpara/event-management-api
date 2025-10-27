import { IsString, IsDateString, IsOptional, IsNumber, Min, MinLength } from 'class-validator';

/**
 * DTO for updating an event
 */
export class UpdateEventDto {
  /**
   * Event title (optional)
   */
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Title must be at least 3 characters long' })
  title?: string;

  /**
   * Event description (optional)
   */
  @IsOptional()
  @IsString()
  description?: string;

  /**
   * Event date and time (optional, ISO 8601 format)
   */
  @IsOptional()
  @IsDateString()
  date?: string;

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
