# 🛍️ E-Commerce Full-Stack Application

A complete e-commerce platform built with React.js frontend and Node.js/Express backend, featuring user authentication, product management, payment processing, and order management.

## ✨ Features

### 🔐 Authentication & User Management
- User registration and login with JWT
- Role-based access control (User/Admin)
- Password hashing and security
- User profile management

### 🛍️ Product Management
- Product catalog with search and filtering
- Product categories and brands
- Product reviews and ratings
- Stock management
- Product images and specifications

### 🛒 Shopping Features
- Shopping cart functionality
- Wishlist management
- Product search and filtering
- Price range filtering
- Sort by price, rating, date

### 💳 Payment & Orders
- Stripe payment integration
- Multiple payment methods
- Order management and tracking
- Order history
- Refund processing

### 👤 User Features
- User profiles and settings
- Order history and tracking
- Wishlist management
- Product reviews
- Address management

### 🛠️ Admin Features
- Product CRUD operations
- Order management
- User management
- Sales analytics
- Inventory management

## 🚀 Tech Stack

### Frontend
- **React.js** - UI framework
- **Redux Toolkit** - State management
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **React Icons** - Icons
- **React Toastify** - Notifications

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Stripe** - Payment processing
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud)
- Stripe account (for payments)
- Git

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd e_commerce_mini_project
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp env.example .env

# Update .env file with your configuration
# See backend/env.example for required variables

# Seed the database with sample data
node seeder.js

# Start development server
npm run dev
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (root directory)
cd ..

# Install dependencies
npm install

# Create .env file for frontend
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env

# Start development server
npm start
```

## 🔧 Environment Variables

### Backend (.env)
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

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 📊 Database Seeding

The backend includes a seeder script to populate the database with sample data:

```bash
# Import sample data
node seeder.js

# Delete all data
node seeder.js -d
```

**Default Admin Account:**
- Email: admin@example.com
- Password: admin123

## 🚀 Running the Application

### Development Mode

1. **Start Backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start Frontend:**
   ```bash
   npm start
   ```

3. **Access the Application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api
   - API Health Check: http://localhost:5000/api/health

### Production Mode

1. **Build Frontend:**
   ```bash
   npm run build
   ```

2. **Start Backend:**
   ```bash
   cd backend
   npm start
   ```

## 📁 Project Structure

```
e_commerce_mini_project/
├── backend/                 # Backend application
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── utils/              # Utility functions
│   ├── seeder.js           # Database seeder
│   ├── server.js           # Main server file
│   └── package.json        # Backend dependencies
├── src/                    # Frontend application
│   ├── components/         # React components
│   ├── pages/              # Page components
│   ├── redux/              # Redux store and slices
│   ├── services/           # API services
│   ├── App.jsx             # Main app component
│   └── index.js            # Entry point
├── public/                 # Static files
└── package.json            # Frontend dependencies
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/updatedetails` - Update user details
- `PUT /api/auth/updatepassword` - Update password
- `POST /api/auth/logout` - Logout user

### Products
- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)
- `POST /api/products/:id/reviews` - Add product review

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/myorders` - Get user's orders
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/pay` - Update order payment
- `GET /api/orders` - Get all orders (Admin)

### Payments
- `POST /api/payments/create-payment-intent` - Create payment intent
- `POST /api/payments/confirm` - Confirm payment
- `GET /api/payments/methods` - Get payment methods

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users` - Get all users (Admin)

### Wishlist
- `GET /api/wishlist` - Get user's wishlist
- `POST /api/wishlist/:productId` - Add to wishlist
- `DELETE /api/wishlist/:productId` - Remove from wishlist

## 🛒 Shopping Flow

1. **Browse Products** - Users can browse products with search and filtering
2. **Add to Cart** - Add products to shopping cart
3. **Add to Wishlist** - Save products for later
4. **Checkout** - Proceed to checkout with shipping details
5. **Payment** - Complete payment using Stripe
6. **Order Confirmation** - Receive order confirmation and tracking

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting
- CORS configuration
- Helmet security headers
- Role-based access control

## 💳 Payment Integration

The application integrates with Stripe for payment processing:

1. **Payment Intent Creation** - Creates payment intents for orders
2. **Payment Confirmation** - Confirms successful payments
3. **Webhook Handling** - Processes Stripe webhooks
4. **Refund Processing** - Handles refunds through Stripe

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
npm test
```

## 📦 Deployment

### Backend Deployment
1. Set up environment variables for production
2. Configure MongoDB connection
3. Set up Stripe webhook endpoints
4. Deploy to your preferred platform (Heroku, AWS, etc.)

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy the `build` folder to your hosting platform
3. Configure environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Add tests if applicable
5. Commit your changes: `git commit -m 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information

## 🙏 Acknowledgments

- React.js team for the amazing framework
- Express.js team for the web framework
- MongoDB team for the database
- Stripe team for payment processing
- All contributors and maintainers

---

**Happy Shopping! 🛍️**
