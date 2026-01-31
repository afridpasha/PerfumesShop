const Newsletter = require('../models/Newsletter');
const nodemailer = require('nodemailer');

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Subscribe to newsletter
exports.subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    const existingSubscriber = await Newsletter.findOne({ email });
    if (existingSubscriber) {
      return res.status(400).json({ message: 'Email already subscribed' });
    }

    const subscriber = await Newsletter.create({ email });
    res.status(201).json({ message: 'Successfully subscribed to newsletter', subscriber });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Send email to all subscribers
exports.notifySubscribers = async (perfume) => {
  try {
    const subscribers = await Newsletter.find({});
    
    if (subscribers.length === 0) return;

    const emailList = subscribers.map(sub => sub.email).join(',');

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: emailList,
      subject: '🌸 New Fragrance Alert!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Perfume Added!</h2>
          <h3>${perfume.name}</h3>
          <p><strong>Brand:</strong> ${perfume.brand}</p>
          <p><strong>Price:</strong> $${perfume.price}</p>
          <p>${perfume.description}</p>
          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/perfumes/${perfume._id}" 
             style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
            View Perfume
          </a>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Newsletter sent to all subscribers');
  } catch (error) {
    console.error('Error sending newsletter:', error);
  }
};
