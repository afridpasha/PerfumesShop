const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Perfume = require('../models/Perfume');
const users = require('./users');
const perfumes = require('./perfumes');
const connectDB = require('../config/db');

dotenv.config();

const importData = async () => {
  try {
    await connectDB();
    
    console.log('Clearing existing data...');
    await User.deleteMany();
    await Perfume.deleteMany();

    console.log('Importing users...');
    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id;

    console.log('Importing perfumes...');
    const samplePerfumes = perfumes.map((perfume) => {
      return { ...perfume, user: adminUser };
    });

    await Perfume.insertMany(samplePerfumes);

    console.log('✅ Data Imported Successfully!');
    console.log(`✅ ${createdUsers.length} users imported`);
    console.log(`✅ ${samplePerfumes.length} perfumes imported`);
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();
    
    console.log('Destroying data...');
    await User.deleteMany();
    await Perfume.deleteMany();

    console.log('✅ Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
} 