const PromoCode = require('../models/PromoCode');

// @desc    Validate promo code
// @route   POST /api/promo/validate
// @access  Public
const validatePromoCode = async (req, res) => {
  try {
    const { code, orderAmount } = req.body;
    
    console.log('Validating promo code:', code, 'Order amount:', orderAmount);

    const promoCode = await PromoCode.findOne({ 
      code: code.toUpperCase()
    });

    console.log('Found promo code:', promoCode);

    if (!promoCode) {
      return res.status(400).json({ message: 'Invalid promo code' });
    }

    if (!promoCode.isActive) {
      return res.status(400).json({ message: 'Promo code is inactive' });
    }

    if (new Date() > new Date(promoCode.expiryDate)) {
      console.log('Current date:', new Date());
      console.log('Expiry date:', new Date(promoCode.expiryDate));
      return res.status(400).json({ message: 'Promo code has expired' });
    }

    if (promoCode.usageLimit && promoCode.usedCount >= promoCode.usageLimit) {
      return res.status(400).json({ message: 'Promo code usage limit exceeded' });
    }

    if (orderAmount < promoCode.minOrderAmount) {
      return res.status(400).json({ 
        message: `Minimum order amount of $${promoCode.minOrderAmount} required` 
      });
    }

    let discountAmount = 0;
    if (promoCode.discountType === 'percentage') {
      discountAmount = (orderAmount * promoCode.discountValue) / 100;
      if (promoCode.maxDiscount && discountAmount > promoCode.maxDiscount) {
        discountAmount = promoCode.maxDiscount;
      }
    } else {
      discountAmount = promoCode.discountValue;
    }

    console.log('Discount calculated:', discountAmount);

    // Update usage count
    await PromoCode.findByIdAndUpdate(promoCode._id, {
      $inc: { usedCount: 1 }
    });

    res.json({
      success: true,
      valid: true,
      discountAmount,
      discountType: promoCode.discountType,
      discountValue: promoCode.discountValue,
      code: promoCode.code
    });
  } catch (error) {
    console.error('Promo code validation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  validatePromoCode
};