const bcrypt = require('bcryptjs');

const users = [
  {
    fullName: 'Admin User',
    email: 'admin@example.com',
    password: bcrypt.hashSync('123456', 10),
    phoneNumber: '1234567890',
    isAdmin: true,
  },
  {
    fullName: 'John Doe',
    email: 'john@example.com',
    password: bcrypt.hashSync('123456', 10),
    phoneNumber: '9876543210',
    isAdmin: false,
  },
  {
    fullName: 'Jane Smith',
    email: 'jane@example.com',
    password: bcrypt.hashSync('123456', 10),
    phoneNumber: '5555555555',
    isAdmin: false,
  },
];

module.exports = users; 