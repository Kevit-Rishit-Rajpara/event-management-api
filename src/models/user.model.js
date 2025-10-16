const mongoose = require('mongoose');

/**
 * User Schema
 * @typedef {Object} User
 * @property {string} username - Unique username for the user
 * @property {string} password - Hashed password
 * @property {string} role - User role (User or Admin)
 * @property {Date} createdAt - Auto-generated timestamp
 * @property {Date} updatedAt - Auto-generated timestamp
 */
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters long']
    },
    password: {
      type: String,
      required: [true, 'Password is required']
    },
    role: {
      type: String,
      enum: {
        values: ['User', 'Admin'],
        message: '{VALUE} is not a valid role'
      },
      default: 'User'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', UserSchema);
