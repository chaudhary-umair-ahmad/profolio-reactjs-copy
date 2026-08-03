import { useSelector } from 'react-redux';
import tenantTheme from '@theme';
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useApplyProductModalDataOman } from '../../../../../hooks/useApplyProductModalDataOman';
import { useApplyProductModalDataEg } from '../../../../../hooks/useApplyProductModalDataEg';
import { TENANT_KEY } from '../../../../../utility/env';
import { Flex, Button } from '../../../../../components/common';
import { QuotaCreditModal } from './quotaCreditModal';
import { listingActionClickEvent } from '../../../../../services/analyticsService';
const PlatformActions = (props) => {
  const { t } = useTranslation();
  const { data = [], stories = {}, location, purpose, stats, ...rest } = props;
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);

  const deductionModalRef = useRef();
  const { user } = useSelector((state) => state.app.loginUser);
  const isMultiPlatform = user?.isMultiPlatform;

  const serviceDataRef = useRef();

  const omanApplyProductData = useApplyProductModalDataOman(user, deductionModalRef, serviceDataRef);
  const egApplyProductData = useApplyProductModalDataEg(user, deductionModalRef, serviceDataRef);
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
  } = TENANT_KEY === 'eg' ? egApplyProductData : omanApplyProductData;

  return (
    <Flex vertical={!isMobile && isMultiPlatform} gap="8px" className="w-100" style={{ ...rest.style }}>
      <QuotaCreditModal
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
      <>
        {(user?.platforms || []).map((platform) => {
          const platformActions = props?.[platform.slug]?.listingPlatformActions;
          return (
            platformActions?.map((e, index) => (
              <div key={`${platform.slug}-${index}`} className="w-100">
                <Button
                  className={'w-100'}
                  onClick={() => {
                    listingActionClickEvent(user, e?.appliedTitle, purpose);
                    getDeduction('credit', props, e, e?.platform);
                  }}
                  style={{
                    paddingInline: 12,

                    minWidth: !isMobile || (!isMultiPlatform && '156px'),
                    '--ant-button-default-hover-bg': tenantTheme['primary-light-4'],
                    '--content-color': tenantTheme['primary-color'],
                    borderColor: tenantTheme['gray-100'],
                    gap: '6px',
                  }}
                  disabled={e?.applied || !e?.canApply}
                  loading={actionLoading?.[`${props?.slug}${e?.name}`]}
                  type={e?.platform === 'dubizzle' ? 'dubizzlePrimary' : undefined}
                  icon={e?.platformIcon}
                  iconSize={'20px'}
                >
                  {t(e?.title)}
                </Button>
              </div>
            )) || null
          );
        })}
      </>
    </Flex>
  );
};

export default PlatformActions;
