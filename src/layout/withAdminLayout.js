import TenantComponents from '@components';
import tenantConstants from '@constants';
import tenantMenuList from '@menuList';
import tenantTheme from '@theme';
import { Col, Layout, Row } from 'antd';
import cx from 'clsx';
import { t } from 'i18next';
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import AppBanner from '../components/appBanner/appBanner';
import { Button, Icon } from '../components/common';
import { ChevronLeftIcon, ChevronRightIcon } from '../components/svg';
import AuthInfo from '../components/utilities/auth-info/info';
import { useGetLocation } from '../hooks';
import { setMobile } from '../store/appSlice';
import { TENANT_KEY } from '../utility/env';
import { isMobile as isMobileFunc } from '../utility/general';
import { isWebView } from '../utility/utility';
import LeadNudgeToasts from '../components/lead-nudges/LeadNudgeToasts';
import MenueItems from './MenueItems';
import { Div } from './style';

const { Header, Footer, Sider, Content } = Layout;
const SIDEBAR_COLLAPSED_WIDTH = 60;
const SIDEBAR_EXPANDED_WIDTH = 220;

const withAdminLayout = (WrappedComponent) => (props) => {
  const [collapsed, setCollapsed] = useState(true);
  const [hideTopBar, setHideTopBar] = useState(false);
  const { isMobile, darkMode, topMenu, rtl, isMemberArea } = useSelector((state) => state.app.AppConfig);
  const { user } = useSelector((state) => state.app.loginUser);
  const isClickToggleSidebarEnabled = tenantConstants.PUSH_CONTENT_ON_SIDEBAR_EXPAND;
  const shouldPushMainContent = !isMobile && !isMemberArea && !topMenu && isClickToggleSidebarEnabled;
  const sidebarOffset = shouldPushMainContent
    ? collapsed
      ? SIDEBAR_COLLAPSED_WIDTH
      : SIDEBAR_EXPANDED_WIDTH
    : SIDEBAR_COLLAPSED_WIDTH;

  const dispatch = useDispatch();
  const controlRef = useRef();
  const completionModalSuccessRef = useRef();

  const headerContainerRef = useRef();
  const [minHeightOffset, setMinHeightOffset] = useState(0);

  const location = useGetLocation();
  const isDashboardPath = location.pathname.includes('/dashboard');
  const [isBannerVisible, setIsBannerVisible] = useState(
    isMobile && isDashboardPath && tenantConstants.PITCH_MOBILE_APP,
  );

  const sideBarList = tenantMenuList.menuList(user?.permissions, user?.agency, user?.type !== 'free');

  const currentPageTitle = useMemo(() => {
    const pathName = location.pathname;
    const matches = (it) =>
      (it?.path && pathName.includes(it.path)) || (it?.basePath && pathName.includes(it.basePath));

    const entry = sideBarList.find((e) => matches(e) || e?.list?.some(matches));
    if (!entry) return '';
    if (matches(entry)) return entry.title;
    return entry.list.find(matches)?.title || '';
  }, [location.pathname, sideBarList]);

  const profileCompletionScore = `showCompletionModal_${user?.id}`;
  const userTruBrokerDate = `truBrokerDate_${user?.id}`;

  useEffect(() => {
    const showBanner = JSON.parse(localStorage.getItem('showBanner'));
    setIsBannerVisible(showBanner && isMobile && isDashboardPath && tenantConstants.PITCH_MOBILE_APP);
  }, [isMobile, isDashboardPath]);

  const isTruBrokerForFirstTime = () => {
    return (
      tenantConstants.TRU_BROKER_ENABLED &&
      user?.is_tru_broker &&
      JSON.parse(localStorage.getItem(userTruBrokerDate)) != user?.tru_broker_start_date
    );
  };
  const showProfileSuccessPopUp = () => {
    return (
      user?.profile_completion?.score == 100 &&
      JSON.parse(localStorage.getItem(profileCompletionScore)) != user?.profile_completion?.score &&
      !isTruBrokerForFirstTime()
    );
  };

  const handleTruBrokerSuccessIntimation = () => {
    if (isTruBrokerForFirstTime()) {
      completionModalSuccessRef?.current && completionModalSuccessRef?.current?.showModal('isTruBroker');
      localStorage.setItem(userTruBrokerDate, JSON.stringify(user?.tru_broker_start_date));
    }
    localStorage.setItem(userTruBrokerDate, JSON.stringify(user?.tru_broker_start_date));
  };

  useEffect(() => {
    if (tenantConstants.PROFILE_COMPLETION_APPLICABLE && !isMemberArea && !isWebView()) {
      if (showProfileSuccessPopUp()) {
        completionModalSuccessRef?.current && completionModalSuccessRef?.current?.showModal('isProfileCompleted');
        localStorage.setItem(profileCompletionScore, JSON.stringify(user?.profile_completion?.score));
      }
      localStorage.setItem(profileCompletionScore, JSON.stringify(user?.profile_completion?.score));
      handleTruBrokerSuccessIntimation();
    }
  }, [user]);

  const updateDimensions = () => {
    setCollapsed(true);
    dispatch(setMobile(isMobileFunc()));
  };

  useEffect(() => {
    window.addEventListener('resize', updateDimensions);
    document.addEventListener('mousedown', handleClickOutside);
    updateDimensions();
    return () => {
      window.removeEventListener('resize', updateDimensions);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useLayoutEffect(() => {
    if (headerContainerRef?.current) {
      setMinHeightOffset(headerContainerRef?.current?.offsetHeight);
    }
  }, [headerContainerRef]);

  const handleClickOutside = (event) => {
    if (isClickToggleSidebarEnabled) return;
    if (controlRef && !controlRef?.current?.contains(event.target) && !collapsed) {
      setCollapsed(true);
    }
  };

  const handleBannerClose = () => {
    setIsBannerVisible(false);
    localStorage.setItem('showBanner', JSON.stringify(false));
  };

  useEffect(() => {
    if (isMobile && !collapsed) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobile, collapsed]);

  const toggleCollapsed = () => {
    setCollapsed((prev) => !prev);
  };

  const toggleCollapsedMobile = () => {
    if (isMobileFunc()) {
      setCollapsed((prev) => !prev);
    }
  };

  const footerStyle = {
    padding: '12px 16px',
    color: 'rgba(0, 0, 0, 0.65)',
    fontSize: '14px',
    background: 'rgba(255, 255, 255, .90)',
    width: '100%',
    boxShadow: '0 -5px 10px rgba(146,153,184, 0.05)',
  };

  const SideBarStyle = {
    margin: '0',
    paddingBlock: '4px 0',
    paddingInline: collapsed ? 0 : '12px',
    '--sidebar-brand-inset': collapsed ? (rtl ? '1px' : '20px') : '10px',
    overflow: 'visible',
    position: 'fixed',
    top: isBannerVisible ? 66 : 0,
    insetInlineStart: 0,
    bottom: 0,
    zIndex: 1002,
  };

  const showSidebarPadding = !isMobile && !topMenu && !isMemberArea;

  const renderHeader = () => (
    <Header
      style={{
        position: 'fixed',
        top: isBannerVisible ? 66 : 0,
        insetInline: 0,
        display: 'flex',
        alignItems: 'center',
        minHeight: 60,
        maxHeight: 60,
        paddingBlock: 12,
        paddingInlineEnd: '20px',
        paddingInlineStart: showSidebarPadding ? `${sidebarOffset + 25}px` : '20px',
        boxSizing: 'border-box',
        lineHeight: 'normal',
        transition: 'padding-inline-start 220ms ease, padding-inline-end 220ms ease',
      }}
      ref={headerContainerRef}
    >
      <Row align="middle" justify="space-between" wrap={false} style={{ width: '100%' }} gutter={16}>
        <Col flex="none">
          <div className="align-center-v navbar-brand" style={{ gap: 12 }}>
            {isMobile ? (
              <Button
                type="link"
                onClick={toggleCollapsed}
                style={{ '--btn-content-color': '#000' }}
                title={collapsed ? t('Open side menu') : t('Close side menu')}
              >
                <Icon icon="MobileSidebarMenuIcon" size={24} />
              </Button>
            ) : null}

            {topMenu && !isMobile ? (
              <Link className={cx('top-menu', 'striking-logo')} to="/">
                <TenantComponents.Logo rtl={rtl} />
              </Link>
            ) : null}

            {!topMenu && currentPageTitle ? (
              <span
                className="navbar-page-title"
                style={{
                  fontWeight: 700,
                  fontSize: 20,
                  color: '#000',
                  lineHeight: 1.2,
                  whiteSpace: 'nowrap',
                }}
              >
                {currentPageTitle}
              </span>
            ) : null}
          </div>
        </Col>

        {isMobile ? (
          <Col flex="auto">
            <div className="mobile-action">
              <AuthInfo />
            </div>
          </Col>
        ) : (
          <Col
            flex="auto"
            style={{ display: 'flex', justifyContent: 'flex-end', marginInlineEnd: !isMobile && '-8px' }}
          >
            <AuthInfo />
          </Col>
        )}
      </Row>
    </Header>
  );

  return (
    <Div
      darkMode={darkMode}
      mobileSidebarOpen={isMobile && !collapsed}
      theme={{ ...tenantTheme, topMenu: !!isMemberArea, isMobile, rtl }}
      style={{ paddingBlockStart: isBannerVisible ? '72px' : 0 }}
    >
      {isBannerVisible && (
        <AppBanner
          style={{ position: 'fixed', top: 0, insetInline: 0, zIndex: 1000 }}
          handleClose={handleBannerClose}
        />
      )}
      <Layout>
        {!isWebView() &&
          (isMemberArea ? (
            <div ref={headerContainerRef}>
              <TenantComponents.Layout.Header />
            </div>
          ) : (
            renderHeader()
          ))}

        {!isMemberArea &&
          (!topMenu || isMobile ? (
            <div ref={controlRef}>
              <ThemeProvider theme={tenantTheme?.darkTheme}>
                <Sider
                  width={SIDEBAR_EXPANDED_WIDTH}
                  collapsedWidth={SIDEBAR_COLLAPSED_WIDTH}
                  style={SideBarStyle}
                  collapsed={collapsed}
                  theme={!darkMode ? 'light' : 'dark'}
                  onMouseEnter={isClickToggleSidebarEnabled ? undefined : () => setCollapsed(false)}
                  onMouseLeave={isClickToggleSidebarEnabled ? undefined : () => setCollapsed(true)}
                  onClick={collapsed ? () => setCollapsed(false) : undefined}
                >
                  {collapsed && !isMobile && (
                    <button
                      type="button"
                      className={cx('sidebar-expand-btn', { rtl })}
                      onClick={() => setCollapsed(false)}
                      aria-label={t('Expand side menu')}
                    >
                      <ChevronRightIcon size={16} />
                    </button>
                  )}
                  {!collapsed && (
                    <button
                      type="button"
                      className={cx('sidebar-expand-btn sidebar-collapse-btn', { rtl })}
                      onClick={() => setCollapsed(true)}
                      aria-label={t('Collapse side menu')}
                    >
                      <ChevronLeftIcon size={16} />
                    </button>
                  )}
                  <div className="sidebar-overview-icon" style={{ marginRight: !collapsed && rtl ? '-29px' : undefined }}>
                    <TenantComponents.Logo rtl={rtl} />
                  </div>
                  <div className="sidebar-menu-scroll">
                    <MenueItems
                      collapsed={collapsed}
                      toggleCollapsed={toggleCollapsedMobile}
                      handleTopBarSticky={(hide = false) => setHideTopBar(hide)}
                    />
                  </div>
                </Sider>
              </ThemeProvider>
            </div>
          ) : null)}

        <Layout
          className="atbd-main-layout"
          style={{
            '--min-height-offset': `${minHeightOffset}px`,
            '--sidebar-offset': `${sidebarOffset}px`,
          }}
        >
          <Content>
            <WrappedComponent {...props} isMobile={isMobile} />
          </Content>

          {isMemberArea ? (
            <TenantComponents.Layout.Footer />
          ) : (
            <Footer className="admin-footer" style={footerStyle}>
              <Row>
                <Col xs={24} align="center">
                  <span className="admin-footer__copyright">
                    © {new Date().getFullYear()} –{' '}
                    {TENANT_KEY === 'zameen' ? t('Powered by Zameen.com') : t('All Rights Reserved')}
                  </span>
                </Col>
              </Row>
            </Footer>
          )}
        </Layout>
        {user?.id && <LeadNudgeToasts />}
        {tenantConstants.PROFILE_COMPLETION_APPLICABLE && !isMemberArea && (
          <TenantComponents.ProfileCompletionCongratsModal ref={completionModalSuccessRef} />
        )}
      </Layout>
    </Div>
  );
};

export default withAdminLayout;
