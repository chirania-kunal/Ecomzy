const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  products: [{
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Ensure one wishlist per user
wishlistSchema.index({ user: 1 }, { unique: true });

// Virtual for product count
wishlistSchema.virtual('productCount').get(function() {
  return this.products.length;
});

// Method to add product to wishlist
wishlistSchema.methods.addProduct = function(productId) {
  const existingProduct = this.products.find(
    item => item.product.toString() === productId.toString()
  );
  
  if (!existingProduct) {
    this.products.push({ product: productId });
    return true;
  }
  return false;
};

// Method to remove product from wishlist
wishlistSchema.methods.removeProduct = function(productId) {
  const initialLength = this.products.length;
  this.products = this.products.filter(
    item => item.product.toString() !== productId.toString()
  );
  return this.products.length < initialLength;
};

// Method to check if product is in wishlist
wishlistSchema.methods.hasProduct = function(productId) {
  return this.products.some(
    item => item.product.toString() === productId.toString()
  );
};

module.exports = mongoose.model('Wishlist', wishlistSchema);
