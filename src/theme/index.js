import chroma from 'chroma-js';
import { getColors, TENANT_KEY } from '../utility/env.js';

const themeColors = {
  gray900: '#4f4f4f',
  gray800: '#626262',
  gray700: '#707070',
  gray600: '#9D9D9D',
  gray550: '#BABABA',
  gray500: '#C2C2C2',
  gray400: '#DEDEDE',
  gray300: '#E6E6E6',
  gray200: '#f5f5f5',
  gray100: '#f0f0f0',

  primaryColor: '#006169',
  primaryHover: '#006169',
  primaryLight: '#F7FCFC',
  primaryLight1: '#A6C8CA',
  primaryLight2: '#CCDFE1',
  primaryLight3: '#E1F2F0',
  primaryLight4: '#F2FAFA',

  secondaryColor: '#28b16d',
  secondaryHover: '#28b16d',
  linkColor: '#1890ff',
  linkHover: '#0D79DF',
  baseColor: '#222',
  headingColor: '#222',
  successColor: '#28b16d',
  successHover: '#0CAB7C',
  warningColor: '#f0a742',
  warningHover: '#D47407',
  dangerColor: '#f73131',
  errorColor: '#f73131',
  errorHover: '#df4d4f',
  infoColor: '#2C99FF',
  infoHover: '#0D79DF',
  infoColorAlt: '#479eeb',
  darkColor: '#272B41',
  darkHover: '#131623',
  grayColor: '#5A5F7D',
  grayLightestColor: '#bdbdbd',
  grayDarkColor: '#707070',
  grayHover: '#363A51',
  lightColor: '#9D9D9D',
  lightHover: '#e2e6ea',
  whiteColor: '#fff',
  dashColor: '#f0f0f0',
  whiteHover: '#5A5F7D',
  extraLightColor: '#ADB4D2',
  borderColorLight: '#F1F2F6',
  borderColorNormal: '#DEDEDE',
  borderColorDeep: '#C6D0DC',
  bgGrayColorDeep: '#EFF0F3',
  bgGrayColorLight: '#F8F9FB',
  bgGrayColorNormal: '#F4F5F7',
  lightGrayColor: '#868EAE',
  sliderRailColor: 'rgba(95,99,242,0.2)',
  graySolid: '#9D9D9D',
  healthColorLow: '#FF7258',
  healthColorAvg: '#FFDC65',
  healthColorGood: '#98DAB9',
  healthColorDefault: '#C1BFBF',
  placeholderColor: '#9D9D9D',
  labelMuted: '#707070',
  dubizzlePrimary: '#E00000',

  btnlg: '48px',
  btnsm: '36px',
  btnxs: '29px',
};

const getTheme = (colors) => ({
  gray900: colors.gray900,
  gray800: colors.gray800,
  gray700: colors.gray700,
  gray600: colors.gray600,
  gray550: colors.gray550,
  gray500: colors.gray500,
  gray400: colors.gray400,
  gray300: colors.gray300,
  gray200: colors.gray200,
  gray100: colors.gray100,

  'primary-color': colors.primaryColor,
  'primary-hover': colors.primaryHover,
  'primary-light': colors.primaryLight,
  'primary-light-color': colors.primaryLight3,
  'primary-light-1': colors.primaryLight1,
  'primary-light-2': colors.primaryLight2,
  'primary-light-3': colors.primaryLight3,
  'primary-light-4': colors.primaryLight4,
  'secondary-color': colors.secondaryColor,
  'secondary-hover': colors.secondaryHover,
  'link-color': colors.linkColor,
  'link-hover': colors.linkHover,
  'success-color': colors.successColor,
  'success-hover': colors.successHover,
  'warning-color': colors.warningColor,
  'warning-hover': colors.warningHover,
  'error-color': colors.errorColor,
  'error-hover': colors.errorHover,
  'info-color': colors.infoColor,
  'info-color-alt': colors.infoColorAlt,
  'info-hover': colors.infoHover,
  'base-color': colors.baseColor,
  'dark-color': colors.darkColor,
  'dark-hover': colors.darkHover,
  'gray-color': colors.grayColor,
  'gray-lightest-color': colors.grayLightestColor,
  'gray-dark-color': colors.grayDarkColor,
  'gray-hover': colors.grayHover,
  'light-color': colors.lightColor,
  'light-hover': colors.lightHover,
  'white-color': colors.whiteColor,
  'white-hover': colors.whiteHover,
  white: colors.whiteColor,
  black: '#000',
  'placeholder-color': colors.placeholderColor,
  'label-muted': colors.labelMuted,
  'dash-color': colors.dashColor,
  'extra-light-color': colors.extraLightColor,
  'danger-color': colors.dangerColor,
  'font-family': 'Lato, Droid Arabic Kufi, sans-serif',
  'font-size-base': '14px',
  'heading-color': colors.headingColor,
  'text-color': colors.darkColor,
  'text-color-secondary': colors.gray700,
  'disabled-color': 'rgba(0, 0, 0, 0.25)',
  'border-radius-base': '6px',
  'border-radius-lg': '8px',
  'border-color-base': colors.gray100,
  'box-shadow-base': '0 2px 8px rgba(0, 0, 0, 0.15)',
  'border-color-light': colors.borderColorLight,
  'border-color-normal': colors.borderColorNormal,
  'border-color-deep': colors.borderColorDeep,
  'bg-color-light': colors.bgGrayColorLight,
  'bg-color-normal': colors.bgGrayColorNormal,
  'bg-color-deep': colors.bgGrayColorDeep,
  'bg-color-default': colors.healthColorDefault,
  'light-gray-color': colors.lightGrayColor,
  'gray-solid': colors.graySolid,
  'btn-height-large': colors.btnlg,
  'btn-height-small': colors.btnsm,
  'btn-height-extra-small': colors.btnxs,
  'btn-default-color': colors.darkColor,
  'color-signature': '#af6fff',
  'color-hot': colors.dangerColor,
  'color-basic': colors.secondaryColor,
  'color-for-rent': colors.infoColorAlt,
  'color-for-sale': '#2d3e9b',
  'color-clicks': colors.warningColor,
  'color-leads': colors.infoColorAlt,
  'main-bg-color': 'transparent',
  'dubizzle-primary': colors.dubizzlePrimary,

  // cards
  'card-head-background': '#fff',
  'card-head-color': colors.darkColor,
  'card-background': '#fff',
  'card-head-padding': '16px',
  'card-padding-base': '12px',
  'card-radius': '10px',
  'card-shadow': '0 5px 20px rgba(146,153,184,0.03)',
  'card-border-width-lg': '1px',
  'card-border-width-sm': '0px',

  // Layout
  'layout-body-background': '#F6F7FB',
  'layout-header-background': '#fff',
  'layout-footer-background': '#fafafa',
  'layout-header-height': '74px',
  'layout-header-padding': '0 30px 0 15px',
  'layout-footer-padding': '24px 15px',
  'layout-sider-background': '#fff',
  'layout-trigger-height': '48px',
  'layout-trigger-background': '#002140',
  'layout-trigger-color': '#fff',
  'layout-zero-trigger-width': '36px',
  'layout-zero-trigger-height': '42px',

  // Layout light theme
  'layout-sider-background-light': '#fff',
  'layout-trigger-background-light': '#fff',
  'layout-trigger-color-light': 'rgba(0, 0, 0, 0.65)',

  // PageHeader
  // ---
  'page-header-padding': '24px',
  'page-header-padding-vertical': '16px',
  'page-header-padding-breadcrumb': '12px',
  'page-header-back-color': '#000',
  'page-header-ghost-bg': 'inherit',

  // Popover body background color
  'popover-color': colors.darkColor,

  // alert
  'alert-success-border-color': colors.successColor,
  'alert-success-bg-color': chroma.mix('fff', colors.successColor, 0.16).saturate(0.08),
  'alert-success-icon-color': colors.successColor,
  'alert-info-border-color': colors.infoColor,
  'alert-info-bg-color': chroma.mix('fff', colors.infoColor, 0.16).saturate(0.08),
  'alert-info-icon-color': colors.infoColor,
  'alert-warning-border-color': colors.warningColor,
  'alert-warning-bg-color': chroma.mix('fff', colors.warningColor, 0.16).saturate(0.08),
  'alert-warning-icon-color': colors.warningColor,
  'alert-error-border-color': colors.errorColor,
  'alert-error-bg-color': chroma.mix('fff', colors.errorColor, 0.16).saturate(0.08),
  'alert-error-icon-color': colors.errorColor,
  'alert-text-color': colors.baseColor,

  // Radio buttons
  'radio-button-bg': '#fff',
  'radio-button-checked-bg': colors.primaryColor,
  'radio-button-color': colors.gray700,
  // radio pills
  'radio-pill-bg': colors.gray200,
  'radio-pill-checked-bg': colors.primaryLight3,
  'radio-pill-border-color': 'transparent',
  'radio-pill-checked-border-color': colors.primaryLight1,
  'radio-pill-text-color': colors.baseColor,
  'radio-pill-checked-text-color': colors.primaryColor,

  // gutter width
  'grid-gutter-width': 25,

  // skeleton
  'skeleton-color': colors.borderColorLight,

  // slider
  'slider-rail-background-color': colors.sliderRailColor,
  'slider-rail-background-color-hover': colors.sliderRailColor,
  'slider-track-background-color': colors.primaryColor,
  'slider-track-background-color-hover': colors.primaryColor,
  'slider-handle-color': colors.primaryColor,
  'slider-handle-size': '16px',

  // input
  'input-height-base': '44px',
  'input-border-color': colors.borderColorNormal,
  'input-height-sm': '40px',
  'input-height-lg': '50px',
  'input-placeholder-color': colors.placeholderColor,

  // rate
  'rate-star-color': colors.warningColor,
  'rate-star-size': '13px',

  // Switch
  'switch-min-width': '35px',
  'switch-sm-min-width': '30px',
  'switch-height': '18px',
  'switch-sm-height': '15px',

  // result
  'result-title-font-size': '20px',
  'result-subtitle-font-size': '12px',
  'result-icon-font-size': '50px',

  // tabs
  'tabs-horizontal-padding': '12px 15px',
  'tabs-horizontal-margin': '0',

  // list
  'list-item-padding': '10px 24px',

  // Steps
  'process-tail-color': colors.gray400,
  'steps-background': '#F5F5F5',

  // Tags
  'tag-default-bg': '#EFF0F3',
  'tag-default-color': colors.darkColor,
  'tag-font-size': '11px',

  // Health
  'health-color-low': colors.healthColorLow,
  'health-color-avg': colors.healthColorAvg,
  'health-color-good': colors.healthColorGood,

  // Select
  'select-border-color': colors.borderColorNormal,
});

const getDarkTheme = (colors) => ({ ...getTheme(colors), backgroundColor: '#000' });

const getAppThemeTokens = (colors) => {
  return {
    token: {
      borderColor: colors.gray100,
      borderRadius: '6px',
      borderRadiusLG: '8px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
      btnHeightLG: colors.btnlg,
      btnHeightSM: colors.btnsm,
      colorBgSpotlight: '#fff',
      colorError: colors.errorColor,
      colorInfo: colors.infoColor,
      colorLink: colors.linkColor,
      colorPrimary: colors.primaryColor,
      colorSuccess: colors.successColor,
      colorTextDisabled: 'rgba(0, 0, 0, 0.25)',
      colorWarning: colors.warningColor,
      fontFamily: 'Figtree, Droid Arabic Kufi, sans-serif',
      fontSize: 14,
      fontSizeHeading1: 38,
      fontSizeHeading2: 30,
      fontSizeHeading3: 24,
      fontSizeHeading4: 20,
      fontSizeHeading5: 16,
      headingColor: colors.headingColor,
      lineHeight: 1.571,
      textColor: colors.darkColor,
      textColorSecondary: colors.gray700,
      colorTextPlaceholder: colors.gray600,
    },

    components: {
      Button: {
        contentLineHeight: 2,
        paddingInlineSM: '1em',
        paddingInline: '1.2em',
        paddingInlineLG: '1.5em',
        defaultBorderColor: colors.gray100,
        //  paddingBlockSM: 12
        controlHeight: 36,
        controlHeightLG: 40,
        controlHeightSM: 32,
      },
      Card: {
        colorTextHeading: colors.darkColor,
        headerBg: '#fff',
        colorBgContainer: '#fff',
        cardPaddingBase: 12,
        borderRadiusLG: 10,
        paddingLG: 12,
      },
      Layout: {
        bodyBg: '#F6F7FB',
        headerBg: '#fff',
        footerBg: '#fafafa',
        headerHeight: 74,
        headerPadding: '0 30px 0 15px',
        footerPadding: '24px 15px',
        siderBg: '#fff',
        triggerHeight: 48,
        triggerBg: '#002140',
        triggerColor: '#fff',
        zeroTriggerWidth: 36,
        zeroTriggerHeight: 42,
        lightSiderBg: '#fff',
        lightTriggerBg: '#fff',
        lightTriggerColor: 'rgba(0, 0, 0, 0.65)',
      },
      Popover: {
        colorText: colors.darkColor,
        innerPadding: '16px',
      },
      List: {
        itemPadding: '10px 24px',
      },
      Menu: {
        iconMarginInlineEnd: 10,
      },
      Alert: {
        colorSuccessBorder: colors.successColor,
        colorSuccessBg: chroma.mix('#fff', colors.successColor, 0.16).saturate(0.08),
        colorSuccess: colors.successColor,
        colorInfoBorder: colors.infoColor,
        colorInfoBg: chroma.mix('#fff', colors.infoColor, 0.16).saturate(0.08),
        colorInfo: colors.infoColor,
        colorWarningBorder: colors.warningColor,
        colorWarningBg: chroma.mix('#fff', colors.warningColor, 0.16).saturate(0.08),
        colorWarning: colors.warningColor,
        colorErrorBorder: colors.errorColor,
        colorErrorBg: chroma.mix('#fff', colors.errorColor, 0.16).saturate(0.08),
        colorError: colors.errorColor,
        colorText: colors.baseColor,
      },

      // Radio buttons
      Radio: {
        buttonBg: '#fff',
        buttonCheckedBg: colors.primaryColor,
        buttonColor: colors.gray700,
        radioPillBg: colors.gray200,
        radioPillCheckedBg: colors.primaryLight3,
        radioPillBorderColor: 'transparent',
        radioPillCheckedBorderColor: colors.primaryLight1,
        radioPillTextColor: colors.baseColor,
        radioPillCheckedTextColor: colors.primaryColor,
      },

      // skeleton
      Skeleton: {
        gradientFromColor: colors.borderColorLight,
      },

      // slider
      Slider: {
        railBg: colors.sliderRailColor,
        railHoverBg: colors.sliderRailColor,
        trackBg: colors.primaryColor,
        trackHoverBg: colors.primaryColor,
        handleColor: colors.primaryColor,
        // handleSize: '16px',
        handleSize: 12,
      },

      // Input
      Input: {
        colorBorder: colors.borderColorNormal,
        colorTextPlaceholder: colors.placeholderColor,
        paddingBlock: 10,
        paddingBlockSM: 8,
        paddingBlockLG: 12,
        activeShadow: `0 0 0 2px ${chroma(colors.primaryColor).alpha(0.1)}`,
      },

      // Rate
      Rate: {
        starColor: colors.warningColor,
        starSize: 13,
      },

      // Switch
      Switch: {
        trackMinWidth: 35,
        trackMinWidthSM: 30,
        trackHeight: 18,
        trackHeightSM: 15,
        trackPadding: 2,
        handleSize: 14,
        colorTextTertiary: 'rgba(0, 0, 0, .25)',
      },

      // result
      Result: {
        titleFontSize: 20,
        subtitleFontSize: 12,
        iconFontSize: 50,
      },

      // tabs
      Tabs: {
        horizontalItemPadding: '12px 15px',
        horizontalItemMargin: '0',
        horizontalItemGutter: 0,
      },

      // Steps
      Steps: {
        colorSplit: colors.gray400,
        colorBgContainer: '#F5F5F5',
      },

      // Tags
      Tags: {
        defaultBg: '#EFF0F3',
        defaultColor: colors.darkColor,
        fontSizeSM: 11,
      },

      // Select
      Select: {
        colorBorder: colors.borderColorNormal,
        controlHeight: 44,
        controlHeightSM: 34,
        controlHeightLG: 50,
        colorBgContainerDisabled: colors.gray200,
        colorTextPlaceholder: colors.gray600,
        multipleItemBg: 'color-mix(in srgb, var(--primary-color) 10%, #fff)',
        multipleItemHeight: 22,
        paddingXXS: 11,
      },

      Modal: {
        titleFontSize: 16,
      },

      Drawer: {
        footerPaddingBlock: 24,
      },
      InputNumber: {
        paddingBlock: 10,
      },
      DatePicker: {
        controlHeight: 44,
        controlHeightSM: 34,
        controlHeightLG: 50,
        colorTextPlaceholder: colors.gray600,
      },
      Typography: {
        colorTextDescription: colors.gray700,
      },
      Progress: {
        remainingColor: 'var(--remaining-color, rgba(0, 0, 0, 0.06))',
      },
    },
  };
};

export const getAppTheme = (primaryThemeColors = {}) => {
  const colors = { ...themeColors, ...primaryThemeColors };
  return {
    theme: getTheme(colors),
    darkTheme: getDarkTheme(colors),
    themeTokens: getAppThemeTokens(colors),
  };
};

const { theme, darkTheme, themeTokens } = getAppTheme(getColors());

const appTheme = Object.freeze({
  key: TENANT_KEY,
  darkTheme: darkTheme,
  ...theme,
  themeTokens: themeTokens,
});
export default appTheme;
