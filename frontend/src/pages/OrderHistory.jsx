import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEye, FaTruck, FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';
import apiService from '../services/api';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await apiService.getMyOrders();
      setOrders(response.data);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FaClock className="text-yellow-500" />;
      case 'processing':
        return <FaClock className="text-blue-500" />;
      case 'shipped':
        return <FaTruck className="text-blue-600" />;
      case 'delivered':
        return <FaCheckCircle className="text-green-500" />;
      case 'cancelled':
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaClock className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Order History</h1>

            {orders.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📦</div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">No orders yet</h2>
                <p className="text-gray-600 mb-6">Start shopping to see your order history here.</p>
                <Link
                  to="/"
                  className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order._id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order #{order.orderNumber}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Placed on {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(order.status)}
                            <span className="capitalize">{order.status}</span>
                          </div>
                        </span>
                        <span className="text-lg font-bold text-gray-900">
                          ${order.totalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Payment Status</p>
                        <p className={`text-sm ${order.isPaid ? 'text-green-600' : 'text-red-600'}`}>
                          {order.isPaid ? 'Paid' : 'Pending'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Items</p>
                        <p className="text-sm text-gray-600">
                          {order.orderItems.length} {order.orderItems.length === 1 ? 'item' : 'items'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Shipping</p>
                        <p className="text-sm text-gray-600">
                          {order.shippingPrice === 0 ? 'Free' : `$${order.shippingPrice.toFixed(2)}`}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Tax</p>
                        <p className="text-sm text-gray-600">${order.taxPrice.toFixed(2)}</p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="font-medium text-gray-900 mb-3">Order Items</h4>
                      <div className="space-y-3">
                        {order.orderItems.map((item, index) => (
                          <div key={index} className="flex items-center space-x-4">
                            <img
                              src={item.image || item.product?.images?.[0]?.url}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900">{item.name}</h5>
                              <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-gray-900">${item.price.toFixed(2)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping Address */}
                    {order.shippingAddress && (
                      <div className="border-t border-gray-200 pt-4">
                        <h4 className="font-medium text-gray-900 mb-2">Shipping Address</h4>
                        <p className="text-sm text-gray-600">
                          {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}, {order.shippingAddress.country}
                        </p>
                      </div>
                    )}

                    {/* Order Actions */}
                    <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                      <div className="flex space-x-4">
                        <Link
                          to={`/orders/${order._id}`}
                          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
                        >
                          <FaEye />
                          <span>View Details</span>
                        </Link>
                        {order.status === 'delivered' && (
                          <button
                            onClick={() => {
                              // Handle refund request
                              toast.info('Refund request feature coming soon');
                            }}
                            className="text-red-600 hover:text-red-700 font-medium"
                          >
                            Request Refund
                          </button>
                        )}
                      </div>
                      
                      {order.trackingNumber && (
                        <div className="text-sm text-gray-600">
                          Tracking: {order.trackingNumber}
                        </div>
                      )}
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

export default OrderHistory;
