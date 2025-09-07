const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');

exports.createPaymentIntent=async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Make sure user owns order
    if (order.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to pay for this order'
      });
    }

    if (order.isPaid) {
      return res.status(400).json({
        success: false,
        message: 'Order is already paid'
      });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalPrice * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        orderId: order._id.toString(),
        userId: req.user.id
      }
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    next(error);
  }
}

exports.confirmPayment=async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { orderId, paymentIntentId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Make sure user owns order
    if (order.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to confirm payment for this order'
      });
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      // Update order as paid
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: paymentIntent.id,
        status: paymentIntent.status,
        update_time: new Date().toISOString(),
        email_address: req.user.email
      };

      await order.save();

      res.status(200).json({
        success: true,
        message: 'Payment confirmed successfully',
        data: order
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment not completed'
      });
    }
  } catch (error) {
    next(error);
  }
}

exports.getPaymentMethods=async (req, res, next) => {
  try {
    // In a real application, you might store payment methods for users
    // For now, we'll return available payment methods
    const paymentMethods = [
      {
        id: 'stripe',
        name: 'Credit/Debit Card',
        description: 'Pay with Visa, Mastercard, American Express',
        icon: '💳'
      },
      {
        id: 'paypal',
        name: 'PayPal',
        description: 'Pay with your PayPal account',
        icon: '🅿️'
      },
      {
        id: 'cod',
        name: 'Cash on Delivery',
        description: 'Pay when you receive your order',
        icon: '💰'
      }
    ];

    res.status(200).json({
      success: true,
      data: paymentMethods
    });
  } catch (error) {
    next(error);
  }
}

exports.paymentRefund=async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { orderId, amount } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (!order.isPaid) {
      return res.status(400).json({
        success: false,
        message: 'Order is not paid'
      });
    }

    if (order.paymentMethod !== 'stripe') {
      return res.status(400).json({
        success: false,
        message: 'Refunds are only available for Stripe payments'
      });
    }

    const refundAmount = amount || order.totalPrice;

    // Process refund through Stripe
    const refund = await stripe.refunds.create({
      payment_intent: order.paymentResult.id,
      amount: Math.round(refundAmount * 100) // Convert to cents
    });

    // Update order status
    order.status = 'refunded';
    order.refundStatus = 'approved';

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Refund processed successfully',
      data: {
        refundId: refund.id,
        amount: refundAmount,
        order: order
      }
    });
  } catch (error) {
    next(error);
  }
}

exports.paymentsWebhook=async (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: `Webhook Error: ${err.message}`
    });
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('Payment succeeded:', paymentIntent.id);
      
      // Update order status if needed
      if (paymentIntent.metadata.orderId) {
        try {
          const order = await Order.findById(paymentIntent.metadata.orderId);
          if (order && !order.isPaid) {
            order.isPaid = true;
            order.paidAt = Date.now();
            order.paymentResult = {
              id: paymentIntent.id,
              status: paymentIntent.status,
              update_time: new Date().toISOString(),
              email_address: paymentIntent.receipt_email
            };
            await order.save();
          }
        } catch (error) {
          console.error('Error updating order:', error);
        }
      }
      break;
      
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('Payment failed:', failedPayment.id);
      break;
      
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.status(200).json({ received: true });
}