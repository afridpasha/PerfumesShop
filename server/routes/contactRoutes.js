const express = require('express');
const router = express.Router();
const { sendMessage } = require('../controllers/contactController');

router.post('/send-message', sendMessage);

module.exports = router;