const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  schedule: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Schedule',
    required: [true, 'Schedule is required']
  },
  bus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bus',
    required: [true, 'Bus is required']
  },
  selectedSeats: [{
    type: String,
    required: [true, 'Selected seats are required']
  }],
  totalFare: {
    type: Number,
    required: [true, 'Total fare is required'],
    min: [0, 'Total fare must be at least 0']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  pnrNumber: {
    type: String,
    required: [true, 'PNR number is required'],
    unique: true
  }
}, {
  timestamps: true
});

// Create a compound index to prevent duplicate bookings for the same seats on the same schedule
bookingSchema.index({ schedule: 1, selectedSeats: 1 }, { unique: true });

module.exports = mongoose.model('Booking', bookingSchema);
