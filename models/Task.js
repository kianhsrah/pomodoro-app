const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  description: { type: String, required: true },
  isCompleted: { type: Boolean, default: false },
  assignedPomodoroSessions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Timer' }]
});

taskSchema.index({ userId: 1 }); // Index for efficient querying by userId

taskSchema.pre('save', function(next) {
  console.log(`Saving task: ${this.description}`);
  next();
});

taskSchema.post('save', function(doc, next) {
  console.log(`Task saved: ${doc._id}`);
  next();
});

taskSchema.post('remove', function(doc, next) {
  console.log(`Task removed: ${doc._id}`);
  next();
});

taskSchema.post('update', function(doc, next) {
  console.log(`Task updated: ${doc._id}`);
  next();
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;