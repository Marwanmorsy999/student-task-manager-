const express = require('express');
const { body } = require('express-validator');
const { register, login, getMe, updatePassword, deleteAccount } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Enter a valid email'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
      .matches(/\d/)
      .withMessage('Password must contain at least one digit')
      .matches(/[a-z]/)
      .withMessage('Password must contain at least one lowercase letter')
      .matches(/[A-Z]/)
      .withMessage('Password must contain at least one uppercase letter')
      .matches(/[!@#$%^&*]/)
      .withMessage('Password must contain at least one special character (!@#$%^&*)'),
  ],
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Enter a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  login
);

router.get('/me', protect, getMe);

router.put(
  '/password',
  protect,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 8 })
      .withMessage('New password must be at least 8 characters')
      .matches(/\d/)
      .withMessage('New password must contain at least one digit')
      .matches(/[a-z]/)
      .withMessage('New password must contain at least one lowercase letter')
      .matches(/[A-Z]/)
      .withMessage('New password must contain at least one uppercase letter')
      .matches(/[!@#$%^&*]/)
      .withMessage('New password must contain at least one special character (!@#$%^&*)'),
  ],
  updatePassword
);

router.delete('/account', protect, deleteAccount);

module.exports = router;
