import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/rides';

// Async thunks
export const createRide = createAsyncThunk(
  'ride/create',
  async (rideData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(API_URL, rideData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const getRides = createAsyncThunk(
  'ride/getRides',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const acceptRide = createAsyncThunk(
  'ride/accept',
  async (rideId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/${rideId}/accept`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const updateRideStatus = createAsyncThunk(
  'ride/updateStatus',
  async ({ rideId, status }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/${rideId}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const rideSlice = createSlice({
  name: 'ride',
  initialState: {
    rides: [],
    currentRide: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    setCurrentRide: (state, action) => {
      state.currentRide = action.payload;
    },
    updateRideInList: (state, action) => {
      const index = state.rides.findIndex(ride => ride._id === action.payload._id);
      if (index !== -1) {
        state.rides[index] = action.payload;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create ride
      .addCase(createRide.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createRide.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentRide = action.payload.ride;
        state.rides.unshift(action.payload.ride);
      })
      .addCase(createRide.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get rides
      .addCase(getRides.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getRides.fulfilled, (state, action) => {
        state.isLoading = false;
        state.rides = action.payload;
      })
      .addCase(getRides.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Accept ride
      .addCase(acceptRide.fulfilled, (state, action) => {
        state.currentRide = action.payload.ride;
        const index = state.rides.findIndex(ride => ride._id === action.payload.ride._id);
        if (index !== -1) {
          state.rides[index] = action.payload.ride;
        }
      })
      // Update ride status
      .addCase(updateRideStatus.fulfilled, (state, action) => {
        state.currentRide = action.payload.ride;
        const index = state.rides.findIndex(ride => ride._id === action.payload.ride._id);
        if (index !== -1) {
          state.rides[index] = action.payload.ride;
        }
      });
  },
});

export const { setCurrentRide, updateRideInList, clearError } = rideSlice.actions;
export default rideSlice.reducer;