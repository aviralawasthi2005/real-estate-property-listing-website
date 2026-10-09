import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    updateUserStart: (state) => {
      state.loading = true;
    },
    updateUserSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    deleteUserStart: (state) => {
      state.loading = true;
    },
    deleteUserSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    deleteUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    signOutUserStart: (state) => {
      state.loading = true;
    },
    signOutUserSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    signOutUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    upgradeSubscription: (state, action) => {
      if (state.currentUser) {
        state.currentUser = {
          ...state.currentUser,
          isPremium: true,
          subscriptionTier: action.payload.tier || 'pro',
          subscriptionPeriod: action.payload.period || 'monthly',
          subscriptionExpiresAt: action.payload.expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          subscriptionAmount: action.payload.price || 999,
          subscriptionUpdated: new Date().toISOString(),
        };
      }
    },
    cancelSubscription: (state) => {
      if (state.currentUser) {
        state.currentUser = {
          ...state.currentUser,
          isPremium: false,
          subscriptionTier: 'free',
          subscriptionPeriod: null,
          subscriptionExpiresAt: null,
        };
      }
    },
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  updateUserFailure,
  updateUserSuccess,
  updateUserStart,
  deleteUserFailure,
  deleteUserSuccess,
  deleteUserStart,
  signOutUserFailure,
  signOutUserSuccess,
  signOutUserStart,
  upgradeSubscription,
  cancelSubscription,
} = userSlice.actions;

export default userSlice.reducer;
