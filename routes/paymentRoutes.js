const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createPaymentIntent, confirmPayment } = require('../controllers/paymentController');

// Create a payment intent
router.post('/create-payment-intent', protect, createPaymentIntent);

// Confirm payment
router.post('/confirm-payment', protect, confirmPayment);

module.exports = router;
