import { IsString, IsNotEmpty, MinLength, IsOptional, IsEnum } from 'class-validator';

/**
 * DTO for user registration
 */
export class RegisterDto {
  /**
   * Username (minimum 3 characters)
   */
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  username: string;

  /**
   * Password
   */
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  /**
   * User role (optional, defaults to 'User')
   */
  @IsOptional()
  @IsEnum(['User', 'Admin'], { message: 'Role must be either User or Admin' })
  role?: string;
}
