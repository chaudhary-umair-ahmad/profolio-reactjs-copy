import tenantConstants from '@constants';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import AgencyHeader from '../../../components/agency-staff-header/agancy-staff-header';
import { Button, EmptyState, Flex, Group, LoaderWrapper, Skeleton } from '../../../components/common';
import { UserForm } from '../../../components/forms/AgencyUserForm';
import { InviteUser } from '../../../components/invite-user/inviteUser';
import { ListingContainer } from '../../../components/listing-container/ListingContainer';
import SetCreditsLimit from '../../../components/set-credit-limit/set-credit-limit';
import { strings } from '../../../constants/strings';
import { usePageTitle } from '../../../hooks';
import { pageViewAgencyStaffEvent } from '../../../services/analyticsService';
import { TENANT_KEY } from '../../../utility/env';
import { Main } from '../../styled';
import AgencyStaffMobilePage from './agency-staff-mobile';
import { useGetAgencyStaffListQuery, useGetAgencySeatsSummaryQuery } from '../../../apis/agency';
import { useGetQuotaCreditsWidgetDataQuery } from '../../../apis/quotaCredits';
import QuotaCreditsStatsWidget from '../../../components/widgets/QuotaCreditsStatWidget';
import AgencyInfoCard from '../../../components/agency-staff-header/agency-info-card';
import { Col, Row, Space } from 'antd';
import { AppstoreOutlined, UserOutlined, CreditCardOutlined } from '@ant-design/icons';
import {
  UserCard,
  SeatsContainer,
  StyledCard,
  IconWrapper,
  CardTitle,
  CardSubtitle,
  CountText,
  StatLabel,
  StatValue,
} from './styled';

const AgencyStaffPage = () => {
  const { t } = useTranslation();
  usePageTitle(t('Agency Staff - Profolio'));
  const [showUserForm, setShowUserForm] = useState(false);
  const [showInviteUser, setShowInviteUser] = useState(false);
  const user = useSelector((state) => state.app.loginUser.user);
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const [showCreditModal, setShowCreditModal] = useState(false);
  
  const is_zameen_package_user = user?.is_zameen_package_user;
  
  const { data: seatsSummary, isLoading: isLoadingSeats, error: seatsError, refetch: refetchSeats } = useGetAgencySeatsSummaryQuery(
    user?.agency?.id, 
    {
      skip: !user?.agency?.id || !is_zameen_package_user,
      refetchOnMountOrArgChange: true,
    }
  );

  useEffect(() => {
    pageViewAgencyStaffEvent(user);
  }, []);

  const {
    data: agencyDetails,
    error,
    isLoading: loading,
    isFetching,
    refetch,
  } = useGetAgencyStaffListQuery(user?.agency?.id, {
    skip: !user?.agency?.id,
    refetchOnMountOrArgChange: true,
  });

  const {
    data: quotaCreditsData,
    isLoading: quotaLoading,
    isFetching: quotaFetching,
  } = useGetQuotaCreditsWidgetDataQuery(
    {
      ...(user?.id != -1 && { [user?.isCurrencyUser ? 'subject_id' : 'q[user_id_eq]']: user?.id }),
      platform_id: [user?.platforms?.[0]?.id],
    },
    {
      skip: !user?.id || TENANT_KEY !== 'zameen',
      refetchOnMountOrArgChange: true,
    },
  );

  return !!error ? (
    <EmptyState title={strings.error_} message={error} onClick={refetch} buttonLoading={isFetching || loading} />
  ) : (
    <>
      <Main>
        {isMobile && (TENANT_KEY == 'bayut' || TENANT_KEY == 'oman' || TENANT_KEY == 'eg') ? ( //TODO RTKQ
          <Group gap="8px" style={{ paddingBlock: '4px 28px' }}>
            <LoaderWrapper loading={isFetching && !loading}>
              <AgencyStaffMobilePage agencyStaff={agencyDetails} title={t('Manage Staff')} loading={loading} />
            </LoaderWrapper>
          </Group>
        ) : (
          <div>
            {TENANT_KEY == 'zameen' ? (
              <>
              <Group gap="16px" template="repeat(auto-fit, minmax(min(32ch, 100%), 1fr))">
                <UserCard
                  className={isMobile ? 'mb-8' : 'mb-24'}
                  style={{ borderWidth: 0 }}
                  bodyStyle={{ paddingInline: 16 }}
                >
                  <Flex align={isMobile ? 'start' : 'center'} justify="space-between" className="fs14 color-gray-dark">
                    {<AgencyInfoCard agencyData={agencyDetails} loading={loading} />}

                    <div style={{ width: 'auto' }}>
                      <LoaderWrapper loading={quotaLoading || quotaFetching}>
                        <QuotaCreditsStatsWidget
                          available={quotaCreditsData?.[user?.platforms?.[0]?.slug]?.products?.[0]?.available}
                          used={quotaCreditsData?.[user?.platforms?.[0]?.slug]?.products?.[0]?.used}
                          total={quotaCreditsData?.[user?.platforms?.[0]?.slug]?.products?.[0]?.total}
                          loading={quotaLoading || quotaFetching}
                          currencyType={quotaCreditsData?.[user?.platforms?.[0]?.slug]?.products?.[0]?.type}
                          brandColor={user?.platforms?.[0]?.brandColor}
                          showPackage={true}
                          style={{ width: 'auto' }}
                        />
                      </LoaderWrapper>
                    </div>
                  </Flex>
                </UserCard>
              </Group>
              {is_zameen_package_user && tenantConstants.SHOW_AGENCY_STAFF_SEATS_STATS && (
                <LoaderWrapper loading={isLoadingSeats}>
                  <SeatsContainer>
                    <Row gutter={[16, 16]} justify="center">
                      <Col xs={24} sm={12} md={8}>
                        <StyledCard bg="#f5faff" border="#e6f0ff">
                          <Space align="start">
                            <IconWrapper bg="#e6f0ff" color="#1677ff">
                              <AppstoreOutlined />
                            </IconWrapper>
                            <div>
                              <CardTitle noMargin>{seatsSummary?.seats_summary?.package_name || 'Package'}</CardTitle>
                              <CardSubtitle>Total Allocated Seats</CardSubtitle>
                              <CountText>{seatsSummary?.seats_summary?.total_allocated_seats || 0}</CountText>
                            </div>
                          </Space>
                        </StyledCard>
                      </Col>
                      <Col xs={24} sm={12} md={8}>
                        <StyledCard bg="#f6fff9" border="#d9f7be">
                          <Space align="start">
                            <IconWrapper bg="#e9fce9" color="#52c41a">
                              <UserOutlined />
                            </IconWrapper>
                            <div style={{ flex: 1 }}>
                              <CardTitle>Free Seats</CardTitle>
                              <Row gutter={[8, 8]}>
                                <Col span={8}>
                                  <StatLabel>Total</StatLabel>
                                  <StatValue>{seatsSummary?.seats_summary?.free_seats?.total_free_seats || 0}</StatValue>
                                </Col>
                                <Col span={8}>
                                  <StatLabel>Used</StatLabel>
                                  <StatValue>{seatsSummary?.seats_summary?.free_seats?.consumed_free_seats || 0}</StatValue>
                                </Col>
                                <Col span={8}>
                                  <StatLabel>Available</StatLabel>
                                  <StatValue color="#52c41a">
                                    {seatsSummary?.seats_summary?.free_seats?.available_free_seats || 0}
                                  </StatValue>
                                </Col>
                              </Row>
                            </div>
                          </Space>
                        </StyledCard>
                      </Col>
                      <Col xs={24} sm={12} md={8}>
                        <StyledCard bg="#f5faff" border="#bae7ff">
                          <Space align="start">
                            <IconWrapper bg="#e6f7ff" color="#1890ff">
                              <CreditCardOutlined />
                            </IconWrapper>
                            <div style={{ flex: 1 }}>
                              <CardTitle>Paid Seats</CardTitle>
                              <Row gutter={[8, 8]}>
                                <Col span={8}>
                                  <StatLabel>Total</StatLabel>
                                  <StatValue>{seatsSummary?.seats_summary?.paid_seats?.total_paid_seats || 0}</StatValue>
                                </Col>
                                <Col span={8}>
                                  <StatLabel>Used</StatLabel>
                                  <StatValue>{seatsSummary?.seats_summary?.paid_seats?.consumed_paid_seats || 0}</StatValue>
                                </Col>
                                <Col span={8}>
                                  <StatLabel>Available</StatLabel>
                                  <StatValue color="#1677ff">
                                    {seatsSummary?.seats_summary?.paid_seats?.available_paid_seats || 0}
                                  </StatValue>
                                </Col>
                              </Row>
                            </div>
                          </Space>
                        </StyledCard>
                      </Col>
                    </Row>
                  </SeatsContainer>
                </LoaderWrapper>
              )} 
              </>
            ) : (
              <>
                {(!!tenantConstants.IS_CREDIT_CAPPING_ENABLED || tenantConstants?.AGENCY_STAFF_HEADER) && (
                  <LoaderWrapper loading={isFetching && !loading}>
                    <AgencyHeader user={user} agencyStaff={agencyDetails} loading={loading} isMobile={isMobile} />
                  </LoaderWrapper>
                )}
              </>
            )}
            <LoaderWrapper loading={isFetching && !loading}>
              <ListingContainer
                className={!isMobile && 'mb-16'}
                title={t('Manage Staff')}
                listingsData={agencyDetails}
                listingApi={(params) => fetchListing(user?.agency?.id, params)}
                extraRowProps={{ 
                  seatsFull: seatsSummary?.seats_summary?.seats_full,
                  refetchSeats
                }}
                loading={loading}
                enableFilters={false}
                isMain={false}
                actionBtn={
                  !agencyDetails?.list?.length && loading ? (
                    <Skeleton type="button" />
                  ) : (
                    <div>
                      {tenantConstants.IS_CREDIT_CAPPING_ENABLED &&
                        !!user?.is_credit_user &&
                        user?.user_role_within_agency == 'owner' &&
                        agencyDetails?.cappedUsersList?.length > 0 && (
                          <Button
                            type="primaryOutlined"
                            icon="IconCreditLimit"
                            iconSize="16px"
                            outlined
                            onClick={() => {
                              setShowCreditModal(true);
                            }}
                            style={{ marginInlineEnd: '8px' }}
                          >
                            {t('Set Credits Limit')}
                          </Button>
                        )}
                      {tenantConstants.INVITE_USER_TO_AGENCY_ENABLED && (
                        <Button
                          type="primaryOutlined"
                          icon="MdPersonAddAlt"
                          outlined
                          onClick={() => {
                            setShowInviteUser(true);
                          }}
                        >
                          {t('Invite User')}
                        </Button>
                      )}
                      {tenantConstants.ADD_USER_TO_AGENCY_FORM_ENABLED && (
                        <Button
                          type="primaryOutlined"
                          icon="MdPersonAddAlt"
                          outlined
                          disabled={
                            is_zameen_package_user &&
                            (seatsSummary?.seats_summary?.total_allocated_seats || 0) <= (agencyDetails?.list?.length || 0)
                          }
                          onClick={() => {
                            setShowUserForm(true);
                          }}
                        >
                          {t('Add Agency User')}
                        </Button>
                      )}
                    </div>
                  )
                }
              />
            </LoaderWrapper>

            {tenantConstants.ADD_USER_TO_AGENCY_FORM_ENABLED && (
              <UserForm isVisible={showUserForm} setIsVisible={setShowUserForm} agencyId={user?.agency?.id} refetchSeats={refetchSeats}/>
            )}
            {tenantConstants.INVITE_USER_TO_AGENCY_ENABLED && (
              <InviteUser isVisible={showInviteUser} setIsVisible={setShowInviteUser} agencyId={user?.agency?.id} />
            )}
            {tenantConstants.IS_CREDIT_CAPPING_ENABLED && (
              <SetCreditsLimit isVisible={showCreditModal} setIsVisible={setShowCreditModal} data={agencyDetails} />
            )}
          </div>
        )}
      </Main>
    </>
  );
};

export default AgencyStaffPage;
