import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { FaHeart, FaShoppingCart, FaStar, FaStarHalfAlt } from 'react-icons/fa';
import { add } from '../redux/Slices/CartSlice';
import apiService from '../services/api';
import { getProduct } from '../services/operations/productApi';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [inWishlist, setInWishlist] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    fetchProduct();
    checkWishlistStatus();
    fetchReviews();
  }, [id]);

  const fetchProduct = async () => {
    // try {
    //   const response = await apiService.getProduct(id);
    //   setProduct(response.data);
    // } catch (error) {
    //   toast.error('Failed to load product');
    //   navigate('/');
    // } finally {
    // }
    await getProduct(id,setProduct,navigate)
    setLoading(false);
  };

  const checkWishlistStatus = async () => {
    try {
      const response = await apiService.checkWishlist(id);
      setInWishlist(response.data.inWishlist);
    } catch (error) {
      // User might not be logged in
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await apiService.getProductReviews(id);
      setReviews(response.data);
    } catch (error) {
      console.error('Failed to load reviews');
    }
  };

  const handleAddToCart = () => {
    if (product.stock < quantity) {
      toast.error('Not enough stock available');
      return;
    }
    
    dispatch(add({
      id: product._id,
      title: product.title,
      price: product.discountedPrice || product.price,
      image: product.images[0]?.url || product.image,
      quantity: quantity
    }));
    toast.success('Added to cart!');
  };

  const handleWishlistToggle = async () => {
    try {
      if (inWishlist) {
        await apiService.removeFromWishlist(id);
        setInWishlist(false);
        toast.success('Removed from wishlist');
      } else {
        await apiService.addToWishlist(id);
        setInWishlist(true);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      toast.error('Failed to update wishlist');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiService.addProductReview(id, userReview);
      toast.success('Review submitted successfully');
      setUserReview({ rating: 5, comment: '' });
      fetchReviews();
    } catch (error) {
      toast.error('Failed to submit review');
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="text-gray-300" />);
    }

    return stars;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Product not found</h2>
          <button
            onClick={() => navigate('/')}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-w-1 aspect-h-1 w-full">
                <img
                  src={product.images[selectedImage]?.url || product.image}
                  alt={product.title}
                  className="w-full h-98 object-cover rounded-lg"
                />
              </div>
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((image, index) => (
                    <img
                      key={index}
                      src={image.url}
                      alt={`${product.title} ${index + 1}`}
                      className={`w-full h-20 object-cover rounded cursor-pointer ${
                        selectedImage === index ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => setSelectedImage(index)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
                <p className="text-gray-600 mt-2">{product.brand}</p>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  {renderStars(product.ratings)}
                  <span className="ml-2 text-sm text-gray-600">
                    {product.ratings} ({product.numOfReviews} reviews)
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-4">
                  <span className="text-3xl font-bold text-gray-900">
                    ${product.discountedPrice || product.price}
                  </span>
                  {product.discount > 0 && (
                    <>
                      <span className="text-lg text-gray-500 line-through">
                        ${product.price}
                      </span>
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                        {product.discount}% OFF
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="prose max-w-none">
                <p className="text-gray-700">{product.description}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-700">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="px-4 py-1">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-1 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.stock} available
                  </span>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <FaShoppingCart />
                    <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                  </button>
                  <button
                    onClick={handleWishlistToggle}
                    className={`p-3 rounded-md border-2 ${
                      inWishlist
                        ? 'border-red-500 text-red-500 hover:bg-red-50'
                        : 'border-gray-300 text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    <FaHeart className={inWishlist ? 'fill-current' : ''} />
                  </button>
                </div>
              </div>

              {product.features && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Features</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {product.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="border-t border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h2>
            
            {/* Add Review Form */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Write a Review</h3>
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setUserReview(prev => ({ ...prev, rating: star }))}
                        className="text-2xl"
                      >
                        <FaStar
                          className={
                            star <= userReview.rating ? 'text-yellow-400' : 'text-gray-300'
                          }
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comment
                  </label>
                  <textarea
                    value={userReview.comment}
                    onChange={(e) => setUserReview(prev => ({ ...prev, comment: e.target.value }))}
                    rows={4}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Share your thoughts about this product..."
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Submit Review
                </button>
              </form>
            </div>

            {/* Reviews List */}
            <div className="space-y-6">
              {reviews.length === 0 ? (
                <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
              ) : (
                reviews.map((review) => (
                  <div key={review._id} className="border-b border-gray-200 pb-6">
                    <div className="flex items-center space-x-4 mb-2">
                      <div className="flex items-center">
                        {renderStars(review.rating)}
                        <span className="ml-2 text-sm text-gray-600">{review.rating}/5</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        by {review.user.name}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
