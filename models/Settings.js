const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
  pomodoroDuration: { type: Number, default: 25 },
  breakDuration: { type: Number, default: 5 },
  notificationPreferences: {
    sound: { type: Boolean, default: true },
    visual: { type: Boolean, default: true }
  }
});

settingsSchema.pre('save', function(next) {
  console.log(`Saving settings for userId: ${this.userId}`);
  next();
});

settingsSchema.post('save', function(doc, next) {
  console.log(`Settings saved for userId: ${doc.userId}`);
  next();
});

const Settings = mongoose.model('Settings', settingsSchema);

module.exports = Settings;