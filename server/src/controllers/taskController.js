const { validationResult } = require('express-validator');
const Task = require('../models/Task');

// @desc  Get all tasks for the logged-in user
// @route GET /api/tasks
// @access Private
const getTasks = async (req, res, next) => {
  try {
    const { status, priority, category, search, sort = '-createdAt' } = req.query;

    const filter = { user: req.user._id };
    if (status && status !== 'all') filter.status = status;
    if (priority && priority !== 'all') filter.priority = priority;
    if (category && category !== 'all') filter.category = category;
    if (search) filter.title = { $regex: search, $options: 'i' };

    const tasks = await Task.find(filter).sort(sort);
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

// @desc  Get dashboard stats for the logged-in user
// @route GET /api/tasks/stats
// @access Private
const getStats = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const [total, done, inProgress, highPriority, overdue] = await Promise.all([
      Task.countDocuments({ user: userId }),
      Task.countDocuments({ user: userId, status: 'done' }),
      Task.countDocuments({ user: userId, status: 'in-progress' }),
      Task.countDocuments({ user: userId, priority: 'high', status: { $ne: 'done' } }),
      Task.countDocuments({ user: userId, dueDate: { $lt: new Date() }, status: { $ne: 'done' } }),
    ]);

    res.json({
      total,
      done,
      inProgress,
      pending: total - done - inProgress,
      highPriority,
      overdue,
      completionRate: total ? Math.round((done / total) * 100) : 0,
    });
  } catch (err) {
    next(err);
  }
};

// @desc  Create a new task
// @route POST /api/tasks
// @access Private
const createTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { title, description, priority, dueDate, category } = req.body;

    const task = await Task.create({
      user: req.user._id,
      title,
      description,
      priority,
      dueDate,
      category,
    });

    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

// @desc  Update a task
// @route PUT /api/tasks/:id
// @access Private
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const { title, description, priority, status, dueDate, category } = req.body;
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (priority !== undefined) task.priority = priority;
    if (status !== undefined) task.status = status;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (category !== undefined) task.category = category;

    await task.save();
    res.json(task);
  } catch (err) {
    next(err);
  }
};

// @desc  Start timer for a task
// @route POST /api/tasks/:id/start-timer
// @access Private
const startTimer = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.isTimerRunning) {
      return res.status(400).json({ message: 'Timer is already running' });
    }

    task.isTimerRunning = true;
    task.timerStartedAt = new Date();
    await task.save();

    res.json({ message: 'Timer started', task });
  } catch (err) {
    next(err);
  }
};

// @desc  Stop timer for a task
// @route POST /api/tasks/:id/stop-timer
// @access Private
const stopTimer = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (!task.isTimerRunning || !task.timerStartedAt) {
      return res.status(400).json({ message: 'Timer is not running' });
    }

    const endTime = new Date();
    const duration = Math.floor((endTime - task.timerStartedAt) / 1000); // Duration in seconds

    task.timeEntries.push({
      startTime: task.timerStartedAt,
      endTime,
      duration,
    });

    task.timeSpent += duration;
    task.isTimerRunning = false;
    task.timerStartedAt = null;

    await task.save();

    res.json({ message: 'Timer stopped', task, duration });
  } catch (err) {
    next(err);
  }
};

// @desc  Delete a task
// @route DELETE /api/tasks/:id
// @access Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted' });
  } catch (err) {
    next(err);
  }
};

// @desc  Get time tracking statistics
// @route GET /api/tasks/time-stats
// @access Private
const getTimeStats = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { period = 'week' } = req.query; // week, month, all

    let dateFilter = {};
    if (period === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      dateFilter = { 'timeEntries.startTime': { $gte: weekAgo } };
    } else if (period === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      dateFilter = { 'timeEntries.startTime': { $gte: monthAgo } };
    }

    const tasks = await Task.find({
      user: userId,
      timeSpent: { $gt: 0 },
      ...dateFilter,
    }).select('title timeSpent timeEntries category priority');

    const totalTime = tasks.reduce((sum, task) => sum + task.timeSpent, 0);
    const averageSession = tasks.length > 0 ?
      tasks.reduce((sum, task) => sum + (task.timeEntries.length > 0 ?
        task.timeEntries.reduce((s, e) => s + e.duration, 0) / task.timeEntries.length : 0), 0) / tasks.length : 0;

    const categoryStats = {};
    tasks.forEach((task) => {
      if (!categoryStats[task.category]) {
        categoryStats[task.category] = { time: 0, tasks: 0 };
      }
      categoryStats[task.category].time += task.timeSpent;
      categoryStats[task.category].tasks += 1;
    });

    res.json({
      totalTime,
      totalTasks: tasks.length,
      averageSession: Math.round(averageSession),
      categoryStats,
      period,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getTasks, getStats, createTask, updateTask, deleteTask, startTimer, stopTimer, getTimeStats };
