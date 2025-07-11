import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getRides } from '../store/slices/rideSlice';
import { setActiveTab } from '../store/slices/uiSlice';
import Header from './Header';
import RiderDashboard from './RiderDashboard';
import DriverDashboard from './DriverDashboard';
import RideHistory from './RideHistory';
import Profile from './Profile';
import { Home, History, User, Car } from 'lucide-react';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { activeTab } = useSelector((state) => state.ui);

  useEffect(() => {
    dispatch(getRides());
  }, [dispatch]);

  const navigationItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'history', label: 'History', icon: History },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return user?.role === 'rider' ? <RiderDashboard /> : <DriverDashboard />;
      case 'history':
        return <RideHistory />;
      case 'profile':
        return <Profile />;
      default:
        return user?.role === 'rider' ? <RiderDashboard /> : <DriverDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-[calc(100vh-4rem)]">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                {user?.role === 'driver' ? (
                  <Car className="w-5 h-5 text-white" />
                ) : (
                  <User className="w-5 h-5 text-white" />
                )}
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{user?.name}</h3>
                <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>

            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => dispatch(setActiveTab(item.id))}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === item.id
                        ? 'bg-primary text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;