const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');
const eventController = require('../controllers/event.controller');
const registrationController = require('../controllers/registration.controller');

/**
 * @route   POST /api/events
 * @desc    Create a new event
 * @access  Private/Admin
 */
router.post('/', authMiddleware, roleMiddleware.checkAdmin, eventController.createEvent);

/**
 * @route   GET /api/events
 * @desc    Get all events with optional filtering
 * @access  Private
 */
router.get('/', authMiddleware, eventController.getAllEvents);

/**
 * @route   GET /api/events/:id
 * @desc    Get event by ID
 * @access  Private
 */
router.get('/:id', authMiddleware, eventController.getEventById);

/**
 * @route   PUT /api/events/:id
 * @desc    Update an event
 * @access  Private/Admin
 */
router.put('/:id', authMiddleware, roleMiddleware.checkAdmin, eventController.updateEvent);

/**
 * @route   DELETE /api/events/:id
 * @desc    Delete an event
 * @access  Private/Admin
 */
router.delete('/:id', authMiddleware, roleMiddleware.checkAdmin, eventController.deleteEvent);

/**
 * @route   POST /api/events/:id/register
 * @desc    Register for an event
 * @access  Private
 */
router.post('/:id/register', authMiddleware, registrationController.registerForEvent);

/**
 * @route   DELETE /api/events/:id/register
 * @desc    Cancel event registration
 * @access  Private
 */
router.delete('/:id/register', authMiddleware, registrationController.cancelRegistration);

module.exports = router;
