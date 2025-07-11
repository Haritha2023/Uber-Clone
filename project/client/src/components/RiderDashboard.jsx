import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createRide } from '../store/slices/rideSlice';
import { MapPin, Navigation, CreditCard, Clock, DollarSign, Car, User } from 'lucide-react';

const RiderDashboard = () => {
  const dispatch = useDispatch();
  const { currentRide, isLoading } = useSelector((state) => state.ride);
  const [rideRequest, setRideRequest] = useState({
    pickupLocation: { address: '', coordinates: [0, 0] },
    dropoffLocation: { address: '', coordinates: [0, 0] },
    paymentMethod: 'card'
  });

  const handleLocationChange = (field, value) => {
    setRideRequest(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        address: value
      }
    }));
  };

  const handleRequestRide = () => {
    // Simulate coordinates (in real app, you'd use Google Maps API)
    const updatedRequest = {
      ...rideRequest,
      pickupLocation: {
        ...rideRequest.pickupLocation,
        coordinates: [-74.006, 40.7128] // Example NYC coordinates
      },
      dropoffLocation: {
        ...rideRequest.dropoffLocation,
        coordinates: [-74.0060, 40.7489] // Example NYC coordinates
      }
    };

    dispatch(createRide(updatedRequest));
  };

  if (currentRide && currentRide.status !== 'completed') {
    return <ActiveRide ride={currentRide} />;
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Book a Ride</h2>
          <p className="text-gray-600">Where would you like to go?</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Ride Booking Form */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="space-y-6">
                {/* Pickup Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pickup Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-green-500" />
                    <input
                      type="text"
                      value={rideRequest.pickupLocation.address}
                      onChange={(e) => handleLocationChange('pickupLocation', e.target.value)}
                      className="input-field pl-10"
                      placeholder="Enter pickup location"
                    />
                  </div>
                </div>

                {/* Dropoff Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dropoff Location
                  </label>
                  <div className="relative">
                    <Navigation className="absolute left-3 top-3 w-5 h-5 text-red-500" />
                    <input
                      type="text"
                      value={rideRequest.dropoffLocation.address}
                      onChange={(e) => handleLocationChange('dropoffLocation', e.target.value)}
                      className="input-field pl-10"
                      placeholder="Enter destination"
                    />
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {['card', 'cash', 'digital-wallet'].map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setRideRequest(prev => ({ ...prev, paymentMethod: method }))}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          rideRequest.paymentMethod === method
                            ? 'border-primary bg-primary text-white'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <CreditCard className="w-5 h-5 mx-auto mb-1" />
                        <span className="text-sm font-medium capitalize">
                          {method.replace('-', ' ')}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleRequestRide}
                  disabled={isLoading || !rideRequest.pickupLocation.address || !rideRequest.dropoffLocation.address}
                  className="w-full btn-primary disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Requesting Ride...</span>
                    </>
                  ) : (
                    <>
                      <Car className="w-5 h-5" />
                      <span>Request Ride</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Ride Options */}
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ride Options</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-primary transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <Car className="w-6 h-6 text-primary" />
                    <div>
                      <h4 className="font-medium text-gray-900">UberX</h4>
                      <p className="text-sm text-gray-500">1-4 passengers</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">$12.50</p>
                    <p className="text-sm text-gray-500">5 min away</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-primary transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <Car className="w-6 h-6 text-primary" />
                    <div>
                      <h4 className="font-medium text-gray-900">UberXL</h4>
                      <p className="text-sm text-gray-500">1-6 passengers</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">$18.75</p>
                    <p className="text-sm text-gray-500">7 min away</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full btn-secondary flex items-center justify-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Schedule Ride</span>
                </button>
                <button className="w-full btn-secondary flex items-center justify-center space-x-2">
                  <DollarSign className="w-4 h-4" />
                  <span>Price Estimate</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ActiveRide = ({ ride }) => {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    accepted: 'bg-blue-100 text-blue-800',
    'in-progress': 'bg-green-100 text-green-800',
    completed: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Ride</h2>
          <p className="text-gray-600">Track your ride in real-time</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Ride Status</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[ride.status]}`}>
                  {ride.status.replace('-', ' ').toUpperCase()}
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-green-500 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Pickup</p>
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

              {ride.driver && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3">Driver Information</h4>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{ride.driver.name}</p>
                      <p className="text-sm text-gray-500">{ride.driver.phone}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ride Details</h3>
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
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment</span>
                  <span className="font-medium capitalize">{ride.paymentMethod}</span>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                <button className="w-full btn-secondary">
                  Call Driver
                </button>
                <button className="w-full btn-secondary">
                  Message Driver
                </button>
                {ride.status === 'pending' && (
                  <button className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                    Cancel Ride
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

export default RiderDashboard;