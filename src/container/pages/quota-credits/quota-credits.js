import tenantData from '@data';
import tenantFilters from '@filters';
import tenantRoutes from '@routes';
import tenantConstants from '@constants';
import { Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { Group } from '../../../components/common';
import { ListingContainer } from '../../../components/listing-container/ListingContainer';
import { CreditsQuota } from '../../../components/widgets';
import { PERMISSIONS_TYPE } from '../../../constants/permissions';
import { useRouteNavigate } from '../../../hooks';
import { useGetPurchaseLogsQuery } from '../../../apis/quotaCredits';
import { useFetchContractsDetailsQuery } from '../../../apis/user';
import { mapQueryParams } from '../../../utility/utility';
import { Main } from '../../styled';
import { DashboardCardFirstVist } from '../dashboard/styled';
import { getBaseURL } from '../../../utility/env';

const QuotaCreditsPage = ({ isMobile }) => {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.app.loginUser);
  const [selectedUser, setSelectedUser] = useState();
  const navigate = useRouteNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryObj = Object.fromEntries([...searchParams]);

  useEffect(() => {
    if (user?.agency?.id && user?.platforms?.length) {
      user?.platforms.forEach((plat) => {
        setSelectedUser((e) => ({
          ...e,
          [plat.slug]: user?.agency?.users?.length > 1 ? { ...user, id: -1 } : user,
        }));
      });
    }
  }, [user?.agency, user?.platforms?.length]);

  const filtersList = tenantFilters.getQuotaCreditsFilters();
  const query = mapQueryParams(queryObj, filtersList);

  const {
    data: purchaseLogsData,
    error: errorLogs,
    refetch: refetchLogs,
    isFetching: loadingLogs,
  } = useGetPurchaseLogsQuery({ query: query, userId: user?.id });

  useFetchContractsDetailsQuery(undefined, { skip: user?.contracts || !tenantConstants.CONTRACTS_ENABLED });

  return (
    <>
      <Main>
        <Group>
          <Row gutter={[24, 24]}>
            {tenantData.platformList.map((platform, i) => {
              return (
                !!user.products.platforms[platform.slug] && (
                  <Col key={i} flex="1" md={12}>
                    <CreditsQuota
                      user={selectedUser?.[platform.slug] || user}
                      platform={platform}
                      showAssignToLink={!!user?.is_agency_admin}
                      users={user?.agency?.users?.length ? [{ name: t('All'), id: -1 }, ...user?.agency?.users] : []}
                      usersPermission={user?.permissions?.[PERMISSIONS_TYPE.PROFILE]}
                      key={platform.slug}
                      setSelectedUser={(sel) => {
                        setSelectedUser((e) => ({ ...e, [platform.slug]: sel }));
                      }}
                    />
                  </Col>
                )
              );
            })}
            {tenantData.platformList.filter((e) => !!user.products.platforms[e.slug]).length === 1 && (
              <Col flex="1" md={12}>
                <DashboardCardFirstVist
                  className={isMobile ? 'p-8' : 'p-24'}
                  cardTitle={t('Buy quota and credits')}
                  subTitle={t('In a few simple steps!')}
                  btnText={t(`Buy Now`)}
                  style={{
                    '--bg-img': `url(${getBaseURL()}/profolio-assets/images/widgetBg2@2x.png)`,
                    '--bg-size': 'auto 100%',
                    height: '100%',
                  }}
                  isMobile={isMobile}
                  onClick={() => navigate(tenantRoutes.app().prop_shop.path)}
                />
              </Col>
            )}
          </Row>
        </Group>
      </Main>

      <div className={isMobile ? 'px-8' : ''}>
        <ListingContainer
          title={t('Purchase Logs')}
          filtersList={filtersList}
          listingsData={purchaseLogsData?.data}
          listingApi={refetchLogs}
          loading={loadingLogs}
          error={errorLogs}
          onRetry={refetchLogs}
          // noUrlPush
          enableFilters
          intialFilterCount={filtersList?.length}
        />
      </div>
    </>
  );
};
export default QuotaCreditsPage;
