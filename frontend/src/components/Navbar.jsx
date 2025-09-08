import React, { useState, useEffect } from 'react';
import { FaShoppingCart, FaUser, FaHeart, FaSignOutAlt, FaCog } from 'react-icons/fa';
import { MdAdminPanelSettings } from 'react-icons/md';
import logo from '../logo.png';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { remove } from '../redux/Slices/CartSlice';
import apiService from '../services/api';
import { toast } from 'react-toastify';
import { logout } from '../services/operations/authApi';
import { getWishlistCount } from '../services/operations/wishlistApi';

const Navbar = () => {
  const { cart } = useSelector((state) => state.cart);
  // const [user, setUser] = useState(null);

  const {token} = useSelector((state) => state.auth);
  const {user} = useSelector((state)=> state.auth);
  const [showDropdown, setShowDropdown] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // const currentUser = apiService.getUser();
    // setUser(currentUser);
    
    if (user) {
      fetchWishlistCount();
    }
  }, []);

  const fetchWishlistCount = async () => {
    await getWishlistCount(setWishlistCount,token);
  };

  const handleLogout = async () => {
    try {
        dispatch(logout(navigate));
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const handleProfileClick = () => {
    setShowDropdown(false);
    navigate('/profile');
  };

  const handleWishlistClick = () => {
    setShowDropdown(false);
    navigate('/wishlist');
  };

  const handleAdminClick = () => {
    setShowDropdown(false);
    navigate('/admin');
  };

  return (
    <div className="w-11/12 max-w-[1150px] mx-auto flex flex-row items-center justify-between py-4">
      
      {/* Logo */}
      <NavLink to="/">
        <img src={logo} alt="Logo" className="h-14" />
      </NavLink>

      {/* Navigation Links */}
      <div className="flex flex-row items-center gap-6 text-lg font-medium text-white">
        <NavLink to="/" className={({ isActive }) => isActive ? "text-yellow-400" : "text-white"}>
          Home
        </NavLink>

        {/* Cart */}
        <NavLink to="/cart">
          <div className='relative'>
            <FaShoppingCart className="text-3xl" />
            {
              cart.length > 0 && 
              <span className='absolute -top-1 -right-2 bg-green-600 text-xs w-5 h-5 flex
               justify-center items-center animate-bounce rounded-full text-white'>{cart.length}</span>
            }
          </div>
        </NavLink>

        {/* Wishlist */}
        {/* {user && (
          <NavLink to="/wishlist">
            <div className='relative'>
              <FaHeart className="text-3xl" />
              {
                wishlistCount > 0 && 
                <span className='absolute -top-1 -right-2 bg-red-600 text-xs w-5 h-5 flex
                 justify-center items-center animate-bounce rounded-full text-white'>{wishlistCount}</span>
              }
            </div>
          </NavLink>
        )} */}

        {/* User Menu */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 text-white hover:text-yellow-400 transition-colors"
            >
              <FaUser className="text-2xl" />
              <span className="hidden md:block">{user.name}</span>
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <button
                  onClick={handleProfileClick}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  <FaCog className="text-sm" />
                  Profile
                </button>
                
                <button
                  onClick={handleWishlistClick}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  <FaHeart className="text-sm" />
                  Wishlist
                </button>

                {user.role === 'admin' && (
                  <button
                    onClick={handleAdminClick}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    <MdAdminPanelSettings className="text-sm" />
                    Admin Panel
                  </button>
                )}

                <hr className="my-1" />
                
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                >
                  <FaSignOutAlt className="text-sm" />
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex gap-4 items-center">
            <NavLink
              to="/login"
              className="text-white hover:text-yellow-400 transition-colors "
            >
              Login
            </NavLink>
            <NavLink
              to="/register"
              className="bg-yellow-400 text-black px-4 py-2 rounded-md hover:bg-yellow-300 transition-colors"
            >
              Register
            </NavLink>
          </div>
        )}
      </div>

      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};

export default Navbar;
