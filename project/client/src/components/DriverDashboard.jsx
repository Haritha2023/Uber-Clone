import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { MapPin, Navigation, Clock, DollarSign, User, Phone, Car } from 'lucide-react';

const DriverDashboard = () => {
  const { rides } = useSelector((state) => state.ride);
  const [isOnline, setIsOnline] = useState(false);

  const pendingRides = rides.filter(ride => ride.status === 'pending');
  const activeRide = rides.find(ride => ride.status === 'accepted' || ride.status === 'in-progress');

  const handleToggleOnline = () => {
    setIsOnline(!isOnline);
    // In real app, you'd dispatch an action to update online status
  };

  if (activeRide) {
    return <ActiveRideDriver ride={activeRide} />;
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Driver Dashboard</h2>
              <p className="text-gray-600">Find and accept ride requests</p>
            </div>
            <button
              onClick={handleToggleOnline}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                isOnline
                  ? 'bg-accent text-white hover:bg-green-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {isOnline ? 'Go Offline' : 'Go Online'}
            </button>
          </div>
        </div>

        {!isOnline ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Car className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">You're offline</h3>
            <p className="text-gray-600 mb-4">Turn on to start receiving ride requests</p>
            <button
              onClick={handleToggleOnline}
              className="btn-accent"
            >
              Go Online
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Ride Requests */}
            <div className="lg:col-span-2">
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Available Rides ({pendingRides.length})
                </h3>
                
                {pendingRides.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No ride requests at the moment</p>
                    <p className="text-sm text-gray-400 mt-2">Stay online to receive new requests</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingRides.map((ride) => (
                      <RideRequestCard key={ride._id} ride={ride} />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Driver Stats */}
            <div className="space-y-6">
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-5 h-5 text-accent" />
                      <span className="text-gray-600">Earnings</span>
                    </div>
                    <span className="font-medium text-gray-900">$127.50</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Navigation className="w-5 h-5 text-blue-500" />
                      <span className="text-gray-600">Rides</span>
                    </div>
                    <span className="font-medium text-gray-900">8</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-purple-500" />
                      <span className="text-gray-600">Online</span>
                    </div>
                    <span className="font-medium text-gray-900">4h 32m</span>
                  </div>
                </div>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full btn-secondary">
                    View Earnings
                  </button>
                  <button className="w-full btn-secondary">
                    Navigation
                  </button>
                  <button className="w-full btn-secondary">
                    Support
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const RideRequestCard = ({ ride }) => {
  const handleAcceptRide = () => {
    // In real app, you'd dispatch acceptRide action
    console.log('Accepting ride:', ride._id);
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900">{ride.rider?.name}</h4>
            <p className="text-sm text-gray-500">{ride.rider?.phone}</p>
          </div>
        </div>
        <span className="text-lg font-bold text-accent">
          ${ride.fare?.total?.toFixed(2) || '0.00'}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-start space-x-2">
          <MapPin className="w-4 h-4 text-green-500 mt-1" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Pickup</p>
            <p className="text-sm text-gray-600">{ride.pickupLocation.address}</p>
          </div>
        </div>
        <div className="flex items-start space-x-2">
          <Navigation className="w-4 h-4 text-red-500 mt-1" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Destination</p>
            <p className="text-sm text-gray-600">{ride.dropoffLocation.address}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <span>{ride.fare?.distance?.toFixed(1) || '0.0'} km</span>
          <span>{ride.estimatedDuration || 'N/A'} min</span>
        </div>
        <button
          onClick={handleAcceptRide}
          className="btn-accent text-sm px-4 py-2"
        >
          Accept
        </button>
      </div>
    </div>
  );
};

const ActiveRideDriver = ({ ride }) => {
  const statusColors = {
    accepted: 'bg-blue-100 text-blue-800',
    'in-progress': 'bg-green-100 text-green-800',
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Active Ride</h2>
          <p className="text-gray-600">Complete your current ride</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Ride Details</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[ride.status]}`}>
                  {ride.status.replace('-', ' ').toUpperCase()}
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-green-500 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Pickup Location</p>
                    <p className="text-gray-600">{ride.pickupLocation.address}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Navigation className="w-5 h-5 text-red-500 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Destination</p>
                    <p className="text-gray-600">{ride.dropoffLocation.address}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">Passenger Information</h4>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{ride.rider?.name}</p>
                    <p className="text-sm text-gray-500">{ride.rider?.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Trip Info</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Fare</span>
                  <span className="font-medium">${ride.fare?.total?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Distance</span>
                  <span className="font-medium">{ride.fare?.distance?.toFixed(1) || '0.0'} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium">{ride.estimatedDuration || 'N/A'} min</span>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                <button className="w-full btn-secondary flex items-center justify-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>Call Passenger</span>
                </button>
                <button className="w-full btn-secondary">
                  Navigate
                </button>
                {ride.status === 'accepted' && (
                  <button className="w-full btn-accent">
                    Start Trip
                  </button>
                )}
                {ride.status === 'in-progress' && (
                  <button className="w-full btn-accent">
                    Complete Trip
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;