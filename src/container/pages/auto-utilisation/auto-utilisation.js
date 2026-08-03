import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Group, Heading } from '../../../components/common';
import { NavWrapper } from '../../../components/common/navbar/style';

import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import AutoUtilizationPages from '.';
import { CreditInfoCard } from '../../../components/auto-utilisation';
import { useOutsideClick } from '../../../hooks';
import { stSlash } from '../../../utility/utility';
import tenantApi from '@api';
import { useLazyFetchUserquotaCreditsQuery } from '../../../apis/quotaCredits';

const routes = (path) => [
  {
    path: `${path}/auto_apply`,
    Component: 'AutoApplyPage',
    name: 'Auto Apply Credits',
    icon: 'FiSettings',
    badge: '',
  },
];

function AutoUtilisation() {
  const [state, setState] = useState({ responsive: 0, collapsed: false });
  const [credits, setCredits] = useState(null);
  const { responsive, collapsed } = state;
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const user = useSelector((state) => state.app.loginUser.user);
  const { t } = useTranslation();

  const [fetchUserquotaCredits, { isLoading: loading }] = useLazyFetchUserquotaCreditsQuery();

  const fetchUserCredits = async () => {
    const response = await fetchUserquotaCredits(user?.id, user?.agency?.id);
    if (response) {
      if (response?.error) {
        setCredits([]);
      } else {
        const data = response?.data?.zameen?.credits?.filter((e) => e?.id !== 12);
        setCredits(data);
      }
    }
  };

  useEffect(() => {
    if (!credits) {
      fetchUserCredits();
    }
  }, []);

  const sideBarRef = useRef();

  useLayoutEffect(() => {
    function updateSize() {
      const width = window.innerWidth;
      setState({ responsive: width });
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const toggleCollapsed = () => {
    setState({
      ...state,
      collapsed: !collapsed,
    });
  };

  const getSubRoutes = routes(stSlash(''));
  useOutsideClick(sideBarRef, () => {
    setState({
      ...state,
      collapsed: false,
    });
  });

  return (
    <Group className={isMobile ? 'p-16' : 'p-24'} style={{ gap: '24px' }}>
      <Group gap="16px" template="repeat(auto-fit, minmax(min(32ch, 100%), 1fr))">
        {loading ? (
          [1, 2, 3]?.map((e) => <CreditInfoCard key={e} loading={loading} />)
        ) : credits?.length ? (
          credits
            .filter((e) => e?.slug != 'property_photography' && e?.slug != 'property_videography')
            .map((e) => (
              <CreditInfoCard
                icon={e.icon}
                key={e?.slug}
                iconColor={e.iconColor}
                title={`${e?.name} Credits`}
                value={e?.available}
                bodyStyle={{ padding: 24 }}
                loading={loading}
              />
            ))
        ) : (
          <></>
        )}
      </Group>

      <NavWrapper>
        <Heading as="h4" className="mb-20">
          {t('Auto Utilization of Credits')}
        </Heading>

        <Routes>
          {getSubRoutes.map((e, i) => {
            const PageComponent = AutoUtilizationPages[e.Component] ? AutoUtilizationPages[e.Component] : () => null;
            return <Route key={i} path={e.path} element={<PageComponent credits={credits} />} />;
          })}
        </Routes>

        {/* <Row className={`${isMobile ? 'mb-16' : 'mb-32'} justify-content-center`} gutter={32}> 
         <Col className="trigger-col" xxl={5} xl={7} lg={8} xs={24}> 
         {responsive <= 991 && (
              <Button
                type="link"
                className="mail-sidebar-trigger"
                style={{ marginTop: 0 }}
                onClick={toggleCollapsed}
                icon={collapsed ? 'CgMenuRight' : 'CgMenuLeft'}
              />
            )} 

         {responsive > 991 ? (
              <div className="mail-sideabr">
                <Card headless>
                  <div className="mail-sidebar-bottom pb-0">
                    <Navbar paths={getSubRoutes} path={pathName} />
                  </div>
                </Card>
              </div>
            ) : (
              <SideBar className={collapsed ? 'mail-sideabr show' : 'mail-sideabr hide'} ref={sideBarRef}>
                <div className="mail-sidebar-bottom">
                  <Navbar paths={getSubRoutes} path={pathName} toggleCollapsed={toggleCollapsed} />
                </div>
              </SideBar>
            )} 
         </Col> 

         <Col xxl={19} xl={17} lg={16}>
            <Switch>
              <Suspense
                fallback={
                  <div className="spin">
                    <Spin />
                  </div>
                }
              ></Suspense>
            </Switch>
          </Col> 
         </Row>  */}
      </NavWrapper>
    </Group>
  );
}

export default AutoUtilisation;
