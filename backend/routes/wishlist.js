const express = require('express');
const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
router.get('/', protect, async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user.id })
      .populate({
        path: 'products.product',
        select: 'title price images category brand stock ratings'
      });

    if (!wishlist) {
      // Create empty wishlist if it doesn't exist
      wishlist = await Wishlist.create({ user: req.user.id });
    }

    res.status(200).json({
      success: true,
      count: wishlist.products.length,
      data: wishlist.products
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Add product to wishlist
// @route   POST /api/wishlist/:productId
// @access  Private
router.post('/:productId', protect, async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    let wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user.id });
    }

    const added = wishlist.addProduct(req.params.productId);

    if (!added) {
      return res.status(400).json({
        success: false,
        message: 'Product already in wishlist'
      });
    }

    await wishlist.save();

    res.status(200).json({
      success: true,
      message: 'Product added to wishlist successfully'
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
router.delete('/:productId', protect, async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found'
      });
    }

    const removed = wishlist.removeProduct(req.params.productId);

    if (!removed) {
      return res.status(404).json({
        success: false,
        message: 'Product not found in wishlist'
      });
    }

    await wishlist.save();

    res.status(200).json({
      success: true,
      message: 'Product removed from wishlist successfully'
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Clear wishlist
// @route   DELETE /api/wishlist
// @access  Private
router.delete('/', protect, async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found'
      });
    }

    wishlist.products = [];
    await wishlist.save();

    res.status(200).json({
      success: true,
      message: 'Wishlist cleared successfully'
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Check if product is in wishlist
// @route   GET /api/wishlist/check/:productId
// @access  Private
router.get('/check/:productId', protect, async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
      return res.status(200).json({
        success: true,
        inWishlist: false
      });
    }

    const inWishlist = wishlist.hasProduct(req.params.productId);

    res.status(200).json({
      success: true,
      inWishlist
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get wishlist count
// @route   GET /api/wishlist/count
// @access  Private
router.get('/count', protect, async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id });

    const count = wishlist ? wishlist.products.length : 0;

    res.status(200).json({
      success: true,
      count
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
