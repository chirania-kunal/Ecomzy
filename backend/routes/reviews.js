const express = require('express');
const { body, validationResult } = require('express-validator');
const Product = require('../models/Product');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
router.get('/product/:productId', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId)
      .populate('reviews.user', 'name avatar')
      .select('reviews');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      count: product.reviews.length,
      data: product.reviews
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get user's reviews
// @route   GET /api/reviews/my-reviews
// @access  Private
router.get('/my-reviews', protect, async (req, res, next) => {
  try {
    const products = await Product.find({
      'reviews.user': req.user.id
    }).select('title reviews');

    const userReviews = [];
    products.forEach(product => {
      const reviews = product.reviews.filter(
        review => review.user.toString() === req.user.id
      );
      reviews.forEach(review => {
        userReviews.push({
          ...review.toObject(),
          productTitle: product.title,
          productId: product._id
        });
      });
    });

    res.status(200).json({
      success: true,
      count: userReviews.length,
      data: userReviews
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update review
// @route   PUT /api/reviews/:productId
// @access  Private
router.put('/:productId', protect, [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('comment')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Comment must be between 10 and 500 characters')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const reviewIndex = product.reviews.findIndex(
      review => review.user.toString() === req.user.id
    );

    if (reviewIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Update review
    product.reviews[reviewIndex].rating = req.body.rating;
    product.reviews[reviewIndex].comment = req.body.comment;

    await product.save();

    res.status(200).json({
      success: true,
      message: 'Review updated successfully'
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Delete review
// @route   DELETE /api/reviews/:productId
// @access  Private
router.delete('/:productId', protect, async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const reviewIndex = product.reviews.findIndex(
      review => review.user.toString() === req.user.id
    );

    if (reviewIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Remove review
    product.reviews.splice(reviewIndex, 1);
    product.numOfReviews = product.reviews.length;

    await product.save();

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get all reviews (Admin)
// @route   GET /api/reviews
// @access  Private (Admin only)
router.get('/', protect, authorize('admin'), async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    let query = Product.find({
      'reviews.0': { $exists: true }
    }).populate('reviews.user', 'name email');

    // Filter by rating
    if (req.query.rating) {
      query = query.find({
        'reviews.rating': parseInt(req.query.rating)
      });
    }

    // Sort
    query = query.sort({ 'reviews.createdAt': -1 });

    // Pagination
    query = query.skip(startIndex).limit(limit);

    const products = await query;
    const allReviews = [];

    products.forEach(product => {
      product.reviews.forEach(review => {
        allReviews.push({
          ...review.toObject(),
          productTitle: product.title,
          productId: product._id
        });
      });
    });

    res.status(200).json({
      success: true,
      count: allReviews.length,
      data: allReviews
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Delete review (Admin)
// @route   DELETE /api/reviews/:productId/:reviewId
// @access  Private (Admin only)
router.delete('/:productId/:reviewId', protect, authorize('admin'), async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const reviewIndex = product.reviews.findIndex(
      review => review._id.toString() === req.params.reviewId
    );

    if (reviewIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Remove review
    product.reviews.splice(reviewIndex, 1);
    product.numOfReviews = product.reviews.length;

    await product.save();

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
