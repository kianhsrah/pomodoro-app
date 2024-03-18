const express = require('express');
const Settings = require('../models/Settings');
const { isAuthenticated } = require('../middleware/authMiddleware');
const router = express.Router();

// Fetch user settings
router.get('/settings', isAuthenticated, async (req, res) => {
  try {
    const settings = await Settings.findOne({ userId: req.session.userId });
    if (!settings) {
      console.log(`Settings not found for userId: ${req.session.userId}`);
      return res.status(404).send('Settings not found.');
    }
    console.log(`Settings fetched successfully for userId: ${req.session.userId}`);
    res.status(200).json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).send('Error fetching settings');
  }
});

// Update user settings
router.put('/settings', isAuthenticated, async (req, res) => {
  try {
    const { pomodoroDuration, breakDuration, notificationPreferences } = req.body;
    let settings = await Settings.findOneAndUpdate({ userId: req.session.userId }, {
      pomodoroDuration,
      breakDuration,
      notificationPreferences
    }, { new: true, upsert: true });
    if (!settings) {
      console.log(`Creating new settings for userId: ${req.session.userId}`);
    } else {
      console.log(`Settings updated successfully for userId: ${req.session.userId}`);
    }
    res.status(200).json(settings);
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).send('Error updating settings');
  }
});

module.exports = router;