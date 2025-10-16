const Event = require('../models/event.model');
const Registration = require('../models/registration.model');
const { asyncHandler } = require('../utils/errorHandler');

/**
 * @desc    Get number of events per month for current year
 * @route   GET /api/analytics/events-per-month
 * @access  Private/Admin
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 * @returns {Object} Array of events count grouped by month
 */
exports.getEventsPerMonth = asyncHandler(async (req, res) => {
  const currentYear = new Date().getFullYear();
  const startDate = new Date(currentYear, 0, 1);
  const endDate = new Date(currentYear, 11, 31, 23, 59, 59);

  const eventsPerMonth = await Event.aggregate([
    {
      $match: {
        date: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: { $month: '$date' },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { _id: 1 }
    },
    {
      $project: {
        _id: 0,
        month: '$_id',
        count: 1
      }
    }
  ]);

  res.status(200).json({
    success: true,
    year: currentYear,
    eventsPerMonth
  });
});

/**
 * @desc    Get top 3 events by registration count
 * @route   GET /api/analytics/top-events
 * @access  Private/Admin
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 * @returns {Object} Array of top 3 events with registration counts
 */
exports.getTopEvents = asyncHandler(async (req, res) => {
  const topEvents = await Event.aggregate([
    {
      $lookup: {
        from: 'registrations',
        localField: '_id',
        foreignField: 'event',
        as: 'registrations'
      }
    },
    {
      $addFields: {
        registrationCount: { $size: '$registrations' }
      }
    },
    {
      $sort: { registrationCount: -1 }
    },
    {
      $limit: 3
    },
    {
      $project: {
        title: 1,
        description: 1,
        date: 1,
        location: 1,
        registrationCount: 1
      }
    }
  ]);

  res.status(200).json({
    success: true,
    count: topEvents.length,
    topEvents
  });
});
