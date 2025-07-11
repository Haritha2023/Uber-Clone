const express = require('express');
const Ride = require('../models/Ride');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Create new ride request
router.post('/', auth, async (req, res) => {
  try {
    const { pickupLocation, dropoffLocation, paymentMethod } = req.body;

    // Calculate fare (simplified calculation)
    const distance = calculateDistance(
      pickupLocation.coordinates,
      dropoffLocation.coordinates
    );
    const baseFare = 3.00;
    const perKmRate = 1.50;
    const total = baseFare + (distance * perKmRate);

    const ride = new Ride({
      rider: req.user.userId,
      pickupLocation,
      dropoffLocation,
      paymentMethod,
      fare: {
        baseFare,
        distance,
        total
      },
      estimatedDuration: Math.ceil(distance * 2) // rough estimate
    });

    await ride.save();
    await ride.populate('rider', 'name phone');

    res.status(201).json({
      message: 'Ride request created successfully',
      ride
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get rides for user
router.get('/', auth, async (req, res) => {
  try {
    const query = req.user.role === 'rider' 
      ? { rider: req.user.userId }
      : { driver: req.user.userId };

    const rides = await Ride.find(query)
      .populate('rider', 'name phone')
      .populate('driver', 'name phone vehicleInfo')
      .sort({ createdAt: -1 });

    res.json(rides);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Accept ride (driver)
router.put('/:rideId/accept', auth, async (req, res) => {
  try {
    if (req.user.role !== 'driver') {
      return res.status(403).json({ message: 'Only drivers can accept rides' });
    }

    const ride = await Ride.findById(req.params.rideId);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    if (ride.status !== 'pending') {
      return res.status(400).json({ message: 'Ride already accepted or completed' });
    }

    ride.driver = req.user.userId;
    ride.status = 'accepted';
    await ride.save();

    await ride.populate('rider', 'name phone');
    await ride.populate('driver', 'name phone vehicleInfo');

    res.json({
      message: 'Ride accepted successfully',
      ride
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update ride status
router.put('/:rideId/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const ride = await Ride.findById(req.params.rideId);

    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    // Check if user is authorized to update this ride
    if (ride.rider.toString() !== req.user.userId && 
        ride.driver.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    ride.status = status;
    if (status === 'completed') {
      ride.actualDuration = Math.ceil((Date.now() - ride.createdAt) / 60000);
    }

    await ride.save();
    await ride.populate('rider', 'name phone');
    await ride.populate('driver', 'name phone vehicleInfo');

    res.json({
      message: 'Ride status updated successfully',
      ride
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Helper function to calculate distance between two points
function calculateDistance(coord1, coord2) {
  const R = 6371; // Earth's radius in km
  const dLat = (coord2[1] - coord1[1]) * Math.PI / 180;
  const dLon = (coord2[0] - coord1[0]) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(coord1[1] * Math.PI / 180) * Math.cos(coord2[1] * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

module.exports = router;