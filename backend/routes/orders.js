const express = require('express');
const { body, validationResult } = require('express-validator');

const { protect, authorize } = require('../middleware/auth');

const {createOrder,getMyOrders,getAllOrders,getOrderById,updateOrderById,OrderByIdDelivered,updateOrderStatus}= require('../controllers/Order')

const router = express.Router();

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
router.post('/', protect, [
  body('orderItems')
    .isArray({ min: 1 })
    .withMessage('Order must contain at least one item'),
  body('orderItems.*.product')
    .isMongoId()
    .withMessage('Invalid product ID'),
  body('orderItems.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  body('shippingAddress.address')
    .trim()
    .notEmpty()
    .withMessage('Shipping address is required'),
  body('shippingAddress.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  body('shippingAddress.postalCode')
    .trim()
    .notEmpty()
    .withMessage('Postal code is required'),
  body('shippingAddress.country')
    .trim()
    .notEmpty()
    .withMessage('Country is required'),
  body('shippingAddress.phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required'),
  body('paymentMethod')
    .isIn(['stripe', 'paypal', 'cod'])
    .withMessage('Invalid payment method')
], createOrder);

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
router.get('/myorders', protect, getMyOrders);

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
router.get('/:id', protect,getOrderById);

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
router.put('/:id/pay', protect, [
  body('id')
    .notEmpty()
    .withMessage('Payment ID is required'),
  body('status')
    .notEmpty()
    .withMessage('Payment status is required'),
  body('update_time')
    .notEmpty()
    .withMessage('Payment update time is required'),
  body('email_address')
    .isEmail()
    .withMessage('Valid email is required')
],updateOrderById);

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private (Admin only)
router.put('/:id/deliver', protect, authorize('admin'), OrderByIdDelivered);

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Admin only)
router.put('/:id/status', protect, authorize('admin'), [
  body('status')
    .isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'])
    .withMessage('Invalid status')
], updateOrderStatus);

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private (Admin only)
router.get('/', protect, authorize('admin'), getAllOrders);

// @desc    Request refund
// @route   POST /api/orders/:id/refund
// @access  Private
router.post('/:id/refund', protect, [
  body('reason')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Refund reason must be between 10 and 500 characters')
], requestRefund);

module.exports = router;
