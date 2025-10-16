const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');
const eventController = require('../controllers/event.controller');
const registrationController = require('../controllers/registration.controller');

router.post('/', authMiddleware, roleMiddleware.checkAdmin, eventController.createEvent);
router.put('/:id', authMiddleware, roleMiddleware.checkAdmin, eventController.updateEvent);
router.delete('/:id', authMiddleware, roleMiddleware.checkAdmin, eventController.deleteEvent);

router.get('/', authMiddleware, eventController.getAllEvents);
router.get('/:id', authMiddleware, eventController.getEventById);

router.post('/:id/register', authMiddleware, registrationController.registerForEvent);
router.delete('/:id/register', authMiddleware, registrationController.cancelRegistration);

module.exports = router;
