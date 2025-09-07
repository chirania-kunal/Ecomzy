import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { add, remove } from '../redux/Slices/CartSlice';
import { toast } from 'react-toastify';
import { FaHeart, FaShoppingCart, FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import apiService from '../services/api';

const Product = ({ post }) => {
  
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const {user}=useSelector((state)=>state.auth);

  useEffect(() => {
    if (user) {
      checkWishlistStatus();
    }
  }, [user, post._id]);

  const checkWishlistStatus = async () => {
    try {
      const response = await apiService.checkWishlist(post._id);
      setIsInWishlist(response.inWishlist);
    } catch (error) {
      console.error('Error checking wishlist status:', error);
    }
  };

  const addToCart = () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }
    dispatch(add(post));
    toast.success("Item added to the cart");
  };

  const removeFromCart = () => {
    dispatch(remove(post._id));
    toast.error("Item removed from cart");
  };

  const toggleWishlist = async () => {
    if (!user) {
      toast.error('Please login to add items to wishlist');
      return;
    }

    try {
      if (isInWishlist) {
        await apiService.removeFromWishlist(post._id);
        setIsInWishlist(false);
        toast.success('Removed from wishlist');
      } else {
        await apiService.addToWishlist(post._id);
        setIsInWishlist(true);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      toast.error('Failed to update wishlist');
    }
  };

  const isInCart = cart.some((p) => p._id === post._id);

  return (
    <div className='flex flex-col justify-center items-center hover:scale-105 transition duration-300 
    ease-in gap-3 p-4 mt-10 ml-5 rounded-xl shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] hover:shadow-[0px_0px_95px_53px_#00000024] bg-white'>
      <div className="w-full">
        <p className='text-gray-700 font-semibold text-lg text-left truncate w-full mt-1'>
          {post.title.length > 20 ? post.title.substring(0, 20) + "..." : post.title}
        </p>
      </div>
      
      <div className='w-full text-gray-400 font-normal text-[10px] text-left'>
        {post.description.split(" ").slice(0, 8).join(" ") + "..."}
      </div>
      
      <div className='h-[180px] w-full'>
        <img 
          src={post.images?.[0]?.url || post.image} 
          alt={post.title} 
          className='h-full w-full object-cover rounded-lg'
        />
      </div>

      {/* Rating */}
      <div className="flex items-center gap-1 w-full">
        <FaStar className="text-yellow-400 text-sm" />
        <span className="text-sm text-gray-600">{post.ratings || 0}</span>
        <span className="text-xs text-gray-400">({post.numOfReviews || 0})</span>
      </div>

      <div className='flex justify-between items-center gap-4 w-full'>
        <div>
          <p className='text-green-600 font-semibold text-lg'>${post.price}</p>
          {post.discount > 0 && (
            <p className='text-red-500 text-sm line-through'>${post.originalPrice}</p>
          )}
        </div>
        
        <div className="flex gap-2">
          {/* Wishlist Button */}
          <button
            onClick={toggleWishlist}
            className={`p-2 rounded-full transition-colors ${
              isInWishlist 
                ? 'text-red-500 bg-red-50' 
                : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
            }`}
          >
            <FaHeart className="text-lg" />
          </button>

          {/* Cart Button */}
          {isInCart ? (
            <button
              className='text-gray-700 border-2 border-gray-700 rounded-full font-semibold text-[12px] p-2 uppercase
              hover:bg-gray-700 hover:text-white transition duration-300 ease-in'
              onClick={removeFromCart}
            >
              Remove
            </button>
          ) : (
            <button
              className='text-gray-700 border-2 border-gray-700 rounded-full font-semibold text-[12px] p-2 uppercase
              hover:bg-gray-700 hover:text-white transition duration-300 ease-in'
              onClick={addToCart}
            >
              <FaShoppingCart className="text-sm" />
            </button>
          )}
        </div>
      </div>

      {/* View Details Link */}
      <Link
        to={`/product/${post._id}`}
        className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2"
      >
        View Details
      </Link>
    </div>
  );
};

export default Product;
