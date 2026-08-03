import tenantConstants from '@constants';
import tenantRoutes from '@routes';
import tenantTheme from '@theme';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { ActionPopOver, Button, Group, Icon, notification } from '../../../../../components/common';
import RenderUpgradeIcons from '../../../../../components/common/upgrade-icons/upgrade-icons';
import { TIME_DATE_FORMAT } from '../../../../../constants/formats';
import { useApplyProductModalData, useRouteNavigate } from '../../../../../hooks';
import { getTimeDateString } from '../../../../../utility/date';
import TenantComponents from '@components';
import OtpVerificationModal from '../../../../../components/otp-verification-modal/otp-verification-modal';
import { useSendLicenseOtpMutation, useVerifyLicenseOtpMutation } from '../../../../../apis/postlisting';

const PlatformActions = (props) => {
  const { t } = useTranslation();
  const isFalOtpVerificationEnabled = tenantConstants?.ENABLE_FAL_LICENSE_OTP_VERIFICATION;
  const { data = [], stories = {}, location, purpose, stats, refetchListings, ...rest } = props;
  const deductionModalRef = useRef();
  const { user } = useSelector((state) => state.app.loginUser);
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const serviceDataRef = useRef();
  const navigate = useRouteNavigate();
  const otpVerifyRef = useRef();
  const [otpListingId, setOtpListingId] = useState(null);
  const [otpPhoneNumber, setOtpPhoneNumber] = useState(null);
  const [otpReferenceNumber, setOtpReferenceNumber] = useState(null);
  const [hasRateLimitError, setHasRateLimitError] = useState(false);
  const [sendLicenseOtp] = useSendLicenseOtpMutation();
  const [verifyLicenseOtp] = useVerifyLicenseOtpMutation();

  const {
    confirmationLoading,
    selectedPaymentOption,
    paymentOptions,
    action,
    onSuccessQuotaCreditModal,
    getDeduction,
    onChangePaymentOption,
    onCancelModal,
    actionLoading,
    onApplyProduct,
  } = useApplyProductModalData(user, deductionModalRef, serviceDataRef, data);

  const handlePublishNowClick = async (item, actionItem) => {
    if (isFalOtpVerificationEnabled && item?.is_otp_required === true) {
      const listingId = item?.id;
      setOtpListingId(listingId);
      setHasRateLimitError(false);
      setOtpPhoneNumber(item?.phone_number || null);

      const sendRes = await sendLicenseOtp({
        listing_id: listingId,
        user_id: user?.id,
        identifier: item?.phone_number,
      });
      if (sendRes?.error) {
        notification.error(sendRes?.error?.data?.error || t('Failed to send OTP'));
      } else {
        setOtpReferenceNumber(sendRes?.data?.reference_number);
        otpVerifyRef?.current?.showModal('mobile');
      }
    } else {
      if (!user?.isCurrencyUser) {
        onApplyProduct(actionItem?.id, item?.id);
      } else {
        navigate(
          `${tenantRoutes.app().post_listing.path}/${item?.id}${item?.location?.id && item?.status?.slug != 'draft' ? '/upgrade' : ''}`,
        );
      }
    }
  };

  return (
    <Group className={rest.className} gap="8px" template="repeat(3, minmax(0, 32px))" style={{ ...rest.style }}>
      <TenantComponents.QuotaCreditModal
        ref={deductionModalRef}
        title={action?.applicableProduct?.requestTitle}
        action={action}
        okText={action?.isSufficient ? 'Submit' : 'Continue'}
        onSuccess={onSuccessQuotaCreditModal}
        onCancel={onCancelModal}
        loading={confirmationLoading}
        serviceDataRef={serviceDataRef}
        selectedPaymentOption={selectedPaymentOption}
        paymentOptions={paymentOptions}
        onChangePaymentOption={onChangePaymentOption}
        showInsufficientCreditsAlert
        showInfoMessage
        hideDataTable
      />
      {data?.map((item, index) => {
        const { stories: listingStories = [] } = item;
        return (
          <React.Fragment key={index}>
            {!!item?.listingPlatformActions && !!item.listingPlatformActions?.length > 0 ? (
              item?.listingPlatformActions.map((e, index) => {
                const actionStyles =
                  !!e?.applied || !!e?.canApply || !!e?.pending
                    ? {
                        opaque: e.opaque,
                        color: e?.slug === 'property_videography' ? '#0793ea14' : e?.color || e?.iconProps?.color,
                        iconColor: e?.slug === 'property_videography' ? '#0793ea' : e.iconColor,
                      }
                    : !e?.canApply
                      ? { enableOnHover: false }
                      : {};

                return (
                  <React.Fragment key={index}>
                    {e?.type === 'icon' ? (
                      <>
                        <RenderUpgradeIcons
                          selectedProduct={e}
                          toolTipTitle={
                            !e?.pending && !e?.applied && !e?.canApply
                              ? e?.isAddOn
                                ? t('This service is not available in your region yet.')
                                : ''
                              : !isMobile && (
                                  <ActionPopOver
                                    title={
                                      e?.applied ? t(e?.appliedTitle) : e?.pending ? t(e?.pendingTitle) : t(e?.title)
                                    }
                                    appliedDescription={t(e?.applied) ? t(e?.appliedDescription) : undefined}
                                    expiryTime={getTimeDateString(e?.time_to_expiry, TIME_DATE_FORMAT)}
                                    requestedAt={
                                      !e?.applied ? getTimeDateString(e?.requested_at, TIME_DATE_FORMAT) : null
                                    }
                                    stories={listingStories}
                                    listing={item}
                                    stats={stats}
                                  />
                                )
                          }
                          deductionType={'credit'}
                          actionStyles={actionStyles}
                          listing={item}
                          loading={actionLoading?.[`${item?.slug}${e?.name}`]}
                          index={index}
                          disabled={(!e?.applied && !e?.canApply) || e?.applied}
                          onIconClick={getDeduction}
                        />
                      </>
                    ) : (
                      <div className="span-all">
                        <Button
                          key={item?.slug + index}
                          onClick={() => handlePublishNowClick(item, e)}
                          style={{
                            '--btn-content-color': tenantTheme['primary-color'],
                            '--btn-border-color': tenantTheme['primary-color'],
                            paddingInline: 12,
                          }}
                          {...actionStyles}
                          loading={actionLoading?.[`${item?.slug}${e?.name}`]}
                          type="primary-light"
                        >
                          {t(e?.title)}
                          {e?.icon && <Icon icon={e?.icon} size="1.4em" style={{ verticalAlign: 'text-bottom' }} />}
                        </Button>
                      </div>
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <div style={{ height: '32px' }} className="span-all" />
            )}
          </React.Fragment>
        );
      })}
      {isFalOtpVerificationEnabled && (
        <OtpVerificationModal
          ref={otpVerifyRef}
          value={otpPhoneNumber || user?.mobile}
          okText={t('Verify')}
          onSuccess={() => {
            setOtpPhoneNumber(null);
            if (otpListingId) {
              navigate(`${tenantRoutes.app().post_listing.path}/${otpListingId}`);
            }
          }}
          onCancelModal={() => {
            setOtpListingId(null);
            setOtpPhoneNumber(null);
            setHasRateLimitError(false);
            refetchListings?.();
          }}
          customVerifyFunction={async (_val, otpCode) => {
            const res = await verifyLicenseOtp({ otp: otpCode, reference_number: otpReferenceNumber });
            if (res?.error) {
              if (res?.error?.status === 429) {
                setHasRateLimitError(true);
              }
              return { error: res?.error?.message};
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
    </Group>
  );
};

export default PlatformActions;
