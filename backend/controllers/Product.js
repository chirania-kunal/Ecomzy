const Product = require('../models/Product');

exports.getAllProducts=async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 0;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Product.countDocuments();

    // Build query
    let query = Product.find({ isActive: true });

    // Search functionality
    if (req.query.search) {
      query = query.find({
        $text: { $search: req.query.search }
      });
    }

    // Filter by category
    if (req.query.category) {
      query = query.find({ category: req.query.category });
    }

    // Filter by price range
    if (req.query.minPrice || req.query.maxPrice) {
      const priceFilter = {};
      if (req.query.minPrice) priceFilter.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) priceFilter.$lte = parseFloat(req.query.maxPrice);
      query = query.find({ price: priceFilter });
    }

    // Filter by rating
    if (req.query.minRating) {
      query = query.find({ ratings: { $gte: parseFloat(req.query.minRating) } });
    }

    // Filter by brand
    if (req.query.brand) {
      query = query.find({ brand: req.query.brand });
    }

    // Filter by stock availability
    if (req.query.inStock === 'true') {
      query = query.find({ stock: { $gt: 0 } });
    }

    // Sort functionality
    if (req.query.sort) {
      const sortOptions = {
        'price-asc': { price: 1 },
        'price-desc': { price: -1 },
        'rating-desc': { ratings: -1 },
        'newest': { createdAt: -1 },
        'oldest': { createdAt: 1 }
      };
      const sortBy = sortOptions[req.query.sort];
      if (sortBy) {
        query = query.sort(sortBy);
      }
    } else {
      query = query.sort({ createdAt: -1 });
    }

    // Pagination
    query = query.skip(startIndex).limit(limit);

    // Execute query
    const products = await query.populate('reviews.user', 'name');

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: products.length,
      pagination,
      data: products
    });
  } catch (error) {
    next(error);
  }
}


exports.getProductCategories= async (req, res, next) => {
  try {
    const categories = await Product.distinct('category');
    
    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
}



exports.getFeaturedProduct=async (req, res, next) => {
  try {
    const products = await Product.find({ 
      isFeatured: true, 
      isActive: true 
    }).limit(8);

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
}

exports.getProductById=async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('reviews.user', 'name avatar')
      .populate({
        path: 'reviews',
        options: { sort: { createdAt: -1 } }
      });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
}

exports.createProduct=async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
}

exports.updateProductById=async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
}

exports.deleteProductById=async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await product.remove();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
}

exports.addProductReview=async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user already reviewed this product
    const alreadyReviewed = product.reviews.find(
      review => review.user.toString() === req.user.id
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: 'Product already reviewed'
      });
    }

    const review = {
      user: req.user.id,
      name: req.user.name,
      rating: req.body.rating,
      comment: req.body.comment
    };

    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;

    await product.save();

    res.status(200).json({
      success: true,
      message: 'Review added successfully'
    });
  } catch (error) {
    next(error);
  }
}