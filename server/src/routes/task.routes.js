const express = require('express');
const { body } = require('express-validator');
const {
  getTasks,
  getStats,
  createTask,
  updateTask,
  deleteTask,
  startTimer,
  stopTimer,
  getTimeStats,
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All task routes require auth
router.use(protect);

router.get('/stats', getStats);
router.get('/time-stats', getTimeStats);

router
  .route('/')
  .get(getTasks)
  .post(
    [
      body('title').trim().notEmpty().withMessage('Title is required'),
      body('dueDate').isISO8601().withMessage('Valid due date is required'),
      body('priority')
        .isIn(['low', 'medium', 'high'])
        .withMessage('Priority must be low, medium, or high'),
    ],
    createTask
  );

router.route('/:id').put(updateTask).delete(deleteTask);
router.post('/:id/start-timer', startTimer);
router.post('/:id/stop-timer', stopTimer);

module.exports = router;
