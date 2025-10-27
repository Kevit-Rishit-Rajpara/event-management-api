import { IsString, IsNotEmpty } from 'class-validator';

/**
 * DTO for user login
 */
export class LoginDto {
  /**
   * Username
   */
  @IsString()
  @IsNotEmpty()
  username: string;

  /**
   * Password
   */
  @IsString()
  @IsNotEmpty()
  password: string;
}
