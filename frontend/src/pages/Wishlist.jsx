import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaHeart, FaShoppingCart, FaTrash, FaStar } from 'react-icons/fa';
import { add } from '../redux/Slices/CartSlice';
import apiService from '../services/api';

const Wishlist = () => {
  const dispatch = useDispatch();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const response = await apiService.getWishlist();
      setWishlist(response.data.products || []);
    } catch (error) {
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await apiService.removeFromWishlist(productId);
      setWishlist(prev => prev.filter(item => item._id !== productId));
      toast.success('Removed from wishlist');
    } catch (error) {
      toast.error('Failed to remove from wishlist');
    }
  };

  const handleAddToCart = (product) => {
    if (product.stock === 0) {
      toast.error('Product is out of stock');
      return;
    }

    dispatch(add({
      id: product._id,
      title: product.title,
      price: product.discountedPrice || product.price,
      image: product.images[0]?.url || product.image,
      quantity: 1
    }));
    toast.success('Added to cart!');
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={i <= rating ? 'text-yellow-400' : 'text-gray-300'}
        />
      );
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
              <div className="flex items-center space-x-2 text-gray-600">
                <FaHeart className="text-red-500" />
                <span>{wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}</span>
              </div>
            </div>

            {wishlist.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">💝</div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
                <p className="text-gray-600 mb-6">Start adding products to your wishlist to see them here.</p>
                <Link
                  to="/"
                  className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {wishlist.map((product) => (
                  <div key={product._id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="relative">
                      <img
                        src={product.images[0]?.url || product.image}
                        alt={product.title}
                        className="w-full h-48 object-cover"
                      />
                      <button
                        onClick={() => handleRemoveFromWishlist(product._id)}
                        className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-red-50 transition-colors duration-200"
                      >
                        <FaTrash className="text-red-500 text-sm" />
                      </button>
                      {product.discount > 0 && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
                          {product.discount}% OFF
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <div className="mb-2">
                        <div className="flex items-center space-x-1 mb-1">
                          {renderStars(product.ratings)}
                          <span className="text-sm text-gray-600 ml-1">
                            ({product.numOfReviews})
                          </span>
                        </div>
                      </div>

                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {product.title}
                      </h3>

                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {product.description}
                      </p>

                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-gray-900">
                            ${product.discountedPrice || product.price}
                          </span>
                          {product.discount > 0 && (
                            <span className="text-sm text-gray-500 line-through">
                              ${product.price}
                            </span>
                          )}
                        </div>
                        <span className={`text-sm px-2 py-1 rounded ${
                          product.stock > 0 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={product.stock === 0}
                          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                          <FaShoppingCart className="text-sm" />
                          <span>Add to Cart</span>
                        </button>
                        <Link
                          to={`/product/${product._id}`}
                          className="bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center justify-center"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
