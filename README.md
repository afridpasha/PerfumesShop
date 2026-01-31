# 🌸 Perfume Shop - Luxury Fragrance E-Commerce Platform

<div align="center">

![Perfume Shop](https://img.shields.io/badge/Status-Production%20Ready-success)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)

**A modern, full-stack e-commerce platform for luxury perfumes with AI-powered chatbot, voice recognition, and seamless payment integration.**

[Live Demo](#) | [Documentation](#-documentation) | [Features](#-key-features) | [Deployment](#-deployment)

</div>

---

## 📖 Project Description

**Perfume Shop** is a comprehensive e-commerce web application designed for selling luxury perfumes online. Built with modern web technologies, it offers a seamless shopping experience with advanced features including:

- 🤖 **AI-Powered Chatbot** - Integrated with Google's Gemini API for intelligent customer assistance
- 🎤 **Voice Recognition** - Hands-free interaction using Web Speech API
- 💳 **Secure Payments** - Stripe integration for safe and reliable transactions
- 📱 **Responsive Design** - Optimized for all devices (mobile, tablet, desktop)
- 🎨 **Stunning Animations** - GSAP and Three.js for immersive user experience
- 🔐 **Secure Authentication** - JWT-based user authentication with role-based access
- 📧 **Newsletter System** - Email notifications for new products and promotions
- 🛒 **Advanced Cart** - Promo codes, shipping options, and real-time calculations
- 📦 **Order Management** - Complete order tracking and history

### 🎯 Project Goals

1. Provide an intuitive and elegant shopping experience for perfume enthusiasts
2. Demonstrate modern full-stack development practices
3. Implement cutting-edge features like AI chatbot and voice recognition
4. Ensure scalability and production-ready deployment
5. Maintain clean, maintainable, and well-documented code

### 👥 Target Audience

- Perfume enthusiasts looking for luxury fragrances
- Customers seeking personalized fragrance recommendations
- Users who value modern, interactive shopping experiences
- Mobile shoppers who need responsive, fast-loading interfaces

---

## 🛠️ Technology Stack

### Backend
- **Node.js** + **Express.js** - RESTful API server
- **MongoDB Atlas** - Cloud-hosted NoSQL database
- **Mongoose ODM** - Elegant MongoDB object modeling
- **JWT** - Secure authentication and authorization
- **bcryptjs** - Password hashing and security
- **Stripe** - Payment processing
- **Nodemailer** - Email notifications

### Frontend
- **React 18** - Modern UI library with hooks
- **React Router v6** - Client-side routing
- **Axios** - HTTP client for API calls
- **Context API** - Global state management
- **GSAP** - Professional-grade animations
- **Three.js** - 3D graphics and effects
- **SCSS** - Advanced styling with variables and mixins
- **Web Speech API** - Voice recognition

### AI & Advanced Features
- **Google Gemini API** - AI-powered chatbot responses
- **Web Speech API** - Voice input and text-to-speech
- **Stripe Checkout** - Secure payment processing
- **Geolocation API** - Auto-fill shipping addresses

### Development Tools
- **Git** - Version control
- **npm** - Package management
- **ESLint** - Code quality
- **Prettier** - Code formatting

---

## ✨ Key Features

### 🛍️ Shopping Experience
- **Product Catalog** - Browse 5+ luxury perfumes with detailed information
- **Advanced Search** - Filter by category, price, brand, and notes
- **Product Details** - Comprehensive information including fragrance notes, concentration, and reviews
- **Shopping Cart** - Add, remove, update quantities with real-time total calculations
- **Promo Codes** - Apply discount codes for special offers
- **Multiple Shipping Options** - Standard, Express, and Overnight delivery
- **Wishlist** - Save items for later

### 🤖 AI Chatbot
- **Intelligent Responses** - Powered by Google Gemini API
- **Product Recommendations** - AI suggests perfumes based on preferences
- **Order Assistance** - Help with orders, shipping, and general inquiries
- **Voice Input** - Speak to the chatbot using voice recognition
- **Text-to-Speech** - Chatbot can read responses aloud
- **Image Upload** - Share images for product identification
- **Camera Integration** - Take photos directly in the chat

### 🔐 User Management
- **Registration** - Create account with email verification
- **Login/Logout** - Secure JWT-based authentication
- **Profile Management** - Update personal information
- **Order History** - View all past orders with detailed tracking
- **Role-Based Access** - Admin and regular user roles

### 💳 Payment & Checkout
- **Stripe Integration** - Secure payment processing
- **Multiple Payment Methods** - Credit cards, debit cards
- **Order Confirmation** - Email receipts and confirmations
- **Tax Calculation** - Automatic tax computation
- **Shipping Calculator** - Real-time shipping cost calculation
- **Geolocation** - Auto-fill address using device location

### 📧 Communication
- **Newsletter Subscription** - Stay updated with new products
- **Contact Form** - Direct communication with support
- **Email Notifications** - Order confirmations and updates
- **Chatbot Support** - 24/7 AI-powered assistance

### 🎨 Design & UX
- **Responsive Design** - Works on all screen sizes
- **Smooth Animations** - GSAP-powered transitions
- **3D Effects** - Three.js visual enhancements
- **Modern UI** - Clean, elegant interface
- **Fast Loading** - Optimized performance
- **Accessibility** - WCAG compliant

---

## 📁 Project Structure

```
PerfumesProject/
├── client/                 # React Frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── animations/    # GSAP & Three.js animations
│   │   ├── assets/        # Images, icons, videos
│   │   ├── components/    # React components
│   │   ├── context/       # Context API (CartContext)
│   │   ├── routes/        # Page components
│   │   ├── styles/        # CSS/SCSS files
│   │   ├── utils/         # API, helpers, AI services
│   │   ├── config.js      # Configuration
│   │   ├── App.jsx        # Main app component
│   │   └── index.js       # Entry point
│   ├── .env               # Environment variables
│   └── package.json       # Dependencies
│
├── server/                # Node.js Backend
│   ├── config/           # Database configuration
│   ├── controllers/      # Route controllers
│   ├── data/             # Seed data
│   ├── middleware/       # Auth & error handling
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── utils/            # Helper functions
│   ├── server.js         # Server entry point
│   ├── .env              # Environment variables
│   └── package.json      # Dependencies
│
└── Documentation/
    ├── README.md                  # This file
    ├── RENDER_DEPLOYMENT.md       # Deployment guide
    ├── DEPLOYMENT_CHECKLIST.md    # Deployment checklist
    └── READY_TO_DEPLOY.md         # Final summary
```

---

## ⚡ Quick Setup (Development)

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (free tier available)
- Git

### Backend (Server)

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env` (if exists)
   - Update MongoDB Atlas connection string
   - Add Stripe keys and other credentials

4. Seed the database with sample data:
   ```bash
   npm run data:import
   ```
   This will import:
   - 3 users (1 admin, 2 regular users)
   - 5 perfumes with complete details

5. Run the backend development server:
   ```bash
   npm run dev
   ```
   Server will run on http://localhost:5000

### Frontend (Client)

1. Open a NEW terminal and navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Update `.env` with backend API URL
   - Add Stripe publishable key
   - Add Gemini API key

4. Run the frontend development server:
   ```bash
   npm start
   ```
   App will open at http://localhost:3000

---

## 🔐 Default Test Users

After running the data import script, you can log in with these accounts:

- **Admin User:**
  - Email: admin@example.com
  - Password: 123456
  - Full Access: Create, update, delete perfumes and manage users

- **Regular User:**
  - Email: john@example.com
  - Password: 123456
  - Can browse, review products, and manage cart

- **Regular User 2:**
  - Email: jane@example.com
  - Password: 123456

---

## 📡 API Endpoints

### Health Check
- GET /health - Server health status

### Authentication (`/api/auth`)
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user

### Perfumes (`/api/perfumes`)
- GET /api/perfumes - Get all perfumes (Public)
- GET /api/perfumes/:id - Get single perfume (Public)
- POST /api/perfumes - Create a perfume (Admin only)
- PUT /api/perfumes/:id - Update a perfume (Admin only)
- DELETE /api/perfumes/:id - Delete a perfume (Admin only)
- GET /api/perfumes/top - Get top rated perfumes (Public)
- POST /api/perfumes/:id/reviews - Create a review (Protected)

### Orders (`/api/orders`)
- POST /api/orders - Create new order (Protected)
- GET /api/orders/myorders - Get user's orders (Protected)
- GET /api/orders/:id - Get order by ID (Protected)

### Payment (`/api/payment`)
- POST /api/payment/create-checkout-session - Create Stripe checkout (Protected)

### Contact (`/api/contact`)
- POST /api/contact/send-message - Send contact message (Public)

### Newsletter (`/api/newsletter`)
- POST /api/newsletter/subscribe - Subscribe to newsletter (Public)

### Promo Codes (`/api/promo`)
- POST /api/promo/validate - Validate promo code (Public)

---

## 🎯 Advanced Features

### AI Chatbot
- **Google Gemini Integration** - Powered by Gemini 2.5 Flash model
- **Context-Aware Responses** - Understands product catalog and user queries
- **Fallback System** - Works even without API key
- **Multi-Modal Input** - Text, voice, and image support

### Voice Recognition
- **Web Speech API** - Browser-native voice recognition
- **Real-Time Transcription** - Live speech-to-text conversion
- **Multi-Language Support** - Configurable language settings
- **Error Handling** - Graceful fallback for unsupported browsers

### Payment Processing
- **Stripe Checkout** - Secure hosted payment page
- **Multiple Payment Methods** - Cards, digital wallets
- **Webhook Integration** - Real-time payment confirmations
- **Order Tracking** - Complete order lifecycle management

---

## 📦 Sample Data

The project includes 5 sample perfumes:
1. **Floral Elegance** - $89.99 (Rose, Jasmine, Lily)
2. **Ocean Breeze** - $75.50 (Sea Salt, Citrus, Mint)
3. **Midnight Mystery** - $120.00 (Vanilla, Amber, Musk)
4. **Citrus Splash** - $65.00 (Lemon, Orange, Grapefruit)
5. **Spice Harmony** - $95.00 (Sandalwood, Cedar, Spices)

Each perfume includes:
- Brand and category
- Detailed description
- Fragrance notes (top, middle, base)
- Concentration type
- Size options
- Stock availability
- Ratings and reviews

---

## 🔧 Development Commands

### Backend
```bash
npm start              # Production server
npm run dev            # Development server with auto-reload
npm run data:import    # Import sample data
npm run data:destroy   # Clear all data
```

### Frontend
```bash
npm start              # Development server
npm run build          # Production build
npm test               # Run tests
```

---

## 🚀 Deployment

### Production Deployment (Render)

This project is optimized for deployment on **Render** (free tier available).

**Quick Deploy Steps:**

1. **Backend (Web Service)**
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Add environment variables from `server/.env`

2. **Frontend (Static Site)**
   - Root Directory: `client`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `build`
   - Add environment variables from `client/.env`

**Complete Guide:** See [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md) for detailed instructions.

### Environment Variables

**Backend (.env)**:
```env
MONGO_URI=your_mongodb_atlas_uri
PORT=5000
NODE_ENV=production
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
FRONTEND_URL=your_frontend_url
CLIENT_URL=your_frontend_url
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

**Frontend (.env)**:
```env
REACT_APP_API_URL=your_backend_api_url
REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
REACT_APP_GEMINI_API_KEY=your_gemini_api_key
```

---

## 🧪 Testing

### Test Accounts
Use the default test users listed above for testing.

### Test Payment
Use Stripe test card:
- Card Number: `4242 4242 4242 4242`
- Expiry: Any future date
- CVC: Any 3 digits
- ZIP: Any 5 digits

### Test Promo Codes
Check `server/data/promoSeeder.js` for available promo codes.

---

## 🌐 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/health
- **API Test**: http://localhost:5000/api/perfumes

---

## 📋 Documentation

- 📖 [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md) - Complete Render deployment guide
- ✅ [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) - Pre-deployment checklist
- 🚀 [READY_TO_DEPLOY.md](READY_TO_DEPLOY.md) - Final deployment summary
- 🔧 [DEPLOYMENT_FIXES.md](DEPLOYMENT_FIXES.md) - All deployment fixes documented

---

## 📝 Important Notes

1. **Always start the backend server BEFORE the frontend**
2. **MongoDB Atlas** is configured and ready to use
3. The database name `perfume_shop` is included in the connection string
4. Run `npm run data:import` to populate the database with sample data
5. Use admin credentials to access admin features
6. All hardcoded URLs have been replaced with dynamic configuration
7. CORS is configured for multiple origins (development and production)

---

## 🆘 Troubleshooting

### Common Issues

**Backend won't start:**
- Check MongoDB Atlas connection string
- Ensure IP is whitelisted in MongoDB Atlas (use 0.0.0.0/0 for all IPs)
- Verify all environment variables are set

**Frontend can't connect to backend:**
- Ensure backend is running first
- Check `REACT_APP_API_URL` in client/.env
- Verify CORS settings in server/server.js

**Payment fails:**
- Use Stripe test cards for testing
- Check Stripe keys are correct
- Ensure user is logged in

**Chatbot not responding:**
- Check Gemini API key is valid
- Chatbot has fallback responses if API fails
- Check browser console for errors

**Voice input not working:**
- Allow microphone permissions in browser
- Voice input requires HTTPS (or localhost)
- Check browser compatibility (Chrome/Edge recommended)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Afrid Pasha**
- Email: afridpasha1983@gmail.com
- GitHub: [Your GitHub Profile]

---

## 🙏 Acknowledgments

- Google Gemini API for AI capabilities
- Stripe for payment processing
- MongoDB Atlas for database hosting
- Render for deployment platform
- React community for excellent documentation
- GSAP and Three.js for amazing animations

---

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact via email: afridpasha1983@gmail.com
- Check documentation files

---

<div align="center">

**Built with ❤️ using React, Node.js, and modern web technologies**

⭐ Star this repo if you find it helpful!

**Status: Production Ready | Version: 1.0.0 | License: MIT**

</div>
