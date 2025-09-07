const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  orderItems: [{
    name: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1']
    },
    image: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: true
    }
  }],
  shippingAddress: {
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    postalCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    }
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['stripe', 'paypal', 'cod']
  },
  paymentResult: {
    id: {
      type: String
    },
    status: {
      type: String
    },
    update_time: {
      type: String
    },
    email_address: {
      type: String
    }
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  isPaid: {
    type: Boolean,
    required: true,
    default: false
  },
  paidAt: {
    type: Date
  },
  isDelivered: {
    type: Boolean,
    required: true,
    default: false
  },
  deliveredAt: {
    type: Date
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending'
  },
  orderNumber: {
    type: String,
    unique: true
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  trackingNumber: {
    type: String
  },
  estimatedDelivery: {
    type: Date
  },
  refundRequested: {
    type: Boolean,
    default: false
  },
  refundReason: {
    type: String
  },
  refundStatus: {
    type: String,
    enum: ['none', 'pending', 'approved', 'rejected'],
    default: 'none'
  }
}, {
  timestamps: true
});

// Generate order number before saving
orderSchema.pre('save', function(next) {
  if (!this.orderNumber) {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.orderNumber = `ORD-${timestamp.slice(-6)}-${random}`;
  }
  next();
});

// Calculate total price
orderSchema.methods.calculateTotalPrice = function() {
  const itemsPrice = this.orderItems.reduce((acc, item) => {
    return acc + (item.price * item.quantity);
  }, 0);
  
  this.totalPrice = itemsPrice + this.taxPrice + this.shippingPrice;
  return this.totalPrice;
};

// Virtual for order summary
orderSchema.virtual('orderSummary').get(function() {
  return {
    totalItems: this.orderItems.reduce((acc, item) => acc + item.quantity, 0),
    subtotal: this.orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0),
    tax: this.taxPrice,
    shipping: this.shippingPrice,
    total: this.totalPrice
  };
});

// Index for better query performance
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });

module.exports = mongoose.model('Order', orderSchema);
