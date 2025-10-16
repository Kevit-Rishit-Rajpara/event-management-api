const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');
const analyticsController = require('../controllers/analytics.controller');

router.get('/events-per-month', authMiddleware, roleMiddleware.checkAdmin, analyticsController.getEventsPerMonth);
router.get('/top-events', authMiddleware, roleMiddleware.checkAdmin, analyticsController.getTopEvents);

module.exports = router;
