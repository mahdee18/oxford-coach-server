const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createBooking } = require('../controllers/bookingController');

// Create a new booking
router.post('/', protect, createBooking);

module.exports = router;
