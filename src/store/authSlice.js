import tenantConstants from '@constants';
import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

const getToken = () => Cookies.get(tenantConstants.AUTH_TOKEN_COOKIE_KEY);

const initState = {
  login: {
    token: tenantConstants.KC_ENABLED ? false : getToken(),
    authenticated: tenantConstants.KC_ENABLED ? false : getToken(),
    initialized: !tenantConstants.KC_ENABLED,
  },
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initState,
  reducers: {
    setAppTokens(state, { payload }) {
      state.login = payload;
    },
    removeAppTokens(state, {}) {
      state.login = { token: null, authenticated: false };
    },
  },
});

export const { setAppTokens, removeAppTokens } = authSlice.actions;

export default authSlice;
