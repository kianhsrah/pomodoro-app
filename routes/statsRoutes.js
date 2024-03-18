const express = require('express');
const Timer = require('../models/Timer');
const { isAuthenticated } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/stats', isAuthenticated, async (req, res) => {
  try {
    const userId = req.session.userId;
    const stats = await Timer.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: '$type',
          averageDuration: { $avg: '$duration' },
          totalCount: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    console.log(`Statistics fetched successfully for userId: ${userId}`);
    res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching statistics:', error.message, error.stack);
    res.status(500).send('Error fetching statistics');
  }
});

module.exports = router;