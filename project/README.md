# Uber Clone Full-Stack Application

A full-featured Uber clone built with React, Node.js, Express, and MongoDB.

## Features

- **User Authentication** - Register/Login for both riders and drivers
- **Real-time Ride Booking** - Request rides with live updates
- **Driver Dashboard** - Accept rides, track earnings, manage availability
- **Rider Dashboard** - Book rides, track driver location, payment options
- **Ride History** - View past rides and ratings
- **Profile Management** - Update user information and preferences

## Tech Stack

### Frontend (Client)
- React 18 with JavaScript
- Redux Toolkit for state management
- Tailwind CSS for styling
- Lucide React for icons
- Socket.IO client for real-time features
- Axios for API calls
- Vite for development and building

### Backend (Server)
- Node.js with Express.js
- MongoDB with Mongoose
- JWT authentication
- Socket.IO for real-time communication
- bcryptjs for password hashing
- CORS for cross-origin requests

## Project Structure

```
uber-clone/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── store/         # Redux store and slices
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── package.json
│   └── vite.config.js
├── server/                 # Node.js backend
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── server.js          # Server entry point
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd uber-clone
   ```

2. **Install dependencies for both client and server**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the `server` directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/uber-clone
   JWT_SECRET=your-super-secret-jwt-key
   PORT=5000
   ```

4. **Start the development servers**
   
   **Option 1: Start both servers simultaneously**
   ```bash
   # Install concurrently globally if not already installed
   npm install -g concurrently
   
   # Start both client and server
   concurrently "npm run server" "npm run dev"
   ```
   
   **Option 2: Start servers separately**
   
   Terminal 1 (Backend):
   ```bash
   npm run server
   ```
   
   Terminal 2 (Frontend):
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Rides
- `POST /api/rides` - Create ride request
- `GET /api/rides` - Get user's rides
- `PUT /api/rides/:id/accept` - Accept ride (driver)
- `PUT /api/rides/:id/status` - Update ride status

### Users
- `GET /api/users/drivers` - Get available drivers
- `PUT /api/users/location` - Update driver location
- `PUT /api/users/online-status` - Toggle driver online status

## Features Overview

### For Riders
- Create account and login
- Book rides by entering pickup and destination
- Choose payment method (card, cash, digital wallet)
- Track ride status in real-time
- View ride history and ratings
- Manage profile information

### For Drivers
- Create driver account with vehicle information
- Toggle online/offline status
- View and accept ride requests
- Track earnings and ride statistics
- Update location and availability
- Manage profile and vehicle details

## Real-time Features

The application uses Socket.IO for real-time communication:
- Live ride status updates
- Driver location tracking
- Instant notifications for new ride requests
- Real-time ride matching

## Development

### Client Development
```bash
cd client
npm run dev
```

### Server Development
```bash
cd server
npm run dev
```

### Building for Production
```bash
cd client
npm run build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational purposes only.