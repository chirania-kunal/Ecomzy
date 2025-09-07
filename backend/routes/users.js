const express = require('express');
const { body, validationResult } = require('express-validator');

const { protect, authorize } = require('../middleware/auth');
const {getProfile,updateProfile} = require('../controllers/User')

const router = express.Router();

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', protect,getProfile);

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', protect, [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('phone')
    .optional()
    .trim()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  body('address.street')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Street address cannot be empty'),
  body('address.city')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('City cannot be empty'),
  body('address.state')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('State cannot be empty'),
  body('address.zipCode')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Zip code cannot be empty'),
  body('address.country')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Country cannot be empty')
], updateProfile);

// @desc    Upload user avatar
// @route   POST /api/users/avatar
// @access  Private
router.post('/avatar', protect, async (req, res, next) => {
  try {
    // In a real application, you would handle file upload here
    // For now, we'll just update the avatar URL
    const { avatarUrl } = req.body;

    if (!avatarUrl) {
      return res.status(400).json({
        success: false,
        message: 'Avatar URL is required'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { 
        avatar: {
          public_id: 'avatar_' + req.user.id,
          url: avatarUrl
        }
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get all users (Admin)
// @route   GET /api/users
// @access  Private (Admin only)
router.get('/', protect, authorize('admin'), async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    let query = User.find().select('-password');

    // Filter by role
    if (req.query.role) {
      query = query.find({ role: req.query.role });
    }

    // Filter by active status
    if (req.query.isActive !== undefined) {
      query = query.find({ isActive: req.query.isActive === 'true' });
    }

    // Search by name or email
    if (req.query.search) {
      query = query.find({
        $or: [
          { name: { $regex: req.query.search, $options: 'i' } },
          { email: { $regex: req.query.search, $options: 'i' } }
        ]
      });
    }

    // Sort
    query = query.sort({ createdAt: -1 });

    // Pagination
    query = query.skip(startIndex).limit(limit);

    const users = await query;
    const total = await User.countDocuments();

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit)
      },
      data: users
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get user by ID (Admin)
// @route   GET /api/users/:id
// @access  Private (Admin only)
router.get('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update user (Admin)
// @route   PUT /api/users/:id
// @access  Private (Admin only)
router.put('/:id', protect, authorize('admin'), [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Role must be either user or admin'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
      isActive: req.body.isActive
    };

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(key => 
      fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      fieldsToUpdate,
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Delete user (Admin)
// @route   DELETE /api/users/:id
// @access  Private (Admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    await user.remove();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get user statistics (Admin)
// @route   GET /api/users/stats
// @access  Private (Admin only)
router.get('/stats', protect, authorize('admin'), async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const newUsersThisMonth = await User.countDocuments({
      createdAt: {
        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      }
    });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        adminUsers,
        newUsersThisMonth
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
