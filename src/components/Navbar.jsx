import React from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import logo from '../logo.png';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Navbar = () => {

  const {cart} = useSelector((state)=>state);
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

        <NavLink to="/cart">
          <div className='relative'>
            <FaShoppingCart className="text-3xl" />
            {
              cart.length>0 && 
              <span className='absolute -top-1 -right-2 bg-green-600 text-xs w-5 h-5 flex
               justify-center items-center animate-bounce rounded-full text-white'>{cart.length}</span>
            }
          </div>
        </NavLink>
      </div>

    </div>
  );
};

export default Navbar;
