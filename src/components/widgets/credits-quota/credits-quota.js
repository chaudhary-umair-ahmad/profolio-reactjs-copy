import tenantConstants from '@constants';
import tenantRoutes from '@routes';
import tenantTheme from '@theme';
import { Row } from 'antd';
import cx from 'clsx';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useRouteNavigate } from '../../../hooks';
import TenantComponents from '@components';
import { formatNumberString } from '../../../utility/utility';
import { isLiteExperienceURL } from '../../../utility/general';
import { Button, Card, EmptyState, Flex, Group, Modal, Select, TextWithIcon } from '../../common';
import LoaderWrapper from '../../common/loader-wrapper/loader-wrapper';
import WarningNotice from '../../warning-notice';
import QuotaCreditsStatsWidget from '../QuotaCreditsStatWidget';
import { QCSkeleton } from './credits-quota-skeleton';
import { DrawerModal } from '../../common';
import { useGetProductExpiryDataQuery, useGetQuotaCreditsWidgetDataQuery } from '../../../apis/quotaCredits';

const CreditsQuota = (props) => {
  const {
    platform,
    users,
    usersPermission,
    products: allProducts = [],
    showAssignToLink,
    isDashboard,
    widgetGap,
    rowHeight,
    cardHeight,
    bodyPadding,
    setSelectedUser,
    user,
  } = props;
  const { t } = useTranslation();
  const { isMemberArea, isMobile, isMultiPlatform } = useSelector((state) => state.app.AppConfig);
  const { data: expiryData } = useGetProductExpiryDataQuery({}, { skip: !tenantConstants.CONTRACTS_ENABLED });
  const [activeTab, setActiveTab] = useState(null);
  const creditDrawerRef = useRef();
  const navigate = useRouteNavigate();
  const [topUpModalVisible, setTopUpModalVisible] = useState(false);
  const [smartCreditsModalVisible, setSmartCreditsTopUpModalVisible] = useState(false);
  const loggedInUser = useSelector((state) => state.app.loginUser.user);

  const CreditTopUps = TenantComponents.CreditTopUps;
  const modalRef = useRef(null);
  const creditTopUpRef = useRef(null);

  const {
    data,
    isLoading: loading,
    isFetching: fetching,
    error,
    refetch,
  } = useGetQuotaCreditsWidgetDataQuery(
    {
      ...(user?.id != -1 && { [user?.isCurrencyUser ? 'subject_id' : 'q[user_id_eq]']: user?.id }),
      platform_id: [platform?.id],
    },
    {
      skip: !user?.id,
      refetchOnMountOrArgChange: true,
    },
  );

  const renderUserSelect = useCallback(() => {
    return (
      !!usersPermission && (
        <Select
          size="small"
          horizontal
          value={user?.id}
          options={users}
          onChange={(value, op) => {
            setSelectedUser(op);
          }}
          getOptionLabel={(op) => {
            return `${op.name} ${op.id === loggedInUser?.id ? t('(Me)') : ''}`;
          }}
          inputLoading={loading}
          popupMatchSelectWidth={false}
          accentColor={data?.[platform?.slug]?.platform?.brandColor}
        />
      )
    );
  });
  const handleCancel = () => {
    setTopUpModalVisible(false);
    creditTopUpRef?.current && creditTopUpRef.current?.clearState();
  };

  const renderCreditTopUpModal = () => {
    return (
      <DrawerModal
        ref={modalRef}
        title={data?.[platform?.slug]?.title}
        footer={null}
        visible={topUpModalVisible}
        onCancel={handleCancel}
        bodyStyle={{ padding: 0 }}
        width={880}
        placement="bottom"
      >
        <CreditTopUps
          ref={creditTopUpRef}
          header={false}
          bodyStyle={{ padding: '16px 24px' }}
          style={{ borderRadius: 0, border: 'none' }}
        />
      </DrawerModal>
    );
  };

  const renderQuotaCreditsCardTitle = () => {
    return (
      <Flex align="center" gap="6px">
        <TextWithIcon
          title={t(data?.[platform?.slug]?.title)}
          icon={((isMobile || !isDashboard) && isMultiPlatform && data?.[platform?.slug]?.titleIcon) || null}
          iconProps={{ size: '1.6em', iconBackgroundColor: '#fff', hasBackground: true }}
          fontWeight={700}
          loading={!!loading && !!fetching}
          className={cx(isMobile ? 'fz-14' : 'fz-16')}
          loadingProps={{ avatarSize: 24, rectSize: 'small' }}
          onClick={() => {
            user?.isCurrencyUser && creditDrawerRef.current.openDrawer(true);
          }}
          style={{ cursor: 'pointer' }}
        />
        {user?.isCurrencyUser && !loading && !fetching && (
          <>
            <Button
              onClick={() => creditDrawerRef.current.openDrawer(true)}
              shape="circle"
              icon={'BsInfoLg'}
              type="primary-light"
              iconSize="14px"
              style={{ '--btn-bg-color': tenantTheme['primary-light-3'], height: '18px', width: '18px ' }}
              iconColor={tenantTheme['primary-color']}
              size="small"
              className="btn-icon-size"
            />
            <TenantComponents.CreditInfoDrawer ref={creditDrawerRef} />
          </>
        )}
      </Flex>
    );
  };
  const renderExtraContent = () => {
    return (
      <Flex gap="8px">
        {!!data?.[platform?.slug]?.assignToLink && !!showAssignToLink && (
          <Link to={data?.[platform?.slug]?.assignToLink}>
            <Button
              icon="FiUsers"
              color={data?.[platform?.slug]?.platform?.brandColor || tenantTheme['primary-color']}
              size="small"
            >
              {t('Assign to Users')}
            </Button>
          </Link>
        )}
        {renderUserSelect()}
      </Flex>
    );
  };

  const tabList = useMemo(() => {
    return (
      data?.[platform?.slug]?.products?.length &&
      data?.[platform?.slug]?.products.map((item) => ({
        key: item.slug,
        tab: t(item.title) + ` (${formatNumberString(item.dataSet?.[1], { maximumFractionDigits: 0 })})`,
      }))
    );
  }, [data?.[platform?.slug]?.products]);

  useEffect(() => {
    if (data?.[platform?.slug]?.products?.length) {
      setActiveTab(data?.[platform?.slug]?.products?.[0]?.slug);
    }
  }, [data?.[platform?.slug]?.products]);

  return error ? (
    <EmptyState message={error} onClick={refetch} buttonLoading={loading} />
  ) : (
    <div>
      <Card
        style={{ minHeight: cardHeight || (isMobile && 146), '--card-align': 'start', '--flex-direction': 'row' }}
        bodyStyle={{ padding: bodyPadding || isMobile ? 16 : 24 }}
        tabList={tabList?.length === 1 ? null : tabList}
        defaultActiveTabKey="premium_listing"
        activeTabKey={activeTab}
        onTabChange={(key) => {
          setActiveTab(key);
        }}
        headStyle={{
          borderBottom: 'none',
        }}
        accentColor={platform?.brandColor}
        loading={!!loading && !!fetching}
        title={renderQuotaCreditsCardTitle()}
        extra={renderExtraContent()}
      >
        {!!loading && !!fetching ? (
          <QCSkeleton isMobile={isMobile} />
        ) : (
          <Group template="initial" gap={widgetGap || (isMobile ? '12px' : '16px')}>
            {!!error ? (
              <EmptyState
                accentColor={platform?.brandColor}
                message={error}
                onClick={refetch}
                buttonLoading={loading}
              />
            ) : (
              <>
                {data?.[platform?.slug]?.products?.length ? (
                  <LoaderWrapper loading={!loading && !!fetching}>
                    <QuotaCreditsStatsWidget
                      available={data?.[platform?.slug]?.products?.find((e) => e?.slug === activeTab)?.available}
                      used={data?.[platform?.slug]?.products?.find((e) => e?.slug === activeTab)?.used}
                      total={data?.[platform?.slug]?.products?.find((e) => e?.slug === activeTab)?.total}
                      loading={!!loading && !!fetching}
                      currencyType={data?.[platform?.slug]?.products?.find((e) => e?.slug === activeTab)?.type}
                      brandColor={platform.brandColor}
                      showPackage={true}
                      platform={platform}
                      currentPackageDetails={data?.[platform?.slug]?.current_package_details}
                    />
                  </LoaderWrapper>
                ) : null}

                <Row justify={isMobile ? 'center' : 'end'} style={{ gap: '16px 0px' }} wrap>
                  {!!expiryData?.[platform?.slug] && !!expiryData?.[platform?.slug]?.productExpiryData?.length && (
                    <WarningNotice
                      style={{ width: 'initial', flex: '1 70%' }}
                      title={expiryData?.[platform?.slug]?.productExpiryData?.title}
                    />
                  )}

                  {!!loggedInUser?.contracts?.[platform?.slug] &&
                    !!loggedInUser?.contracts?.[platform?.slug]?.downgraded_contracts && (
                      <WarningNotice
                        style={{ '--warning-notice-bg': '#FCEAEA' }}
                        title={`${loggedInUser?.contracts?.[platform?.slug]?.downgraded_contracts} ${
                          loggedInUser?.contracts?.[platform?.slug]?.downgraded_contracts > 1
                            ? t('contracts are')
                            : t('contract is')
                        } ${t('downgraded')}.`}
                      />
                    )}
                </Row>

                {user?.isCurrencyUser && !isMemberArea && (
                  <Flex justify="center" gap="10px">
                    {tenantConstants?.ALLOW_CREDITS_TOPTUP && (
                      <Button
                        onClick={() => {
                          setTopUpModalVisible(true);
                        }}
                        type="primaryOutlined"
                        icon={'IoAddCircleOutline'}
                        size={isMobile && 'small'}
                        className="w-100"
                      >
                        {t('Top-Up your Credits')}
                      </Button>
                    )}
                    <Button
                      onClick={() => navigate(tenantRoutes.app().credits_usage.path)}
                      type="primaryOutlined"
                      icon={'PiClockClockwiseFill'}
                      size={isMobile ? 'small' : null}
                      className="w-100"
                    >
                      {t('Credits Usage')}
                    </Button>
                    {renderCreditTopUpModal()}
                  </Flex>
                )}
                {user?.isCurrencyUser && data?.[platform?.slug]?.products?.length
                  ? data?.[platform?.slug]?.products?.map((e, index) => {
                      if (data?.[platform?.slug]?.products?.find((e) => e?.slug === activeTab)?.expiring_credits) {
                        return (
                          <Flex key={index} align="center" className="w-100">
                            <WarningNotice
                              className="px-12 py-8"
                              icon="CreditIcon"
                              iconProps={{ size: isMobile ? '12px' : '16px' }}
                              textSize={isMobile ? '12px' : '14px'}
                              type="simple"
                              style={{
                                '--warning-notice-bg': '#FFFAF1',
                                '--align-items': 'center',
                                flexWrap: 'wrap',
                              }}
                              title={`${formatNumberString(
                                data?.[platform?.slug]?.products?.find((e) => e?.slug === activeTab)?.expiring_credits,
                              )} ${!isLiteExperienceURL() && user?.is_auto_utilization_enabled ? t('credits will be auto-utilized smartly within 7 days.') : t('credits are expiring within 7 days')}`}
                              extra={
                                !isLiteExperienceURL() &&
                                !user?.is_auto_utilization_enabled &&
                                user?.user_role_within_agency != 'staff' &&
                                tenantConstants.ENABLE_SMART_CREDITS_UTILISATION && (
                                  <TenantComponents.SmartCreditsUtilizationModal
                                    visible={smartCreditsModalVisible}
                                    setVisible={setSmartCreditsTopUpModalVisible}
                                  />
                                )
                              }
                            />
                          </Flex>
                        );
                      }
                    })
                  : null}
              </>
            )}
          </Group>
        )}
      </Card>
    </div>
  );
};

export default CreditsQuota;
