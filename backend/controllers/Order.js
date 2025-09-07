const Order = require('../models/Order');
const Product = require('../models/Product');

exports.createOrder =async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { orderItems, shippingAddress, paymentMethod } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No order items'
      });
    }

    // Calculate prices and verify stock
    let totalPrice = 0;
    const orderItemsWithDetails = [];

    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.product}`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.title}`
        });
      }

      // Calculate item price (considering discounts)
      const itemPrice = product.discount > 0 
        ? product.price - (product.price * product.discount / 100)
        : product.price;

      const totalItemPrice = itemPrice * item.quantity;
      totalPrice += totalItemPrice;

      orderItemsWithDetails.push({
        name: product.title,
        quantity: item.quantity,
        image: product.images[0]?.url || product.image,
        price: itemPrice,
        product: item.product
      });

      // Update stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Calculate tax and shipping
    const taxPrice = totalPrice * 0.1; // 10% tax
    const shippingPrice = totalPrice > 100 ? 0 : 10; // Free shipping over $100
    const finalTotalPrice = totalPrice + taxPrice + shippingPrice;

    const order = await Order.create({
      user: req.user.id,
      orderItems: orderItemsWithDetails,
      shippingAddress,
      paymentMethod,
      taxPrice,
      shippingPrice,
      totalPrice: finalTotalPrice
    });

    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
}

exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('orderItems.product', 'title images')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
}

exports.getOrderById= async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('orderItems.product', 'title images');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Make sure user owns order or is admin
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this order'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
}

exports.updateOrderById=async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Make sure user owns order or is admin
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this order'
      });
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address
    };

    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      data: updatedOrder
    });
  } catch (error) {
    next(error);
  }
}

exports.updateOrderStatus=async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.status = req.body.status;

    // If order is cancelled or refunded, restore stock
    if (req.body.status === 'cancelled' || req.body.status === 'refunded') {
      for (const item of order.orderItems) {
        const product = await Product.findById(item.product);
        if (product) {
          product.stock += item.quantity;
          await product.save();
        }
      }
    }

    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      data: updatedOrder
    });
  } catch (error) {
    next(error);
  }
}

exports.requestRefund=async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const order = await Order.findById(req.params.id);

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
        message: 'Not authorized to request refund for this order'
      });
    }

    // Check if order is eligible for refund
    if (order.status !== 'delivered') {
      return res.status(400).json({
        success: false,
        message: 'Order must be delivered to request refund'
      });
    }

    if (order.refundRequested) {
      return res.status(400).json({
        success: false,
        message: 'Refund already requested for this order'
      });
    }

    order.refundRequested = true;
    order.refundReason = req.body.reason;
    order.refundStatus = 'pending';

    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      message: 'Refund request submitted successfully',
      data: updatedOrder
    });
  } catch (error) {
    next(error);
  }
}

exports.getAllOrders=async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    let query = Order.find()
      .populate('user', 'name email')
      .populate('orderItems.product', 'title');

    // Filter by status
    if (req.query.status) {
      query = query.find({ status: req.query.status });
    }

    // Filter by date range
    if (req.query.startDate && req.query.endDate) {
      query = query.find({
        createdAt: {
          $gte: new Date(req.query.startDate),
          $lte: new Date(req.query.endDate)
        }
      });
    }

    // Sort
    query = query.sort({ createdAt: -1 });

    // Pagination
    query = query.skip(startIndex).limit(limit);

    const orders = await query;
    const total = await Order.countDocuments();

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit)
      },
      data: orders
    });
  } catch (error) {
    next(error);
  }
}