import tenantConstants from '@constants';
import TenantComponents from '@components';
import tenantRoutes from '@routes';
import { Col, Row, Typography, Badge } from 'antd';
import cx from 'clsx';
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Button, Card, Flex, Heading, Icon } from '../../../../components/common';
import { useRouteNavigate } from '../../../../hooks';
import OtpVerificationModal from '../../../../components/otp-verification-modal/otp-verification-modal';
import { useSendLicenseOtpMutation, useVerifyLicenseOtpMutation } from '../../../../apis/postlisting';
import { PropertyCard } from '../../../../container/pages/post-listing/styled';
import { notification } from '../../../../components/common';
import {
  customEventClick,
  regaAdValidationEvent,
  selectListingTypeClickEvent,
} from '../../../../services/analyticsService';
import { usePostNewListingMutation } from '../../../../apis/postlisting';
import { getBaseURL, getClassifiedBaseURL } from '../../../../utility/env';
import LimitNonSaudiNationalModal from '../../../../components/limitNonSaudiNationalModal/LimitNonSaudiNationalModal';
const { Text, Title } = Typography;
import PermitValidation from './permit-validation';
import { getLocaleForURL } from '../../../../utility/language';
const cardList = [
  {
    id: 1,
    icon: 'PropertyIcon',
    propertyType: 'Sell or Rent Property',
    description: 'Find buyers and tenants for your property',
  },
  {
    id: 2,
    icon: 'RentalIcon',
    propertyType: 'Daily Rentals',
    description: 'Host guests at your place for short stays',
  },
];

const PostListingWithPropertyType = () => {
  const { t } = useTranslation();
  const isFalOtpVerificationEnabled = tenantConstants?.ENABLE_FAL_LICENSE_OTP_VERIFICATION;
  const [selectedCardId, setSelectedCardId] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showAdLicenseField, setShowAdLicenseField] = useState(false);
  const [showPermitField, setShowPermitField] = useState(false);
  const navigate = useRouteNavigate();
  const otpVerifyRef = useRef();
  const [sendLicenseOtp] = useSendLicenseOtpMutation();
  const [verifyLicenseOtp] = useVerifyLicenseOtpMutation();
  const [otpListingId, setOtpListingId] = useState(null);
  const [otpPhoneNumber, setOtpPhoneNumber] = useState(null);
  const [otpReferenceNumber, setOtpReferenceNumber] = useState(null);
  const [hasRateLimitError, setHasRateLimitError] = useState(false);
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const { user } = useSelector((state) => state.app.loginUser);
  const [postNewListing, _] = usePostNewListingMutation();

  const getSelectedListingType = (id) => {
    return cardList.find((item) => item.id === id)?.propertyType;
  };

  const handleCardClick = (id) => {
    setSelectedCardId(id);
    customEventClick(user, {
      itemId: `property_card_${id}`,
      additionalInfo: getSelectedListingType(id),
    });
  };
  const postNewListings = async (values, onResponseSuccess = () => { }) => {
    setLoading(true);
    setHasRateLimitError(false);
    const response = await postNewListing(values);
    if (response) {
      onResponseSuccess(response);
      setLoading(false);
      if (response?.error) {
        notification.error(response?.error?.errorMessage || response?.error?.message || t('Something went wrong'));
      } else {
        const listingId = response?.data?.listing?.id;
        if (isFalOtpVerificationEnabled && response?.data?.is_otp_required) {
          const sendRes = await sendLicenseOtp({
            listing_id: listingId,
            user_id: user?.id,
            identifier: response?.data?.phone_number,
          });
          if (sendRes?.error) {
            notification.error(sendRes?.error);
          } else {
            setOtpReferenceNumber(sendRes?.data?.reference_number);
            setOtpListingId(listingId);
            setOtpPhoneNumber(response?.data?.phone_number);
            otpVerifyRef?.current?.showModal('mobile');
          }
        } else {
          navigate(`${tenantRoutes.app().post_listing.path}/${listingId}`);
          !values?.is_daily_rental && regaAdValidationEvent(user);
        }
      }
    }
  };
  const handleClickOnListingSelection = () => {
    customEventClick(user, {
      itemId: selectedCardId,
      additionalInfo: getSelectedListingType(selectedCardId), // Send additional info
    });
    selectListingTypeClickEvent(user, getSelectedListingType(selectedCardId));

    if (!user?.is_package_user && tenantConstants?.NAVIGATE_TO_ADD_PROPERTY && selectedCardId === 2) {
      const localePath = getLocaleForURL();
      const baseUrl = `${getClassifiedBaseURL()}${localePath}/stays/become-host/`;
      window.location.href = baseUrl;
      return;
    }

    if (selectedCardId == 2) {
      setShowPermitField(true);
    } else {
      setShowAdLicenseField(true);
    }
  };
  const renderPropertyCards = (selectedCard) => {
    return (
      <PropertyCard
        style={{ borderWidth: 1, '--ant-padding-lg': isMobile ? '12px' : '24px' }}
        key={selectedCard.id}
        onClick={() => handleCardClick(selectedCard.id)}
        className={cx('pointer ', selectedCard.id === selectedCardId && 'active-card')}
      >
        <Flex align="start" vertical={!isMobile && true} gap="8px">
          <Icon icon={selectedCard.icon} iconProps={{ size: isMobile ? '36px' : '52px' }} />
          <div>
            <Title
              className="mb-0"
              level={5}
              style={{ '--ant-font-weight-strong': '700', fontSize: isMobile ? '14px' : '18px' }}
            >
              {t(selectedCard.propertyType)}
            </Title>
            <Text className={!isMobile && 'fz-16'} type="secondary">
              {t(selectedCard.description)}
            </Text>
          </div>
        </Flex>
      </PropertyCard>
    );
  };

  return (
    <>
      <LimitNonSaudiNationalModal actionSource="upgrade" />

      {!showAdLicenseField && !showPermitField ? (
        <>
          <Row style={{ marginBlockStart: '20px' }}>
            <Col xs={24} lg={18} xxl={15} style={{ margin: 'auto' }}>
              <Button
                size="small"
                className="mb-8"
                style={{ border: 0 }}
                type="primaryOutlined"
                icon="IoMdArrowRoundBack"
                onClick={() => navigate(-1)}
                iconSize="14px"
              >
                {' '}
                {t('Back')}
              </Button>
              <Card bodyStyle={{ padding: isMobile ? 16 : 40 }}>
                <Flex
                  className="w-100 m-auto"
                  vertical
                  align="center"
                  justify={!isMobile ? 'center' : null}
                  style={{ minHeight: '410px', maxWidth: '560px' }}
                >
                  <div className={cx(isMobile ? 'mb-20' : 'mb-40', 'text-center')}>
                    <Heading
                      as={isMobile ? 'h6' : null}
                      className={isMobile ? 'mb-0' : 'mb-8'}
                      style={{ fontWeight: '700' }}
                    >
                      {t('Post a Listing')}
                    </Heading>
                    <Text className={isMobile ? 'fz-12' : 'fz-16'} type="secondary">
                      {t('Choose the type of listing you want to publish')}
                    </Text>
                  </div>
                  {/* Make a common component for type selection */}
                  <Flex vertical={isMobile && true} className="mb-16" gap="20px">
                    {cardList.map((item) =>
                      item?.id == 2 ? (
                        <Badge.Ribbon key={item.id} text={t('NEW')} color="red" placement="end">
                          {renderPropertyCards(item)}
                        </Badge.Ribbon>
                      ) : (
                        renderPropertyCards(item)
                      ),
                    )}
                  </Flex>

                  <Button
                    className="w-100"
                    onClick={handleClickOnListingSelection}
                    loading={loading}
                    type={'primary'}
                    size={'large'}
                    disabled={user?.is_nafaz_verified && !user?.is_saudi_national}
                  >
                    {t('Continue')}
                  </Button>
                </Flex>
              </Card>
            </Col>
          </Row>
        </>
      ) : showPermitField ? (
        <PermitValidation postNewListing={postNewListings} setShowPermitField={setShowPermitField} />
      ) : (
        <TenantComponents.LicenseValidation
          postNewListing={postNewListings}
          setShowAdLicenseField={setShowAdLicenseField}
        />
      )}
      {isFalOtpVerificationEnabled && (
        <OtpVerificationModal
          ref={otpVerifyRef}
          value={otpPhoneNumber}
          okText={t('Verify')}
          onSuccess={() => {
            setOtpPhoneNumber(null);
            if (otpListingId) navigate(`${tenantRoutes.app().post_listing.path}/${otpListingId}`);
          }}
          onCancelModal={() => {
            setLoading(false);
            setOtpPhoneNumber(null);
            if (hasRateLimitError) {
              navigate(tenantRoutes.app().listings.path);
            }
          }}
          onFail={() => {
            setLoading(false);
          }}
          customVerifyFunction={async (_val, otpCode) => {
            const res = await verifyLicenseOtp({ otp: otpCode, reference_number: otpReferenceNumber });
            if (res?.error) {
              if (res?.error?.status === 429) {
                setHasRateLimitError(true);
              }
              return { error: res?.error?.message };
            }
            return res;
          }}
          customResendFunction={async () => {
            const res = await sendLicenseOtp({
              listing_id: otpListingId,
              user_id: user?.id,
              identifier: otpPhoneNumber,
            });
            if (!res?.error) {
              setOtpReferenceNumber(res?.data?.reference_number);
            }
            return res;
          }}
          disableActions={hasRateLimitError}
        />
      )}
    </>
  );
};
export default PostListingWithPropertyType;
