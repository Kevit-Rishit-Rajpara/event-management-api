const Event = require('../models/event.model');
const { ApiError, asyncHandler } = require('../utils/errorHandler');

/**
 * @desc    Create a new event
 * @route   POST /api/events
 * @access  Private/Admin
 * @param   {Object} req - Express request object
 * @param   {Object} req.body - Request body
 * @param   {string} req.body.title - Event title (required)
 * @param   {string} req.body.description - Event description (optional)
 * @param   {Date} req.body.date - Event date (required)
 * @param   {string} req.body.location - Event location (optional)
 * @param   {number} req.body.maxAttendees - Maximum number of attendees (optional)
 * @param   {Object} req.user - Authenticated user from middleware
 * @param   {Object} res - Express response object
 * @returns {Object} Success message and created event
 */
exports.createEvent = asyncHandler(async (req, res) => {
  const { title, description, date, location, maxAttendees } = req.body;

  if (!title || !date) {
    throw new ApiError(400, 'Title and date are required');
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

  res.status(201).json({
    success: true,
    message: 'Event created successfully',
    event
  });
});

/**
 * @desc    Get all events with optional filtering
 * @route   GET /api/events
 * @access  Private
 * @param   {Object} req - Express request object
 * @param   {Object} req.query - Query parameters
 * @param   {string} req.query.date - Filter by date (YYYY-MM-DD)
 * @param   {string} req.query.location - Filter by location (case-insensitive)
 * @param   {Object} res - Express response object
 * @returns {Object} Array of events
 */
exports.getAllEvents = asyncHandler(async (req, res) => {
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

  res.status(200).json({
    success: true,
    count: events.length,
    events
  });
});

/**
 * @desc    Get a single event by ID
 * @route   GET /api/events/:id
 * @access  Private
 * @param   {Object} req - Express request object
 * @param   {string} req.params.id - Event ID
 * @param   {Object} res - Express response object
 * @returns {Object} Event details
 */
exports.getEventById = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id).populate('createdBy', 'username role');

  if (!event) {
    throw new ApiError(404, 'Event not found');
  }

  res.status(200).json({
    success: true,
    event
  });
});

/**
 * @desc    Update an event
 * @route   PUT /api/events/:id
 * @access  Private/Admin
 * @param   {Object} req - Express request object
 * @param   {string} req.params.id - Event ID
 * @param   {Object} req.body - Fields to update
 * @param   {Object} res - Express response object
 * @returns {Object} Success message and updated event
 */
exports.updateEvent = asyncHandler(async (req, res) => {
  const { title, description, date, location, maxAttendees } = req.body;

  const event = await Event.findById(req.params.id);

  if (!event) {
    throw new ApiError(404, 'Event not found');
  }

  if (title !== undefined) event.title = title;
  if (description !== undefined) event.description = description;
  if (date !== undefined) event.date = date;
  if (location !== undefined) event.location = location;
  if (maxAttendees !== undefined) event.maxAttendees = maxAttendees;

  await event.save();

  res.status(200).json({
    success: true,
    message: 'Event updated successfully',
    event
  });
});

/**
 * @desc    Delete an event
 * @route   DELETE /api/events/:id
 * @access  Private/Admin
 * @param   {Object} req - Express request object
 * @param   {string} req.params.id - Event ID
 * @param   {Object} res - Express response object
 * @returns {Object} Success message
 */
exports.deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findByIdAndDelete(req.params.id);

  if (!event) {
    throw new ApiError(404, 'Event not found');
  }

  res.status(200).json({
    success: true,
    message: 'Event deleted successfully'
  });
});
