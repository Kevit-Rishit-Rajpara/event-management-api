const Registration = require('../models/registration.model');
const Event = require('../models/event.model');
const { ApiError, asyncHandler } = require('../utils/errorHandler');

/**
 * @desc    Register user for an event
 * @route   POST /api/events/:id/register
 * @access  Private
 * @param   {Object} req - Express request object
 * @param   {string} req.params.id - Event ID
 * @param   {Object} req.user - Authenticated user from middleware
 * @param   {string} req.user.id - User ID
 * @param   {Object} res - Express response object
 * @returns {Object} Success message and registration details
 * @throws  {ApiError} 404 if event not found
 * @throws  {ApiError} 400 if already registered or event is full
 */
exports.registerForEvent = asyncHandler(async (req, res) => {
  const eventId = req.params.id;
  const userId = req.user.id;

  const event = await Event.findById(eventId);
  if (!event) {
    throw new ApiError(404, 'Event not found');
  }

  const existingRegistration = await Registration.findOne({ user: userId, event: eventId });
  if (existingRegistration) {
    throw new ApiError(400, 'You are already registered for this event');
  }

  if (event.maxAttendees) {
    const registrationCount = await Registration.countDocuments({ event: eventId });
    if (registrationCount >= event.maxAttendees) {
      throw new ApiError(400, 'Event is full');
    }
  }

  const registration = new Registration({
    user: userId,
    event: eventId
  });

  await registration.save();

  res.status(201).json({
    success: true,
    message: 'Successfully registered for event',
    registration
  });
});

/**
 * @desc    Cancel user registration for an event
 * @route   DELETE /api/events/:id/register
 * @access  Private
 * @param   {Object} req - Express request object
 * @param   {string} req.params.id - Event ID
 * @param   {Object} req.user - Authenticated user from middleware
 * @param   {string} req.user.id - User ID
 * @param   {Object} res - Express response object
 * @returns {Object} Success message
 * @throws  {ApiError} 404 if registration not found
 */
exports.cancelRegistration = asyncHandler(async (req, res) => {
  const eventId = req.params.id;
  const userId = req.user.id;

  const registration = await Registration.findOneAndDelete({ user: userId, event: eventId });

  if (!registration) {
    throw new ApiError(404, 'You are not registered for this event');
  }

  res.status(200).json({
    success: true,
    message: 'Registration cancelled successfully'
  });
});
