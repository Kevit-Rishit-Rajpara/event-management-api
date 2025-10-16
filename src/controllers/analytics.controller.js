const Event = require('../models/event.model');
const Registration = require('../models/registration.model');

exports.getEventsPerMonth = async (req, res) => {
  try {
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

    res.json({ eventsPerMonth });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching analytics', error: error.message });
  }
};

exports.getTopEvents = async (req, res) => {
  try {
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

    res.json({ topEvents });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching top events', error: error.message });
  }
};
