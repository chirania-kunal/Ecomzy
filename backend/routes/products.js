const express = require('express');
const { body, validationResult } = require('express-validator');
const {getAllProducts,getFeaturedProduct,getProductById,getProductCategories,createProduct,updateProductById,deleteProductById,addProductReview}=require('../controllers/Product')
const { protect, authorize, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all products with filtering, searching, and pagination
// @route   GET /api/products
// @access  Public
router.get('/', optionalAuth, getAllProducts);

// @desc    Get product categories
// @route   GET /api/products/categories
// @access  Public
router.get('/categories',getProductCategories);

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
router.get('/featured', getFeaturedProduct);

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', optionalAuth, getProductById);

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Admin only)
router.post('/', protect, authorize('admin'), [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('category')
    .isIn([
      "men's clothing",
      "women's clothing",
      "electronics",
      "jewelery",
      "books",
      "sports",
      "home",
      "beauty",
      "toys",
      "automotive"
    ])
    .withMessage('Invalid category'),
  body('stock')
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer')
], createProduct);

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Admin only)
router.put('/:id', protect, authorize('admin'),updateProductById);

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Admin only)
router.delete('/:id', protect, authorize('admin'), deleteProductById);

// @desc    Add product review
// @route   POST /api/products/:id/reviews
// @access  Private
router.post('/:id/reviews', protect, [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('comment')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Comment must be between 10 and 500 characters')
], addProductReview);

module.exports = router;
