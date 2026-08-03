import tenantRoutes from '@routes';
import { Col, Row, Spin } from 'antd';
import cx from 'clsx';
import React, { Suspense, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Routes } from 'react-router-dom';
import UserSettingsPages from '.';
import { Card, Flex, Navbar } from '../../../components/common';
import Icon from '../../../components/common/icon/icon';
import { useGetLocation, usePageTitle, useRouteNavigate } from '../../../hooks';
import { pageViewUserSettingEvent } from '../../../services/analyticsService';
import TenantComponents from '@components';
import { TabsStyled } from '../../../tenant/common/components/listing/styled';
import { stSlash } from '../../../utility/utility';
import { Main } from '../../styled';
import { NavWrapper } from './style';
import { useSelector } from 'react-redux';
import tenantConstants from '@constants';

const UserSettings = ({}) => {
  const { t } = useTranslation();
  usePageTitle(t('User Settings - Profolio'));
  const { user } = useSelector((state) => state.app.loginUser);
  const { isMobile, isMemberArea } = useSelector((state) => state.app.AppConfig);
  const { basePath } = useGetLocation();
  const navigate = useRouteNavigate();
  const subRoutes = tenantRoutes.app(stSlash(''), false, user).settings.subRoutes;
  const [tab, setTab] = useState(null);

  useEffect(() => {
    const pathArray = window.location.pathname.split('/');
    const lastValue = pathArray[pathArray.length - 1];
    const route = subRoutes.find((e) => e.key == lastValue)?.key;
    if (route) {
      setTab(route);
    } else {
      navigate(`${tenantRoutes.app().settings.route}${subRoutes?.[0]?.path}`);
    }
  }, [window.location.pathname]);

  const handleTabClick = (e) => {
    setTab(e);
    navigate(`${tenantRoutes.app().settings.route}/${e}`);
  };

  const tabData = subRoutes.map((e) => ({ tabTitle: t(e?.name), content: null, icon: e?.icon, key: e.key }));
  return (
    <Main isMemberArea={isMemberArea}>
      <NavWrapper>
        {tenantConstants.SHOW_PAGE_ALERTS && <TenantComponents.PageAlerts />}
        <Row gutter={isMobile ? 0 : 10}>
          <Col
            // className={cx(isMobile && 'p-8 text-center')}
            lg={6}
            xs={24}
          >
            <Flex gap="8px" style={{ position: isMobile ? 'initial' : 'sticky', top: isMemberArea ? 24 : 80 }} vertical>
              {isMobile ? (
                <TabsStyled
                  className={cx('mb-0 agencyTabs scroll-x')}
                  activeKey={tab || subRoutes[0]?.key?.toString()}
                  onChange={handleTabClick}
                  style={{ '--box-width': '360px', marginInline: isMobile && 'initial' }}
                  items={tabData.map((item) => ({
                    key: item.key,
                    label: item.icon ? (
                      <Flex gap="2px">
                        <Icon icon={item.icon} iconProps={{ size: '1.6em' }} />
                        {item.tabTitle}
                      </Flex>
                    ) : (
                      t(item.tabTitle)
                    ),
                  }))}
                ></TabsStyled>
              ) : (
                <Card
                  bodyStyle={{ padding: '16px 20px' }}
                  // style={{ position: 'sticky', top: isMemberArea ? 24 : 80 }}
                  headless
                >
                  <Navbar paths={subRoutes} basePath={basePath} />
                </Card>
              )}
              {tenantConstants.PROFILE_COMPLETION_APPLICABLE && user?.profile_completion?.score < 100 && (
                <TenantComponents.ProfileStatusPopUp />
              )}
            </Flex>
          </Col>

          <Col lg={18} xs={24}>
            <Suspense
              fallback={
                <div className="spin">
                  <Spin />
                </div>
              }
            >
              <Routes>
                {subRoutes.map((e) => {
                  const PageComponent = UserSettingsPages[e.Component] ? UserSettingsPages[e.Component] : <></>;
                  return <Route key={e.key} path={e?.path} element={<PageComponent />} />;
                })}
              </Routes>
            </Suspense>
          </Col>
        </Row>
      </NavWrapper>
    </Main>
  );
};

export default UserSettings;
