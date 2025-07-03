import express from 'express';
import Task from '../models/task.js';
import verifyToken from '../middleware/authMiddleware.js';

const router = express.Router();

// ➕ Add task
router.post('/', verifyToken, async (req, res) => {
  try {
    const newTask = new Task({
      task: req.body.task,
      countdownEnd: req.body.countdownEnd,
      userId: req.user.id,
    });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    console.error("Create Task Error:", err.message);
    res.status(500).json({ message: 'Failed to create task', error: err.message });
  }
});

// 📋 Get all tasks for current user
router.get('/', verifyToken, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch tasks' });
  }
});

// ✅ Mark as complete/incomplete
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { completed: req.body.completed },
      { new: true }
    );
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update task' });
  }
});

// ❌ Delete task
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete task' });
  }
});

export default router;
