const Booking = require('../models/Booking');
const Schedule = require('../models/Schedule');
const Bus = require('../models/Bus');

// Generate a simple random PNR number
const generatePNR = () => {
  return 'PNR' + Math.random().toString(36).substring(2, 9).toUpperCase();
};

// Create a new booking
const createBooking = async (req, res) => {
  try {
    const { scheduleId, selectedSeats } = req.body;
    
    // Validate input
    if (!scheduleId || !selectedSeats || !Array.isArray(selectedSeats) || selectedSeats.length === 0) {
      return res.status(400).json({ message: 'Schedule ID and selected seats are required' });
    }

    // Fetch schedule details
    const schedule = await Schedule.findById(scheduleId);
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    // Fetch bus details
    const bus = await Bus.findById(schedule.bus);
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }

    // Calculate total fare
    const totalFare = schedule.fare * selectedSeats.length;

    // Generate unique PNR number
    let pnrNumber;
    let pnrExists = true;
    let attempts = 0;
    const maxAttempts = 10;

    // Ensure PNR number is unique
    while (pnrExists && attempts < maxAttempts) {
      pnrNumber = generatePNR();
      const existingBooking = await Booking.findOne({ pnrNumber });
      pnrExists = !!existingBooking;
      attempts++;
    }

    if (pnrExists) {
      return res.status(500).json({ message: 'Could not generate unique PNR number' });
    }

    // Create new booking
    const booking = new Booking({
      user: req.user.id,
      schedule: scheduleId,
      bus: schedule.bus,
      selectedSeats,
      totalFare,
      status: 'pending',
      pnrNumber
    });

    // Save booking to database
    await booking.save();

    // Populate user, schedule and bus details
    await booking.populate('user', 'name email');
    await booking.populate('schedule', 'source destination departureTime fare');
    await booking.populate('bus', 'name operator busType');

    res.status(201).json({
      success: true,
      booking
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createBooking
};
