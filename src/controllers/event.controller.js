const Event = require('../models/event.model');

exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, location, maxAttendees } = req.body;

    if (!title || !date) {
      return res.status(400).json({ message: 'Title and date are required' });
    }

    const event = new Event({
      title,
      description,
      date,
      location,
      maxAttendees,
      createdBy: req.user.id
    });

    await event.save();

    res.status(201).json({ message: 'Event created successfully', event });
  } catch (error) {
    res.status(500).json({ message: 'Error creating event', error: error.message });
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    const { date, location } = req.query;

    const filter = {};

    if (date) {
      const queryDate = new Date(date);
      const nextDay = new Date(queryDate);
      nextDay.setDate(nextDay.getDate() + 1);
      filter.date = { $gte: queryDate, $lt: nextDay };
    }

    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    const events = await Event.find(filter).populate('createdBy', 'username role');

    res.json({ events });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events', error: error.message });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('createdBy', 'username role');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ event });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching event', error: error.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const { title, description, date, location, maxAttendees } = req.body;

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (title !== undefined) event.title = title;
    if (description !== undefined) event.description = description;
    if (date !== undefined) event.date = date;
    if (location !== undefined) event.location = location;
    if (maxAttendees !== undefined) event.maxAttendees = maxAttendees;

    await event.save();

    res.json({ message: 'Event updated successfully', event });
  } catch (error) {
    res.status(500).json({ message: 'Error updating event', error: error.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting event', error: error.message });
  }
};
