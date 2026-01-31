import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './routes/Home';
import Products from './routes/Products';
import About from './routes/About';
import Contact from './routes/Contact';
import LoginPage from './routes/LoginPage';
import RegisterPage from './routes/RegisterPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartItems from './components/CartItems';
import Orders from './routes/Orders';
import Checkout from './routes/Checkout';
import ScrollToTop from './components/ScrollToTop';
import ChatbotButton from './components/ChatbotButton';
import { CartProvider } from './context/CartContext';
import ProductDetail from './routes/ProductDetail';
import PaymentSuccess from './routes/PaymentSuccess';
import './styles/App.css';

function App() {
  return (
    <CartProvider>
      <Router>
        <ScrollToTop />
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/cart" element={<CartItems />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="*" element={<div className="not-found">Page not found</div>} />
          </Routes>
        </main>
        <Footer />
        <ChatbotButton />
      </Router>
    </CartProvider>
  );
}

export default App;