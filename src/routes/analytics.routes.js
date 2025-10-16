const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');
const analyticsController = require('../controllers/analytics.controller');

/**
 * @route   GET /api/analytics/events-per-month
 * @desc    Get events count per month for current year
 * @access  Private/Admin
 */
router.get(
  '/events-per-month',
  authMiddleware,
  roleMiddleware.checkAdmin,
  analyticsController.getEventsPerMonth
);

/**
 * @route   GET /api/analytics/top-events
 * @desc    Get top 3 events by registration count
 * @access  Private/Admin
 */
router.get(
  '/top-events',
  authMiddleware,
  roleMiddleware.checkAdmin,
  analyticsController.getTopEvents
);

module.exports = router;
