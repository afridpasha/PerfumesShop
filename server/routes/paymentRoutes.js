const express = require('express');
const router = express.Router();
const { createPaymentIntent, confirmPayment, createCheckoutSession } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create-payment-intent', protect, createPaymentIntent);
router.post('/confirm', protect, confirmPayment);
router.post('/create-checkout-session', protect, createCheckoutSession);

module.exports = router;
