const mongoose = require('mongoose');
const dotenv = require('dotenv');
const PromoCode = require('../models/PromoCode');

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const promoCodes = [
  {
    code: 'WELCOME10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 50,
    maxDiscount: 20,
    usageLimit: 100,
    expiryDate: new Date('2027-12-31')
  },
  {
    code: 'SAVE20',
    discountType: 'fixed',
    discountValue: 20,
    minOrderAmount: 100,
    usageLimit: 50,
    expiryDate: new Date('2027-12-31')
  },
  {
    code: 'PERFUME25',
    discountType: 'percentage',
    discountValue: 25,
    minOrderAmount: 150,
    maxDiscount: 50,
    usageLimit: 30,
    expiryDate: new Date('2027-12-31')
  },
  {
    code: 'FIRST15',
    discountType: 'percentage',
    discountValue: 15,
    minOrderAmount: 75,
    maxDiscount: 30,
    usageLimit: 200,
    expiryDate: new Date('2027-12-31')
  }
];

const importData = async () => {
  try {
    await connectDB();
    
    await PromoCode.deleteMany();
    await PromoCode.insertMany(promoCodes);
    
    console.log('Promo codes imported successfully');
    process.exit();
  } catch (error) {
    console.error('Error importing promo codes:', error);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}

async function destroyData() {
  try {
    await connectDB();
    await PromoCode.deleteMany();
    console.log('Promo codes destroyed');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}