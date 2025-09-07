const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a product title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a product description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please provide a product price'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Please provide a product category'],
    enum: [
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
    ]
  },
  images: [{
    public_id: {
      type: String,
      required: false
    },
    url: {
      type: String,
      required: true
    }
  }],
  brand: {
    type: String,
    trim: true
  },
  stock: {
    type: Number,
    required: [true, 'Please provide stock quantity'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  ratings: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be negative'],
    max: [5, 'Rating cannot exceed 5']
  },
  numOfReviews: {
    type: Number,
    default: 0
  },
  reviews: [{
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5']
    },
    comment: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  features: [{
    type: String
  }],
  specifications: {
    type: Map,
    of: String
  },
  tags: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  discount: {
    type: Number,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot exceed 100%'],
    default: 0
  },
  sku: {
    type: String,
    unique: true,
    sparse: true
  },
  weight: {
    type: Number,
    min: [0, 'Weight cannot be negative']
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  },
  shippingInfo: {
    freeShipping: {
      type: Boolean,
      default: false
    },
    shippingWeight: Number,
    estimatedDelivery: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for discounted price
productSchema.virtual('discountedPrice').get(function() {
  if (this.discount > 0) {
    return this.price - (this.price * this.discount / 100);
  }
  return this.price;
});

// Index for search functionality
productSchema.index({ 
  title: 'text', 
  description: 'text', 
  category: 'text',
  brand: 'text',
  tags: 'text'
});

// Pre-save middleware to generate SKU if not provided
productSchema.pre('save', function(next) {
  if (!this.sku) {
    this.sku = `SKU-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  next();
});

// Static method to get average rating
productSchema.statics.getAverageRating = async function(productId) {
  const obj = await this.aggregate([
    {
      $match: { _id: productId }
    },
    {
      $unwind: '$reviews'
    },
    {
      $group: {
        _id: '$reviews.rating',
        count: { $sum: 1 }
      }
    }
  ]);

  let ratings = 0;
  let totalReviews = 0;

  obj.forEach(item => {
    ratings += item._id * item.count;
    totalReviews += item.count;
  });

  const avgRating = totalReviews > 0 ? ratings / totalReviews : 0;

  await this.findByIdAndUpdate(productId, {
    ratings: Math.round(avgRating * 10) / 10,
    numOfReviews: totalReviews
  });
};

// Call getAverageRating after save
productSchema.post('save', function() {
  this.constructor.getAverageRating(this._id);
});

// Call getAverageRating before remove
productSchema.pre('remove', function() {
  this.constructor.getAverageRating(this._id);
});

module.exports = mongoose.model('Product', productSchema);
