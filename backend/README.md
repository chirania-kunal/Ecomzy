# E-commerce Backend API

A complete Node.js/Express backend for an e-commerce application with authentication, payment processing, order management, and more.

## Features

- 🔐 **User Authentication** - JWT-based authentication with role-based access control
- 🛍️ **Product Management** - CRUD operations for products with search and filtering
- 📦 **Order Management** - Complete order lifecycle with status tracking
- 💳 **Payment Integration** - Stripe payment processing with webhooks
- ⭐ **Reviews & Ratings** - Product reviews and rating system
- ❤️ **Wishlist** - User wishlist functionality
- 👤 **User Profiles** - User profile management and admin panel
- 🔍 **Search & Filtering** - Advanced product search and filtering
- 📊 **Admin Dashboard** - Admin-only routes for managing the platform

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Stripe** - Payment processing
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **helmet** - Security middleware
- **cors** - Cross-origin resource sharing

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud)
- Stripe account (for payments)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/ecommerce_db
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=7d
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
   FRONTEND_URL=http://localhost:3000
   ```

4. **Seed the database**
   ```bash
   node seeder.js
   ```

5. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/updatedetails` - Update user details
- `PUT /api/auth/updatepassword` - Update password
- `POST /api/auth/logout` - Logout user

### Products
- `GET /api/products` - Get all products (with filtering, search, pagination)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)
- `POST /api/products/:id/reviews` - Add product review
- `GET /api/products/categories` - Get product categories
- `GET /api/products/featured` - Get featured products

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/myorders` - Get user's orders
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/pay` - Update order to paid
- `PUT /api/orders/:id/deliver` - Mark order as delivered (Admin)
- `PUT /api/orders/:id/status` - Update order status (Admin)
- `GET /api/orders` - Get all orders (Admin)
- `POST /api/orders/:id/refund` - Request refund

### Payments
- `POST /api/payments/create-payment-intent` - Create Stripe payment intent
- `POST /api/payments/confirm` - Confirm payment
- `GET /api/payments/methods` - Get payment methods
- `POST /api/payments/refund` - Process refund (Admin)
- `POST /api/payments/webhook` - Stripe webhook handler

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/avatar` - Upload user avatar
- `GET /api/users` - Get all users (Admin)
- `GET /api/users/:id` - Get user by ID (Admin)
- `PUT /api/users/:id` - Update user (Admin)
- `DELETE /api/users/:id` - Delete user (Admin)
- `GET /api/users/stats` - Get user statistics (Admin)

### Reviews
- `GET /api/reviews/product/:productId` - Get product reviews
- `GET /api/reviews/my-reviews` - Get user's reviews
- `PUT /api/reviews/:productId` - Update review
- `DELETE /api/reviews/:productId` - Delete review
- `GET /api/reviews` - Get all reviews (Admin)
- `DELETE /api/reviews/:productId/:reviewId` - Delete review (Admin)

### Wishlist
- `GET /api/wishlist` - Get user's wishlist
- `POST /api/wishlist/:productId` - Add product to wishlist
- `DELETE /api/wishlist/:productId` - Remove product from wishlist
- `DELETE /api/wishlist` - Clear wishlist
- `GET /api/wishlist/check/:productId` - Check if product is in wishlist
- `GET /api/wishlist/count` - Get wishlist count

## Database Models

### User
- Authentication fields (name, email, password)
- Profile information (avatar, phone, address)
- Role-based access control (user/admin)
- Account status and verification

### Product
- Product details (title, description, price, category)
- Inventory management (stock, SKU)
- Reviews and ratings system
- Images and specifications
- Discount and pricing features

### Order
- Order items and quantities
- Shipping and billing information
- Payment processing details
- Order status tracking
- Refund management

### Wishlist
- User-product relationships
- Wishlist management methods

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation with express-validator
- Rate limiting
- CORS configuration
- Helmet security headers
- Role-based access control

## Payment Integration

The backend integrates with Stripe for payment processing:

1. **Payment Intent Creation** - Creates payment intents for orders
2. **Payment Confirmation** - Confirms successful payments
3. **Webhook Handling** - Processes Stripe webhooks for real-time updates
4. **Refund Processing** - Handles refunds through Stripe

## Error Handling

- Centralized error handling middleware
- Custom error response class
- Validation error handling
- Database error handling
- JWT error handling

## Development

### Scripts
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run tests

### Database Seeding
- `node seeder.js` - Import sample data
- `node seeder.js -d` - Delete all data

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment | development |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/ecommerce_db |
| `JWT_SECRET` | JWT secret key | - |
| `JWT_EXPIRE` | JWT expiration time | 7d |
| `STRIPE_SECRET_KEY` | Stripe secret key | - |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | - |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:3000 |

## API Response Format

### Success Response
```json
{
  "success": true,
  "data": {...},
  "count": 10,
  "pagination": {...}
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": [...]
}
```

## Testing

The API can be tested using tools like:
- Postman
- Insomnia
- curl commands
- Frontend application

## Deployment

1. Set up environment variables for production
2. Configure MongoDB connection
3. Set up Stripe webhook endpoints
4. Deploy to your preferred platform (Heroku, AWS, etc.)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
