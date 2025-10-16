const mongoose = require('mongoose');

/**
 * Event Schema
 * @typedef {Object} Event
 * @property {string} title - Event title
 * @property {string} description - Event description
 * @property {Date} date - Event date and time
 * @property {string} location - Event location
 * @property {number} maxAttendees - Maximum number of attendees allowed
 * @property {ObjectId} createdBy - Reference to User who created the event
 * @property {Date} createdAt - Auto-generated timestamp
 * @property {Date} updatedAt - Auto-generated timestamp
 */
const EventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters long']
    },
    description: {
      type: String,
      trim: true
    },
    date: {
      type: Date,
      required: [true, 'Event date is required']
    },
    location: {
      type: String,
      trim: true
    },
    maxAttendees: {
      type: Number,
      min: [1, 'Maximum attendees must be at least 1']
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Event', EventSchema);
