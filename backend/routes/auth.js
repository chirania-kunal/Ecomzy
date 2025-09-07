const express = require('express');
const { body, validationResult } = require('express-validator');
const { protect } = require('../middleware/auth');
const {register,login,updateDetails,updatePassword,logout,getMe} = require('../controllers/Auth')

const router = express.Router();

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
],register);

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
], login);

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, getMe);

// @desc    Update user details
// @route   PUT /api/auth/updatedetails
// @access  Private
router.put('/updatedetails', protect, [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email')
], updateDetails);

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
router.put('/updatepassword', protect, [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
], updatePassword);

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
router.post('/logout', protect,logout);

module.exports = router;
