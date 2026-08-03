import { combineReducers, configureStore } from '@reduxjs/toolkit';
import parentApi from './parentApi';
import authApi from './authApi';
import appReducer from './appSlice';
import authReducer from './authSlice';

// The whole Redux tree (including KC access/id/refresh tokens in state.auth) used
// to be mirrored to localStorage['state'] on every dispatch, but it was never read
// back — a dead write that only exposed long-lived tokens to XSS/shared devices.
// Persistence is removed; purge any value left by older app versions.
try {
  localStorage.removeItem('state');
} catch (e) {
  /* localStorage unavailable */
}

const reducers = combineReducers({
  [authApi.reducerPath]: authApi.reducer,
  [parentApi.reducerPath]: parentApi.reducer,
  [appReducer.name]: appReducer.reducer,
  [authReducer.name]: authReducer.reducer,
});

const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(authApi.middleware, parentApi.middleware),
  devTools: process.env.REACT_APP_ENVIRONMENT === 'development',
});

export default store;
