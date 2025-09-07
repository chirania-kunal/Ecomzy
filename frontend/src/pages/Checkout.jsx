import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaCreditCard, FaPaypal, FaLock } from 'react-icons/fa';
import { remove } from '../redux/Slices/CartSlice';
import apiService from '../services/api';

const Checkout = () => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: ''
  });

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart');
      return;
    }
    fetchUserProfile();
  }, [cart, navigate]);

  const fetchUserProfile = async () => {
    try {
      const response = await apiService.getProfile();
      setUser(response.data);
      if (response.data.address) {
        setShippingAddress(response.data.address);
      }
    } catch (error) {
      toast.error('Please login to continue');
      navigate('/login');
    }
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.1; // 10% tax
  };

  const calculateShipping = () => {
    return calculateSubtotal() > 50 ? 0 : 5.99; // Free shipping over $50
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() + calculateShipping();
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create order
      const orderData = {
        orderItems: cart.map(item => ({
          product: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress,
        paymentMethod,
        taxPrice: calculateTax(),
        shippingPrice: calculateShipping(),
        totalPrice: calculateTotal()
      };

      const orderResponse = await apiService.createOrder(orderData);
      const order = orderResponse.data;

      // Process payment
      if (paymentMethod === 'card') {
        const paymentIntent = await apiService.createPaymentIntent({
          amount: Math.round(calculateTotal() * 100), // Convert to cents
          currency: 'usd',
          orderId: order._id
        });

        // In a real app, you would integrate with Stripe Elements here
        // For demo purposes, we'll simulate a successful payment
        await apiService.confirmPayment(paymentIntent.data.clientSecret, {
          payment_method: {
            card: {
              number: cardDetails.number.replace(/\s/g, ''),
              exp_month: parseInt(cardDetails.expiry.split('/')[0]),
              exp_year: parseInt('20' + cardDetails.expiry.split('/')[1]),
              cvc: cardDetails.cvc
            }
          }
        });
      }

      // Clear cart
      cart.forEach(item => dispatch(remove(item.id)));

      toast.success('Order placed successfully!');
      navigate(`/orders/${order._id}`);

    } catch (error) {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="bg-white shadow rounded-lg p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Shipping Address */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Street Address
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={shippingAddress.street}
                      onChange={handleAddressChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={shippingAddress.city}
                      onChange={handleAddressChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={shippingAddress.state}
                      onChange={handleAddressChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={shippingAddress.zipCode}
                      onChange={handleAddressChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={shippingAddress.country}
                      onChange={handleAddressChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Method</h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <input
                      type="radio"
                      id="card"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="card" className="flex items-center space-x-2 cursor-pointer">
                      <FaCreditCard className="text-gray-600" />
                      <span>Credit Card</span>
                    </label>
                  </div>
                  <div className="flex items-center space-x-4">
                    <input
                      type="radio"
                      id="paypal"
                      name="paymentMethod"
                      value="paypal"
                      checked={paymentMethod === 'paypal'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="paypal" className="flex items-center space-x-2 cursor-pointer">
                      <FaPaypal className="text-blue-600" />
                      <span>PayPal</span>
                    </label>
                  </div>
                </div>

                {/* Card Details */}
                {paymentMethod === 'card' && (
                  <div className="mt-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        name="number"
                        value={cardDetails.number}
                        onChange={(e) => setCardDetails(prev => ({ ...prev, number: formatCardNumber(e.target.value) }))}
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          name="expiry"
                          value={cardDetails.expiry}
                          onChange={(e) => setCardDetails(prev => ({ ...prev, expiry: formatExpiry(e.target.value) }))}
                          placeholder="MM/YY"
                          maxLength="5"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CVC
                        </label>
                        <input
                          type="text"
                          name="cvc"
                          value={cardDetails.cvc}
                          onChange={handleCardChange}
                          placeholder="123"
                          maxLength="4"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Name on Card
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={cardDetails.name}
                          onChange={handleCardChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <FaLock />
                <span>{loading ? 'Processing...' : `Pay $${calculateTotal().toFixed(2)}`}</span>
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white shadow rounded-lg p-6 h-fit">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 mt-6 pt-6 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (10%)</span>
                <span className="font-medium">${calculateTax().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {calculateShipping() === 0 ? 'Free' : `$${calculateShipping().toFixed(2)}`}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-lg font-semibold text-gray-900">
                    ${calculateTotal().toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
