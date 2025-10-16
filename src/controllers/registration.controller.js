const Registration = require('../models/registration.model');
const Event = require('../models/event.model');

exports.registerForEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user.id;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const existingRegistration = await Registration.findOne({ user: userId, event: eventId });
    if (existingRegistration) {
      return res.status(400).json({ message: 'You are already registered for this event' });
    }

    if (event.maxAttendees) {
      const registrationCount = await Registration.countDocuments({ event: eventId });
      if (registrationCount >= event.maxAttendees) {
        return res.status(400).json({ message: 'Event is full' });
      }
    }

    const registration = new Registration({
      user: userId,
      event: eventId
    });

    await registration.save();

    res.status(201).json({ message: 'Successfully registered for event', registration });
  } catch (error) {
    res.status(500).json({ message: 'Error registering for event', error: error.message });
  }
};

exports.cancelRegistration = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user.id;

    const registration = await Registration.findOneAndDelete({ user: userId, event: eventId });

    if (!registration) {
      return res.status(404).json({ message: 'You are not registered for this event' });
    }

    res.json({ message: 'Registration cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling registration', error: error.message });
  }
};
