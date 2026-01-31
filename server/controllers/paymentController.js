const Stripe = require('stripe');

// Initialize Stripe instance when needed
const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('Stripe is not configured');
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY);
};

// @desc    Create payment intent
// @route   POST /api/payment/create-payment-intent
// @access  Private
const createPaymentIntent = async (req, res) => {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({ 
        message: 'Stripe is not configured. Please add STRIPE_SECRET_KEY to .env file' 
      });
    }

    const stripe = getStripe();
    const { amount, currency = 'usd' } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        created_at: new Date().toISOString()
      }
    });

    console.log('Payment intent created:', paymentIntent.id);

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Payment intent error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Confirm payment
// @route   POST /api/payment/confirm
// @access  Private
const confirmPayment = async (req, res) => {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({ 
        message: 'Stripe is not configured. Please add STRIPE_SECRET_KEY to .env file' 
      });
    }

    const stripe = getStripe();
    const { paymentIntentId } = req.body;

    console.log('Attempting to retrieve payment intent:', paymentIntentId);
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    res.json({
      status: paymentIntent.status,
      amount: paymentIntent.amount / 100,
    });
  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create checkout session
// @route   POST /api/payment/create-checkout-session
// @access  Private
const createCheckoutSession = async (req, res) => {
  try {
    const stripe = getStripe();
    const { items, customerInfo } = req.body;

    const lineItems = items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:3000'}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:3000'}/checkout`,
      customer_email: customerInfo.email,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Checkout session error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPaymentIntent,
  confirmPayment,
  createCheckoutSession,
};