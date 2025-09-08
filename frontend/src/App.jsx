import React from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './pages/Profile';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import OrderHistory from './pages/OrderHistory';
import Wishlist from './pages/Wishlist';
import AdminDashboard from './pages/AdminDashboard';

const App = () => {
  return (
    <div className="w-full h-full flex flex-col bg-white">
      <div className="w-full h-20 border-1 bg-slate-900">
        <Navbar />
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<OrderHistory />} />
        <Route path="/wishlist" element={<Wishlist />} />
        {/* <Route path="/admin/*" element={<AdminDashboard />} /> */}
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default App;
