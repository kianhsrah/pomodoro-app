const express = require('express');
const Task = require('../models/Task');
const { isAuthenticated } = require('../middleware/authMiddleware');
const router = express.Router();

// Create a new task
router.post('/tasks', isAuthenticated, async (req, res) => {
  try {
    const { description, assignedPomodoroSessions } = req.body;
    const task = new Task({
      userId: req.session.userId,
      description,
      assignedPomodoroSessions,
    });
    await task.save();
    console.log(`Task created successfully: ${task.id}`);
    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error.message, error.stack);
    res.status(500).send(error.message);
  }
});

// Update an existing task
router.put('/tasks/:id', isAuthenticated, async (req, res) => {
  try {
    const updates = req.body;
    const task = await Task.findOneAndUpdate({ _id: req.params.id, userId: req.session.userId }, updates, { new: true });
    if (!task) {
      console.log('Task not found or user not authorized to update task with id:', req.params.id);
      return res.status(404).send('Task not found or user not authorized to update.');
    }
    console.log(`Task updated successfully: ${task.id}`);
    res.status(200).json(task);
  } catch (error) {
    console.error('Error updating task:', error.message, error.stack);
    res.status(500).send(error.message);
  }
});

// Delete a task
router.delete('/tasks/:id', isAuthenticated, async (req, res) => {
  try {
    const result = await Task.deleteOne({ _id: req.params.id, userId: req.session.userId });
    if (result.deletedCount === 0) {
      console.log('Task not found or user not authorized to delete task with id:', req.params.id);
      return res.status(404).send('Task not found or user not authorized to delete.');
    }
    console.log(`Task deleted successfully: ${req.params.id}`);
    res.status(200).send('Task deleted successfully.');
  } catch (error) {
    console.error('Error deleting task:', error.message, error.stack);
    res.status(500).send(error.message);
  }
});

// Fetch all tasks for a user
router.get('/tasks', isAuthenticated, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.session.userId }).populate('assignedPomodoroSessions');
    console.log(`Fetched tasks for userId: ${req.session.userId}`);
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error.message, error.stack);
    res.status(500).send(error.message);
  }
});

module.exports = router;