import React, { useEffect, useState } from 'react';
import CartItem from '../components/CartItem';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Cart = () => {
  const { cart } = useSelector((state) => state);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    setTotalAmount(cart.reduce((acc, curr) => acc + curr.price, 0));
  }, [cart]);

  useEffect(() => {
    if (cart.length === 0) {
      toast.info("Your cart is empty!");
    }
  }, [cart]);

  return (
    <div className="w-full px-6 py-10 max-w-[1200px] mx-auto">
      {
        cart.length > 0 ? (
          <div className="flex flex-col md:flex-row gap-10">
            {/* Left: Cart Items */}
            <div className="flex flex-col gap-6 flex-1">
              {
                cart.map((post, index) => (
                  <CartItem key={post.id} post={post} itemIndex={index} />
                ))
              }
            </div>

            {/* Right: Summary */}
            <div className="w-full md:w-[350px] bg-white rounded  p-6 ">
              <div className="text-green-600 text-sm font-bold">YOUR CART</div>
              <div className="text-3xl font-extrabold text-green-700 mb-6">SUMMARY</div>

              <p className="text-md font-semibold mb-2">
                Total Items: <span className="font-medium">{cart.length}</span>
              </p>

              <div className="flex justify-between items-center text-lg font-semibold mb-6">
                <span>Total Amount:</span>
                <span className="text-black">${totalAmount.toFixed(2)}</span>
              </div>

              <button className="w-full bg-green-700 text-white py-3 rounded hover:bg-green-800 transition-all font-semibold">
                Checkout Now
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center mt-20 space-y-4">
            <h1 className="text-2xl font-semibold text-gray-700">🛒 Your Cart is Empty</h1>
            <Link to="/">
              <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-all">
                Shop Now
              </button>
            </Link>
          </div>
        )
      }
    </div>
  );
};

export default Cart;
