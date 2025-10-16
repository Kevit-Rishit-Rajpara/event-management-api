const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true }, // 
  description: { type: String }, // [cite: 17]
  date: { type: Date, required: true }, // [cite: 18]
  location: { type: String }, // [cite: 19]
  maxAttendees: { type: Number }, // [cite: 20]
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // 
});

module.exports = mongoose.model('Event', EventSchema);