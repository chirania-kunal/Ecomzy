const express = require('express');
const { body, validationResult } = require('express-validator');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/auth'); // Added missing import
const router = express.Router();

const {createPaymentIntent,confirmPayment,getPaymentMethods,paymentRefund,paymentsWebhook}=require('../controllers/Payment')

// @desc    Create payment intent
// @route   POST /api/payments/create-payment-intent
// @access  Private
router.post('/create-payment-intent', protect, [
  body('orderId')
    .isMongoId()
    .withMessage('Valid order ID is required')
], createPaymentIntent);

// @desc    Confirm payment
// @route   POST /api/payments/confirm
// @access  Private
router.post('/confirm', protect, [
  body('orderId')
    .isMongoId()
    .withMessage('Valid order ID is required'),
  body('paymentIntentId')
    .notEmpty()
    .withMessage('Payment intent ID is required')
], confirmPayment);

// @desc    Get payment methods
// @route   GET /api/payments/methods
// @access  Private
router.get('/methods', protect, getPaymentMethods);

// @desc    Process refund
// @route   POST /api/payments/refund
// @access  Private (Admin only)
router.post('/refund', protect, authorize('admin'), [
  body('orderId')
    .isMongoId()
    .withMessage('Valid order ID is required'),
  body('amount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Refund amount must be positive')
], paymentRefund);

// @desc    Webhook for Stripe events
// @route   POST /api/payments/webhook
// @access  Public
router.post('/webhook', express.raw({ type: 'application/json' }), paymentsWebhook);

module.exports = router;
