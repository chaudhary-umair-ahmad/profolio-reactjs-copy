import tenantConstants from '@constants';
import tenantTheme from '@theme';
import { ConfigProvider } from 'antd';
import 'antd/dist/reset.css';
import less from 'less';
import React, { useEffect, useMemo } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import ErrorBoundary from './components/common/errorBoundary/ErrorBoundary';
import { useAppInit } from './hooks';
import MainRouter from './router';
import './static/less/antd-customized.less';
import './static/less/style.less';
import './static/less/utils.less'; // Should be at the end of CSS loading order
import { getAppTheme } from './theme'
import { getColors } from './utility/env';
import { isLiteExperienceURL } from './utility/general'
import { useAppServices } from './hooks';
import { createHumbuckerScriptURL } from './utility/humbucker';

const App = () => {
  const { locale, rtl } = useAppInit()
  useAppServices();

  useEffect(() => {
    const colors = getColors();
    if (Object.keys(colors).length === 0) return;
    try {
      const theme = getAppTheme(colors);
      less.modifyVars({ darkTheme: theme.darkTheme, ...theme.theme, themeTokens: theme.themeTokens });
    } catch (error) {
      console.error('Error generating theme:', error);
    }
  }, [getAppTheme, getColors, window.location.pathname]);

  const getLangBasePath = () => {
    const pathDirectories = window.location.pathname.split('/');
    if (pathDirectories.length > 1) {
      const pathLocale = pathDirectories[1];
      const lang = tenantConstants.LANGUAGES.find((e) => e.key == pathLocale) || {};
      return lang.key || '';
    }
  };

  const appTheme = useMemo(
    () => ({
      hashed: false,
      cssVar: { key: 'styleProfolio' },
      rtl,
      darkMode: { ...tenantTheme?.darkTheme },
      ...tenantTheme.themeTokens,
      token: {
        ...tenantTheme.themeTokens.token,
        ...(isLiteExperienceURL() ? { fontFamily: tenantConstants.FONT_FAMILY_LITE } : {}),
      },
    }),
    [tenantConstants, tenantTheme],
  );

  const humbuckerScriptURL = createHumbuckerScriptURL();

  return (
    <ConfigProvider locale={locale} direction={rtl ? 'rtl' : 'ltr'} theme={appTheme}>
      <ThemeProvider theme={{ ...tenantTheme, rtl }}>
        <HelmetProvider>
          <Helmet>
              {!!humbuckerScriptURL && (
                  <script src={humbuckerScriptURL} async />
              )}
          </Helmet>
          <ErrorBoundary>
            <BrowserRouter basename={getLangBasePath()}>
              <MainRouter />
            </BrowserRouter>
          </ErrorBoundary>
        </HelmetProvider>
      </ThemeProvider>
    </ConfigProvider>
  );
};

export default App;
