const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get auth token from localStorage
  getAuthToken() {
    return localStorage.getItem('token');
  }

  // Set auth token in localStorage
  setAuthToken(token) {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  // Get user from localStorage
  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // // Set user in localStorage
  setUser(user) {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }

  // Generic request method
  // async request(endpoint, options = {}) {
  //   const url = `${this.baseURL}${endpoint}`;
  //   const token = this.getAuthToken();

  //   const config = {
  //     headers: {
  //       'Content-Type': 'application/json',
  //       ...(token && { Authorization: `Bearer ${token}` }),
  //       ...options.headers,
  //     },
  //     ...options,
  //   };

  //   try {
  //     const response = await fetch(url, config);
  //     const data = await response.json();

  //     if (!response.ok) {
  //       throw new Error(data.message || 'Something went wrong');
  //     }

  //     return data;
  //   } catch (error) {
  //     console.error('API Error:', error);
  //     throw error;
  //   }
  // }

  // Authentication methods
  async register(userData) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.success) {
      this.setAuthToken(response.token);
      this.setUser(response.user);
    }

    return response;
  }

  async login(credentials) {
    console.log('kfkdj')
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    console.log(response);

    if (response.success) {
      this.setAuthToken(response.token);
      this.setUser(response.user);
    }

    return response;
  }

  async logout() {
    try {
      await this.request('/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.setAuthToken(null);
      this.setUser(null);
    }
  }

  async getCurrentUser() {
    return await this.request('/auth/me');
  }

  // Product methods
  async getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/products${queryString ? `?${queryString}` : ''}`;
    return await this.request(endpoint);
  }

  async getProduct(id) {
    return await this.request(`/products/${id}`);
  }

  async getProductCategories() {
    return await this.request('/products/categories');
  }

  async getFeaturedProducts() {
    return await this.request('/products/featured');
  }

  async addProductReview(productId, reviewData) {
    return await this.request(`/products/${productId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  }

  // Order methods
  async createOrder(orderData) {
    return await this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getMyOrders() {
    return await this.request('/orders/myorders');
  }

  async getOrder(id) {
    return await this.request(`/orders/${id}`);
  }

  async updateOrderPayment(orderId, paymentData) {
    return await this.request(`/orders/${orderId}/pay`, {
      method: 'PUT',
      body: JSON.stringify(paymentData),
    });
  }

  async requestRefund(orderId, reason) {
    return await this.request(`/orders/${orderId}/refund`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  // Payment methods
  async createPaymentIntent(orderId) {
    return await this.request('/payments/create-payment-intent', {
      method: 'POST',
      body: JSON.stringify({ orderId }),
    });
  }

  async confirmPayment(orderId, paymentIntentId) {
    return await this.request('/payments/confirm', {
      method: 'POST',
      body: JSON.stringify({ orderId, paymentIntentId }),
    });
  }

  async getPaymentMethods() {
    return await this.request('/payments/methods');
  }

  // User methods
  async getUserProfile() {
    return await this.request('/users/profile');
  }

  async updateUserProfile(profileData) {
    return await this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async updatePassword(passwordData) {
    return await this.request('/auth/updatepassword', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  }

  async uploadAvatar(avatarUrl) {
    return await this.request('/users/avatar', {
      method: 'POST',
      body: JSON.stringify({ avatarUrl }),
    });
  }

  // Review methods
  async getProductReviews(productId) {
    return await this.request(`/reviews/product/${productId}`);
  }

  async getMyReviews() {
    return await this.request('/reviews/my-reviews');
  }

  async updateReview(productId, reviewData) {
    return await this.request(`/reviews/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(reviewData),
    });
  }

  async deleteReview(productId) {
    return await this.request(`/reviews/${productId}`, {
      method: 'DELETE',
    });
  }

  // Wishlist methods
  async getWishlist() {
    return await this.request('/wishlist');
  }

  async addToWishlist(productId) {
    return await this.request(`/wishlist/${productId}`, {
      method: 'POST',
    });
  }

  async removeFromWishlist(productId) {
    return await this.request(`/wishlist/${productId}`, {
      method: 'DELETE',
    });
  }

  async clearWishlist() {
    return await this.request('/wishlist', {
      method: 'DELETE',
    });
  }

  async checkWishlist(productId) {
    return await this.request(`/wishlist/check/${productId}`);
  }

  async getWishlistCount() {
    return await this.request('/wishlist/count');
  }

  // Admin methods (only for admin users)
  async getAllUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/users${queryString ? `?${queryString}` : ''}`;
    return await this.request(endpoint);
  }

  async getAllOrders(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/orders${queryString ? `?${queryString}` : ''}`;
    return await this.request(endpoint);
  }

  async updateOrderStatus(orderId, status) {
    return await this.request(`/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async createProduct(productData) {
    return await this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(productId, productData) {
    return await this.request(`/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(productId) {
    return await this.request(`/products/${productId}`, {
      method: 'DELETE',
    });
  }

  // Utility methods
  isAuthenticated() {
    return !!this.getAuthToken();
  }

  isAdmin() {
    const user = this.getUser();
    return user && user.role === 'admin';
  }

  // Health check
  async healthCheck() {
    return await this.request('/health');
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
