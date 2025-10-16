const mongoose = require('mongoose');

/**
 * Registration Schema
 * @typedef {Object} Registration
 * @property {ObjectId} user - Reference to User who registered
 * @property {ObjectId} event - Reference to Event being registered for
 * @property {Date} createdAt - Auto-generated timestamp
 * @property {Date} updatedAt - Auto-generated timestamp
 */
const RegistrationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required']
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event is required']
    }
  },
  {
    timestamps: true
  }
);

// Create compound index to ensure user can only register once per event
RegistrationSchema.index({ user: 1, event: 1 }, { unique: true });

module.exports = mongoose.model('Registration', RegistrationSchema);
