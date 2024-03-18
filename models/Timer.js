const mongoose = require('mongoose');

const timerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  duration: { type: Number, required: true }, // duration in minutes
  type: { type: String, enum: ['pomodoro', 'break'], required: true },
  createdAt: { type: Date, default: Date.now, index: true }
});

timerSchema.index({ userId: 1, createdAt: -1 }); // Compound index for efficient querying by userId and sorting by createdAt

timerSchema.pre('save', async function(next) {
  try {
    // Additional logic before saving can be added here
    console.log(`Saving timer for userId: ${this.userId}`);
    next();
  } catch (error) {
    console.error('Error saving timer:', error.message, error.stack);
    next(error);
  }
});

const Timer = mongoose.model('Timer', timerSchema);

module.exports = Timer;