const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get available drivers
router.get('/drivers', auth, async (req, res) => {
  try {
    const { lat, lng } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ message: 'Location coordinates required' });
    }

    const drivers = await User.find({
      role: 'driver',
      isOnline: true,
      currentLocation: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: 10000 // 10km radius
        }
      }
    }).select('name phone vehicleInfo currentLocation rating');

    res.json(drivers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update driver location
router.put('/location', auth, async (req, res) => {
  try {
    const { lat, lng } = req.body;
    
    if (req.user.role !== 'driver') {
      return res.status(403).json({ message: 'Only drivers can update location' });
    }

    const user = await User.findById(req.user.userId);
    user.currentLocation = {
      type: 'Point',
      coordinates: [lng, lat]
    };
    
    await user.save();

    res.json({ message: 'Location updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Toggle driver online status
router.put('/online-status', auth, async (req, res) => {
  try {
    const { isOnline } = req.body;
    
    if (req.user.role !== 'driver') {
      return res.status(403).json({ message: 'Only drivers can update online status' });
    }

    const user = await User.findById(req.user.userId);
    user.isOnline = isOnline;
    await user.save();

    res.json({ message: 'Online status updated successfully', isOnline });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;