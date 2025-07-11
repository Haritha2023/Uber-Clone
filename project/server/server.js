const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');

// Import routes
const authRoutes = require('./routes/auth');
const rideRoutes = require('./routes/rides');
const userRoutes = require('./routes/users');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/users', userRoutes);

// Socket.IO for real-time features
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Join room for ride updates
  socket.on('join-ride', (rideId) => {
    socket.join(rideId);
    console.log(`Socket ${socket.id} joined ride ${rideId}`);
  });

  // Handle driver location updates
  socket.on('driver-location', (data) => {
    socket.to(data.rideId).emit('driver-location-update', data);
  });

  // Handle ride status updates
  socket.on('ride-status', (data) => {
    socket.to(data.rideId).emit('ride-status-update', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});