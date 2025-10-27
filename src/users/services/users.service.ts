import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import * as bcrypt from 'bcryptjs';

/**
 * Users Service
 * Handles user-related database operations
 */
@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  /**
   * Create a new user
   * @param username - User's username
   * @param password - Plain text password
   * @param role - User role
   * @returns Created user document
   */
  async create(username: string, password: string, role: string = 'User'): Promise<UserDocument> {
    const existingUser = await this.userModel.findOne({ username });
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new this.userModel({
      username,
      password: hashedPassword,
      role
    });

    return user.save();
  }

  /**
   * Find user by username
   * @param username - Username to search for
   * @returns User document or null
   */
  async findByUsername(username: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ username });
  }

  /**
   * Find user by ID
   * @param id - User ID
   * @returns User document or null
   */
  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id);
  }

  /**
   * Validate user password
   * @param plainPassword - Plain text password
   * @param hashedPassword - Hashed password from database
   * @returns True if password is valid
   */
  async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
