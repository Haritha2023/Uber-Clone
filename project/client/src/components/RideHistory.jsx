import React from 'react';
import { useSelector } from 'react-redux';
import { MapPin, Navigation, Clock, DollarSign, Star, User } from 'lucide-react';

const RideHistory = () => {
  const { rides } = useSelector((state) => state.ride);
  const { user } = useSelector((state) => state.auth);

  const completedRides = rides.filter(ride => ride.status === 'completed');

  if (completedRides.length === 0) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Ride History</h2>
            <p className="text-gray-600">View all your past rides</p>
          </div>

          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No rides yet</h3>
            <p className="text-gray-600">Your completed rides will appear here</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Ride History</h2>
          <p className="text-gray-600">View all your past rides</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {completedRides.map((ride) => (
                <RideHistoryCard key={ride._id} ride={ride} userRole={user?.role} />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Navigation className="w-5 h-5 text-primary" />
                    <span className="text-gray-600">Total Rides</span>
                  </div>
                  <span className="font-medium text-gray-900">{completedRides.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5 text-accent" />
                    <span className="text-gray-600">Total Spent</span>
                  </div>
                  <span className="font-medium text-gray-900">
                    ${completedRides.reduce((sum, ride) => sum + (ride.fare?.total || 0), 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <span className="text-gray-600">Avg Rating</span>
                  </div>
                  <span className="font-medium text-gray-900">4.9</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const RideHistoryCard = ({ ride, userRole }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const otherUser = userRole === 'rider' ? ride.driver : ride.rider;

  return (
    <div className="card">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <Navigation className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900">
              {userRole === 'rider' ? 'Ride' : 'Trip'} #{ride._id.slice(-6)}
            </h4>
            <p className="text-sm text-gray-500">{formatDate(ride.createdAt)}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-medium text-gray-900">${ride.fare?.total?.toFixed(2) || '0.00'}</p>
          <div className="flex items-center space-x-1 mt-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-sm text-gray-500">4.9</span>
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-start space-x-2">
          <MapPin className="w-4 h-4 text-green-500 mt-1" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">From</p>
            <p className="text-sm text-gray-600">{ride.pickupLocation.address}</p>
          </div>
        </div>
        <div className="flex items-start space-x-2">
          <Navigation className="w-4 h-4 text-red-500 mt-1" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">To</p>
            <p className="text-sm text-gray-600">{ride.dropoffLocation.address}</p>
          </div>
        </div>
      </div>

      {otherUser && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-500" />
            </div>
            <span className="text-sm text-gray-700">
              {userRole === 'rider' ? 'Driver' : 'Passenger'}: {otherUser.name}
            </span>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>{ride.fare?.distance?.toFixed(1) || '0.0'} km</span>
            <span>{ride.actualDuration || ride.estimatedDuration || 'N/A'} min</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RideHistory;