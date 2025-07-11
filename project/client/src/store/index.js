import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import rideSlice from './slices/rideSlice';
import uiSlice from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    ride: rideSlice,
    ui: uiSlice,
  },
});

export default store;