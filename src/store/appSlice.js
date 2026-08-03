import { createSlice } from '@reduxjs/toolkit';
import { isMobile } from '../utility/general';
import { getAppLanguage } from '../utility/language';

const appLanguage = getAppLanguage();

const initState = {
  userGroup: { list: [] },
  loginUser: { user: null },
  Dashboard: { selectedUser: { isLoading: true } },
  LmsDashboard: { selectedUser: { isLoading: true } },
  AppConfig: {
    topMenu: false,
    darkMode: appLanguage.darkMode,
    rtl: appLanguage.rtl,
    locale: appLanguage.key,
    isMobile: isMobile(),
    version: '',
    isMemberArea: false,
    isMultiPlatform: false,
  },
  products: [],
  sectionPlatform: {
    packages: null,
    dashboard: null,
    inbox: null,
    creditUsage: null,
    reports_summary: null,
    listing_reports: null,
    leads_reports: null,
  },
  monthRules: null,
  loading: false,
  error: null,
};

const appSlice = createSlice({
  name: 'app',
  initialState: initState,
  reducers: {
    setAppUser(state, { payload }) {
      state.loginUser.user = { ...state?.loginUser?.user, ...payload };
    },

    changeLayoutMode(state, { payload }) {
      state.AppConfig.darkMode = payload;
    },

    changeRtlMode(state, { payload }) {
      state.AppConfig.rtl = payload;
    },

    setMobile(state, { payload }) {
      state.AppConfig.isMobile = payload;
    },

    setLocale(state, { payload }) {
      state.AppConfig.locale = payload;
    },

    setVersion(state, { payload }) {
      state.AppConfig.version = payload;
    },

    setMemberArea(state, { payload }) {
      state.AppConfig.isMemberArea = payload;
    },

    setMultiPlatform(state, { payload }) {
      state.AppConfig.isMultiPlatform = payload;
    },

    setUsersList(state, { payload }) {
      state.userGroup.list = payload;
    },

    setProducts(state, { payload }) {
      state.products = payload;
    },

    setMonthRules(state, { payload }) {
      state.monthRules = payload;
    },

    setSectionPlatform(state, { payload }) {
      const { section, value } = payload || {};
      state.sectionPlatform[section] = value;
    },

    setAllSectionsPlatform(state, { payload }) {
      const value = payload?.value;
      Object.keys(state.sectionPlatform).forEach((section) => {
        state.sectionPlatform[section] = value;
      });
    },

    setDashboardSelectedUser(state, { payload }) {
      state.Dashboard.selectedUser = payload;
    },

    setLmsDashboardSelectedUser(state, { payload }) {
      state.LmsDashboard.selectedUser = payload;
    },
  },
});

export const {
  setMemberArea,
  setMultiPlatform,
  setAppUser,
  setUsersList,
  setProducts,
  setMonthRules,
  setDashboardSelectedUser,
  changeLayoutMode,
  changeRtlMode,
  setMobile,
  setLocale,
  setVersion,
  setSectionPlatform,
  setAllSectionsPlatform,
  setLmsDashboardSelectedUser,
} = appSlice.actions;

export default appSlice;
