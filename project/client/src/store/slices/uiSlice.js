import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    isMapVisible: false,
    activeTab: 'home',
    notifications: [],
    isLoading: false,
  },
  reducers: {
    setMapVisible: (state, action) => {
      state.isMapVisible = action.payload;
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        ...action.payload,
      });
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setMapVisible,
  setActiveTab,
  addNotification,
  removeNotification,
  setLoading,
} = uiSlice.actions;

export default uiSlice.reducer;