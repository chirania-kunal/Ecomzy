import React, { useState, useEffect } from "react";
import {
  FaShoppingCart,
  FaUser,
  FaHeart,
  FaSignOutAlt,
  FaCog,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";
import logo from "../logo.png";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { logout } from "../services/operations/authApi";
import { getWishlistCount } from "../services/operations/wishlistApi";

const Navbar = () => {
  const { cart } = useSelector((state) => state.cart);
  const { token, user } = useSelector((state) => state.auth);

  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchWishlistCount();
    }
  }, [user]);

  const fetchWishlistCount = async () => {
    await getWishlistCount(setWishlistCount, token);
  };

  const handleLogout = async () => {
    try {
      dispatch(logout(navigate));
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <nav className="w-11/12 max-w-[1150px] mx-auto flex items-center justify-between py-4 relative">
      {/* Logo */}
      <NavLink to="/">
        <img src={logo} alt="Logo" className="h-12 md:h-14 w-auto" />
      </NavLink>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center gap-6 text-lg font-medium text-white">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "text-yellow-400" : "text-white"
          }
        >
          Home
        </NavLink>

        {/* Cart */}
        <NavLink to="/cart">
          <div className="relative">
            <FaShoppingCart className="text-2xl" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-2 bg-green-600 text-xs w-5 h-5 flex justify-center items-center animate-bounce rounded-full text-white">
                {cart.length}
              </span>
            )}
          </div>
        </NavLink>

        {/* User */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 hover:text-yellow-400"
            >
              <FaUser className="text-xl" />
              <span>{user.name}</span>
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    navigate("/profile");
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                >
                  <FaCog /> Profile
                </button>

                <button
                  onClick={() => {
                    setShowDropdown(false);
                    navigate("/wishlist");
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                >
                  <FaHeart /> Wishlist
                  {wishlistCount > 0 && (
                    <span className="ml-auto bg-red-600 text-white text-xs rounded-full px-2">
                      {wishlistCount}
                    </span>
                  )}
                </button>

                {user.role === "admin" && (
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      navigate("/admin");
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                  >
                    <MdAdminPanelSettings /> Admin Panel
                  </button>
                )}

                <hr className="my-1" />
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full"
                >
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex gap-4 items-center">
            <NavLink
              to="/login"
              className="hover:text-yellow-400 transition-colors"
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

      {/* Mobile Hamburger */}
      <button
        className="md:hidden text-white text-2xl"
        onClick={() => setMobileMenu(!mobileMenu)}
      >
        {mobileMenu ? <FaTimes /> : <FaBars />}
      </button>

      {/* Mobile Menu */}
      {mobileMenu && (
        <div className="absolute top-20  w-full bg-gray-900 text-white flex flex-col items-center gap-4 py-6 md:hidden z-40">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "text-yellow-400" : "text-white"
            }
            onClick={() => setMobileMenu(false)}
          >
            Home
          </NavLink>
          <NavLink to="/cart" onClick={() => setMobileMenu(false)}>
            <FaShoppingCart className="text-xl mb-4" /> Cart
          </NavLink>
          {user ? (
            <>
              <button
                onClick={() => {
                  setMobileMenu(false);
                  navigate("/profile");
                }}
              >
                Profile
              </button>
              <button
                onClick={() => {
                  setMobileMenu(false);
                  navigate("/wishlist");
                }}
              >
                Wishlist
              </button>
              {user.role === "admin" && (
                <button
                  onClick={() => {
                    setMobileMenu(false);
                    navigate("/admin");
                  }}
                >
                  Admin Panel
                </button>
              )}
              <button
                onClick={() => {
                  setMobileMenu(false);
                  handleLogout();
                }}
                className="text-red-400"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" onClick={() => setMobileMenu(false)}>
                Login
              </NavLink>
              <NavLink to="/register" onClick={() => setMobileMenu(false)}>
                Register
              </NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
