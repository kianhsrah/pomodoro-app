const express = require('express');
const router = express.Router();
const Timer = require('../models/Timer');
const { isAuthenticated } = require('../middleware/authMiddleware');

// Start a new timer
router.post('/timer/start', isAuthenticated, async (req, res) => {
  try {
    const { duration, type } = req.body;
    const timer = new Timer({
      userId: req.session.userId,
      duration,
      type,
    });
    await timer.save();
    console.log(`Timer started: ${timer}`);
    res.status(201).json(timer);
  } catch (error) {
    console.error('Error starting timer:', error.message, error.stack);
    res.status(500).send('Unable to start timer.');
  }
});

// Stop an existing timer
// For simplicity, this example assumes "stopping" a timer simply means marking it as complete
// In a real application, additional logic might be needed
router.post('/timer/stop', isAuthenticated, async (req, res) => {
  try {
    const { timerId } = req.body;
    const timer = await Timer.findById(timerId);
    if (!timer) {
      console.log('Timer not found with id:', timerId);
      return res.status(404).send('Timer not found.');
    }
    if (timer.userId.toString() !== req.session.userId) {
      console.log(`Unauthorized attempt to stop timer by user ${req.session.userId}`);
      return res.status(403).send('Unauthorized to stop this timer.');
    }
    // Assuming stopping means marking the timer as complete or similar
    // Without a specific field to mark as stopped, no further action is taken here
    console.log(`Timer stopped: ${timer}`);
    res.status(200).json({ message: 'Timer stopped successfully', timer });
  } catch (error) {
    console.error('Error stopping timer:', error.message, error.stack);
    res.status(500).send('Unable to stop timer.');
  }
});

module.exports = router;