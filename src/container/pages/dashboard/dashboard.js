import tenantConstants from '@constants';
import tenantRoutes from '@routes';
import tenantTheme from '@theme';
import tenantUtils from '@utils';
import { Row } from 'antd';
import cx from 'clsx';
import React, { useCallback, useEffect, useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import DashboardPromoBanner from '../../../components/dashboard-promo-banner/dashboard-promo-banner';
import { useSelector } from 'react-redux';
import {
  Avatar,
  Flex,
  Group,
  Icon,
  LinkWithIcon,
  SectionIntroModal,
  Select,
  Skeleton,
  Spinner,
  TextWithIcon,
} from '../../../components/common';
import { Dropdown } from '../../../components/common';
import LoaderWrapper from '../../../components/common/loader-wrapper/loader-wrapper';
import { ListingCardContainer } from '../../../components/listing-card-container/ListingCardContainer';
import { ListingContainer } from '../../../components/listing-container/ListingContainer';
import PlatfromSwitch from '../../../components/platform-switch/platform-switch';
import TruBrokerAndProfileCard from '../../../components/tru-broker/tru-broker-and-profile-cards';
import TruBrokerStatus from '../../../components/tru-broker/tru-broker-status';
import TruBrokerTag from '../../../components/tru-broker/tru-broker-tag';
import TruPointsWidget from '../../../components/tru-broker/tru-points-widget';
import { CreditsQuota, ListingBreakdown } from '../../../components/widgets';
import ReportsLeadsTrafficSection from '../../../components/widgets/ReportsLeadsTrafficSection';
import { ContainerWidgets } from '../../../components/widgets/styled';
import { usePageTitle } from '../../../hooks';
import { useDashboardData } from '../../../hooks/useDashboardData';
import {
  clickMarketingBannerEvent,
  pageViewDashboardEvent,
  selectAgentDashboardClickEvent,
} from '../../../services/analyticsService';
import { getBaseURL } from '../../../utility/env';
import { resolveDashboardBannerDisplay } from '../../../utility/dashboardBanners';
import { Main } from '../../styled';
import { CardMetaStyled } from '../user-settings/style';

function Dashboard() {
  const { t, i18n } = useTranslation();
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const rtl = useSelector((state) => state.app.AppConfig.rtl);
  usePageTitle(t('Dashboard - Profolio'));
  const { user: loginUser } = useSelector((state) => state.app.loginUser);
  const { selectedUser: user } = useSelector((state) => state.app.Dashboard);
  const isMultiPlatform = useMemo(() => user?.platforms?.length > 1, [user?.id]);
  const tapTargets = (() => {
    const raw = localStorage.getItem('tapTargets');
    return raw != null && raw !== 'undefined' ? JSON.parse(raw) : null;
  })();
  const SHOW_INTRO_MODAL =
    !tapTargets?.lms?.introModal?.hide && tenantConstants.IS_LMS_ENABLED && loginUser?.is_lms_enabled;
  const selectedPlatform = useSelector((state) => state.app.sectionPlatform?.dashboard);

  useEffect(() => {
    pageViewDashboardEvent(loginUser);
  }, []);

  const safeParse = (value) => (value != null && value !== 'undefined' ? JSON.parse(value) : null);
  const hideCompletionSuccessPopUp = safeParse(localStorage.getItem(`hideSuccessPopUp_${loginUser?.id}`));
  const profileCompletionScore = safeParse(localStorage.getItem(`showCompletionModal_${loginUser?.id}`));
  const userTruBrokerDate = safeParse(localStorage.getItem(`truBrokerDate_${loginUser?.id}`));

  const onCloseIntroModal = () => {
    localStorage.setItem(
      'tapTargets',
      JSON.stringify({
        ...(tapTargets && tapTargets),
        lms: { ...(tapTargets?.lms && tapTargets?.lms), introModal: { hide: true } },
      }),
    );
  };

  const {
    handleUserFilterChange,
    agencyUsers,
    listingsTableData,
    listingsLoading,
    listingsFetching,
    refetchTableData,
    tableError,
    tableColumns,
    emptyState,
  } = useDashboardData(isMultiPlatform && !tenantConstants.MULTIPLATFROM_VIEW ? selectedPlatform : null);

  const dashboardBanner = useMemo(() => {
    if (tenantConstants.COUNTRY_CODE !== 'SA') return null;
    return resolveDashboardBannerDisplay({
      banners: loginUser?.banners,
      isMobile,
      language: i18n.language,
    });
  }, [loginUser?.banners, isMobile, i18n.language]);

  const onMarketingBannerClick = useCallback(() => {
    if (!dashboardBanner?.href) return;
    clickMarketingBannerEvent(loginUser, {
      language: i18n.language,
      pageTitle: t('Dashboard - Profolio'),
      bannerId: dashboardBanner.id,
    });
  }, [dashboardBanner?.href, dashboardBanner?.id, loginUser, i18n.language, t]);

  const showLMSIntroTour = () => {
    if (
      (loginUser?.profile_completion?.score == 100 && profileCompletionScore == loginUser?.profile_completion?.score) ||
      (loginUser?.tru_broker_start_date && userTruBrokerDate == loginUser?.tru_broker_start_date)
    ) {
      if (!!hideCompletionSuccessPopUp) {
        return true;
      } else {
        return false;
      }
    }
    return true;
  };

  const renderUserSelect = useCallback(() => {
    const isAgencyVerified = user?.agency?.is_verified;

    const avatarWithVerifiedIcon = (avatar) => {
      if (tenantConstants.SHOW_VERIFIED_ICON && isAgencyVerified) {
        return (
          <div style={{ position: 'relative', display: 'inline-block' }}>
            {avatar}
            <div
              style={{
                position: 'absolute',
                top: -6,
                [rtl ? 'right' : 'left']: 20,
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon
                icon="PiSealCheckFill"
                size="14px"
                style={{ color: tenantTheme['info-color-alt'] || '#1890ff' }}
              />
            </div>
          </div>
        );
      }
      return avatar;
    };
    
    return (
      <Flex
        wrap
        align="center"
        // className="w-100"
        justify="space-between"
        gap={isMobile ? (isMultiPlatform ? '20px 30px' : '6px') : null}
      >
        <CardMetaStyled
          className="p-0 "
          gap="8px"
          avatar={avatarWithVerifiedIcon(
            <Avatar iconSize={24} src={user?.profile_image} style={{ alignSelf: 'center', verticalAlign: 'middle' }} />
          )}
          style={{
            '--card-height': !isMobile && '33px',
            gap: isMobile ? '6px' : '8px',
          }}
          titleFontWeight="700"
          title={
            <Flex gap="8px" align="center" justify="flex-start" style={{ height: '100%' }}>
              <span>{tenantUtils.getLocalisedString(user, 'name')}</span>
              {loginUser?.is_agency_admin && (
                <Dropdown
                  placement="bottomLeft"
                  options={agencyUsers}
                  getOptionLabel={(op) =>
                    op
                      ? `${op.name || ''} ${op.id === loginUser?.id ? t('(Me)') : op.id === -1 ? t('(Agency)') : ''}`
                      : ''
                  }
                  getOptionValue={(op) => op.id}
                  onChange={(option) => {
                    selectAgentDashboardClickEvent(user, option?.name);
                    handleUserFilterChange(option);
                  }}
                  suffixIcon="MdKeyboardArrowDown"
                  suffixIconProps={{ color: tenantTheme['primary-color'] }}
                  placeholder=""
                  iconSize="14px"
                  type="primary"
                  style={{
                    padding: '8px',
                    // marginInline: !isMobile ? '8px' : undefined,
                    // width: 'fit-content',
                    gap: 0,
                  }}
                  groupStyle={{ minWidth: 'auto' }}
                  horizontal
                  value={null}
                  accentColor={tenantTheme['primary-color']}
                  inputLoading={false}
                  popupMatchSelectWidth={false}
                />
              )}
              {tenantConstants.TRU_BROKER_ENABLED && user?.is_tru_broker && (
                <TruBrokerTag
                  borderRadius="4px"
                  padding={isMobile && '4px 6px'}
                  style={{ height: 'max-content' }}
                  tagText={
                    <Trans i18nKey={'truBroker'} components={{ span: <span className="fw-700" />, sup: <sup /> }} />
                  }
                />
              )}
            </Flex>
          }
        />

        {isMultiPlatform && !tenantConstants.MULTIPLATFROM_VIEW && (
          <PlatfromSwitch
            size={isMobile && 'small'}
            platformSwitchStyle={{
              flexGrow: isMobile && 1,
              marginTop: isMobile && '-12px',
              minWidth: !isMobile && '300px',
            }}
            section="dashboard"
          />
        )}
      </Flex>
    );
  }, [user?.id, loginUser, agencyUsers, rtl]);

  const renderTruBrokerAndTruPointsWidget = () => {
    return (
      <>
        <div>
          <TruBrokerStatus user={user} />
        </div>
        <div>
          <TruPointsWidget cardStyle={{ height: !isMobile && '220px', '--ant-padding-lg': '16px 24px' }} user={user} />
        </div>
      </>
    );
  };

  const renderMultiPlatformsLabel = () => {
    return loginUser?.is_agency_admin || isMultiPlatform ? (
      // <div className="stickyHeadingBorad">
      <div className="">
        <div className="mb-24">{renderUserSelect()}</div>
        <>
          {isMultiPlatform && tenantConstants.MULTIPLATFROM_VIEW && (
            <Group template="repeat(auto-fit, minmax(min(40ch, 100%), 1fr))" gap="16px">
              {user?.platforms?.map((platform) => {
                return (
                  <TextWithIcon
                    className="mb-8"
                    iconProps={{ hasBackground: true, iconBackgroundColor: '#fff' }}
                    title={platform.name}
                    textSize="18px"
                    textColor="#272b41"
                    loading={!user}
                    loadingProps={{ avatarSize: 38, rectSize: 'default' }}
                    lead
                    key={platform?.slug}
                    icon={platform?.icon}
                  />
                );
              })}
            </Group>
          )}
        </>
      </div>
    ) : null;
  };

  const renderBreakDownWidget = (platform) => {
    return (
      <>
        <Flex vertical>
          <ListingBreakdown
            brandColor={platform?.brandColor}
            platform={platform?.slug}
            user={user}
            linear={false}
            trends={false}
            cardBodyStyle={{ height: '100%' }}
          />
        </Flex>
        <div>{renderQuotaCreditsMobile(platform)}</div>
        {tenantConstants.TRU_BROKER_ENABLED && user?.tru_broker_start_date && renderTruBrokerAndTruPointsWidget()}
      </>
    );
  };

  const renderQuotaCreditsMobile = (platform) => {
    return (
      <CreditsQuota
        key={platform?.slug}
        platform={platform}
        setUserId={() => {}}
        usersPermission={false}
        users={agencyUsers}
        // expiryData={quotaCreditsData.productExpiryData?.[platformKey]}
        // downgradedData={user?.contracts?.[platformKey]}
        loggedInUser={user}
        userId={user.id}
        isDashboard
        widgetGap={!isMobile && '8px'}
        rowHeight={isMobile ? '50px' : '34px'}
        user={user}
      />
    );
  };

  const renderListingBreakDownWidget = useCallback(() => {
    return (
      <Group className="c-listing-credits" template="repeat(2, minmax(0, 1fr))" gap="16px">
        {isMultiPlatform && tenantConstants.MULTIPLATFROM_VIEW
          ? user?.platforms?.map((platform) => {
              return (
                <Flex key={platform?.slug} vertical gap="24px">
                  {renderBreakDownWidget(platform)}
                </Flex>
              );
            })
          : renderBreakDownWidget(selectedPlatform)}
      </Group>
    );
  }, [selectedPlatform, isMultiPlatform, tenantConstants, user]);

  const renderListings = () => {
    return (
      <div>
        {listingsLoading && listingsFetching ? (
          <Skeleton type="button" />
        ) : (
          <Row className="px-4 mb-8" justify="space-between" style={{ alignItems: 'baseline', gap: 24 }}>
            <TextWithIcon
              className="fz-16"
              title={t('Recent Listings')}
              textColor={tenantTheme['base-color']}
              fontWeight={700}
              loadingProps={{ avatarSize: 24, rectSize: 'small' }}
            />
            <LinkWithIcon
              linkTitle={t('View All Listings')}
              link={tenantRoutes.app().listings.path}
              color={tenantTheme.gray700}
            />
          </Row>
        )}
        <ListingContainer
          className="p-0"
          listingsData={{ ...listingsTableData, ...tableColumns }}
          loading={listingsFetching}
          skeletonLoading={listingsLoading && listingsFetching}
          activeTab={10}
          enableFilters={false}
          paginationOnBottom={false}
          error={tableError}
          onRetry={refetchTableData}
          emptyState={emptyState}
        />
      </div>
    );
  };

  const desktopDashboard = () => {
    return user?.isLoading ? (
      <Spinner />
    ) : (
      <>
        <ContainerWidgets>
          {renderMultiPlatformsLabel()}
          {renderListingBreakDownWidget()}
          {!tenantConstants.HIDE_REPORTS && (
            <ReportsLeadsTrafficSection
              chartTitle={t('Breakdown By Date')}
              user={user}
              isDashboard={true}
              section={'dashboard'}
            />
          )}
          {renderListings()}
        </ContainerWidgets>
      </>
    );
  };

  const renderListingMobileWidget = () => {
    return (
      <div>
        {isMultiPlatform && tenantConstants.MULTIPLATFROM_VIEW ? (
          user?.platforms?.map((platform) => (
            <ContainerWidgets key={platform?.slug} gap="0px">
              <ListingBreakdown
                brandColor={platform?.brandColor}
                platform={platform?.slug}
                user={user}
                linear={false}
                trends={false}
                icon={platform?.icon}
              />
            </ContainerWidgets>
          ))
        ) : (
          <ListingBreakdown
            brandColor={selectedPlatform?.brandColor}
            platform={selectedPlatform?.slug}
            user={user}
            linear={false}
            trends={false}
          />
        )}
      </div>
    );
  };

  const renderListingMobile = () => {
    return (
      <div>
        <LoaderWrapper loading={!listingsFetching && listingsLoading}>
          <ListingCardContainer
            renderFiltersAsTopRight={false}
            showAllLink
            listingsData={{ ...listingsTableData, ...tableColumns }}
            loading={listingsFetching}
            enableFilters={false}
            pagination={listingsTableData?.pagination}
            showPagination={false}
            error={tableError}
            onRetry={refetchTableData}
            skeletonLoading={listingsLoading && listingsFetching}
            emptyState={emptyState}
          />
        </LoaderWrapper>
      </div>
    );
  };

  const mobileDashboard = () => {
    return user?.isLoading ? (
      <Spinner />
    ) : (
      <>
        <div className={cx('mb-0 ', isMultiPlatform && 'stickyHeadingBorad')} style={{ '--top-space': '20px' }}>
          {renderUserSelect()}
        </div>
        {renderListingMobileWidget()}
        {tenantConstants.TRU_BROKER_ENABLED && user?.tru_broker_start_date && renderTruBrokerAndTruPointsWidget()}
        {isMultiPlatform && tenantConstants.MULTIPLATFROM_VIEW
          ? user?.platforms?.map((e, i) => renderQuotaCreditsMobile(e, i))
          : renderQuotaCreditsMobile(selectedPlatform)}
        <ReportsLeadsTrafficSection
          chartTitle={t('Breakdown By Date')}
          user={user}
          isDashboard={true}
          section={'dashboard'}
        />
        {renderListingMobile()}
      </>
    );
  };

  return (
    <Main>
      {SHOW_INTRO_MODAL && showLMSIntroTour() && (
        <SectionIntroModal
          title={t('Introducing Leads Management')}
          description={t('Effortlessly manage leads and convert buyer or tenant inquiries into successful deals with Bayut\'s Lead Management System')}
          btnText={t('View Leads')}
          coverImageUrl={`${getBaseURL()}/profolio-assets/images/lead-managment-popup.svg`}
          redirectUrl={tenantRoutes?.app('', false, loginUser)?.leads_dashboard?.path}
          onClose={onCloseIntroModal}
        />
      )}
      {/* <TenantComponents.PageAlerts /> */}
      <Group>
        {dashboardBanner && (
          <DashboardPromoBanner
            imageUrl={dashboardBanner.imageUrl}
            title={dashboardBanner.title}
            href={dashboardBanner.href}
            isMobile={isMobile}
            onBannerClick={onMarketingBannerClick}
          />
        )}
        {user?.id && <TruBrokerAndProfileCard user={user} />}
        {isMobile ? mobileDashboard() : desktopDashboard()}
      </Group>
    </Main>
  );
}

export default Dashboard;
