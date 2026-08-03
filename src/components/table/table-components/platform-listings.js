import React, { useRef } from 'react';
import { Button, Divider, Flex, Icon, Popover, ProductTag, Tag } from '../../common';
import chroma from 'chroma-js';
import tenantUtils from '@utils';
import TenantComponents from '@components';
import { useTranslation } from 'react-i18next';
import tenantData from '@data';
import tenantTheme from '@theme';
import { DubizzleFlameLogo, BayutLogoEn, BayutSmallLogo, BayutLogoAr } from '../../svg';
import { useSelector } from 'react-redux';
import { getTimeDateString } from '../../../utility/date';
import { TIME_DATE_FORMAT } from '../../../constants/formats';
import { useApplyProductModalDataOman } from '../../../hooks/useApplyProductModalDataOman';
import { useApplyProductModalDataEg } from '../../../hooks/useApplyProductModalDataEg';
import { TENANT_KEY } from '../../../utility/env';
import { getListingActions } from '../../../tenant/common/data/products';
import { isLiteExperienceURL } from '../../../utility/general';
import ListingsStats from '../../../tenant/common/components/listing/listingStats';

const getLogo = (icon) => {
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const rtl = useSelector((state) => state.app.AppConfig.rtl);

  if (icon === 'BayutSmallLogo') {
    return isMobile ? (
      <BayutSmallLogo width="25px" height={'25px'} />
    ) : !rtl ? (
      <BayutLogoEn width="50px" style={{ marginTop: '2px' }} />
    ) : (
      <BayutLogoAr width="50px" />
    );
  }
  return isMobile ? (
    <DubizzleFlameLogo width="25px" height={'25px'} />
  ) : (
    <Icon size="50px" style={{ height: '20px', marginTop: '-2px' }} icon={rtl ? 'DubizzleLogoAr' : 'DubizzleLogo'} />
  );
};

const PlatformListing = (props) => {
  const platformData = props?.[props?.slug] || {};

  const {
    icon,
    productsInfo = {},
    isBadge = false,
    disposition = {},
    postedOn,
    showPostedAt = false,
    stats = {},
    hidePostNowBtn = false,
    showStats = false,
    user,
  } = platformData;

  const isMultiPlatform = user?.isMultiPlatform;
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const { t } = useTranslation();
  const deductionModalRef = useRef();
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

  const renderMobileView = () => {
    return (
      <>
        <Flex align={'center'} justify="space-between" gap={'10px'} vertical={false} wrap={isMultiPlatform}>
          <Flex
            vertical={false}
            justify={'space-between'}
            gap={'4px'}
            align={!isMultiPlatform ? 'center' : null}
            wrap={true}
            className="w-100"
          >
            <Flex vertical={true} align={'start'} gap={'6px'}>
              <Flex align="center" gap="6px">
                <div style={{ lineHeight: 1 }}>{getLogo(icon)}</div>

                {isBadge && (
                  <>
                    <ProductTag
                      {...tenantData.getTagProps(productsInfo)}
                      iconProps={{ ...tenantData.getTagProps(productsInfo)?.iconProps, size: '1.2em' }}
                      tagSpace="3px 6px"
                    />
                  </>
                )}

                <Tag
                  style={{
                    '--tag-color': disposition?.color || '#fff',
                    '--tag-bg': disposition?.color
                      ? chroma.mix(disposition.color, '#fff', 0.9).saturate(0.3)
                      : '#767676',
                    fontWeight: '700',
                    fontSize: '10px',
                    paddingBlock: '2px',
                    paddingInline: '6px',
                  }}
                >
                  {disposition?.label}
                </Tag>
              </Flex>

              {disposition?.description && (
                <div style={{ fontStyle: 'italic', color: tenantTheme['gray800'] }}>
                  {tenantUtils.getLocalisedString(disposition, 'description')}
                </div>
              )}

              {showPostedAt && (
                <Flex gap="4px">
                  <div className="text-muted">{t('Posted on')}</div>
                  <div className="text-default fw-600">{getTimeDateString(postedOn) || '-'}</div>
                  <Popover content={<div>{getTimeDateString(postedOn, TIME_DATE_FORMAT)}</div>} action="hover">
                    <>
                      <Icon
                        icon="AiOutlineInfoCircle"
                        size="1em"
                        color={tenantTheme['primary-color']}
                        style={{ marginTop: '4px' }}
                      />
                    </>
                  </Popover>
                </Flex>
              )}
            </Flex>
            {showStats && <ListingsStats disposition={disposition} stats={stats} {...props} />}

            {!hidePostNowBtn && (
              <Button
                type="primary"
                icon="MdOutlineAddLocationAlt"
                style={{
                  maxWidth: !showStats && '180px',
                  '--btn-bg-color': props?.slug === 'dubizzle' && tenantTheme['dubizzle-primary'],
                }}
                onClick={() => {
                  getDeduction(
                    'credit',
                    props,
                    getListingActions(props?.slug === 'dubizzle' ? 'basic-listing-dubizzle' : 'basic-listing', props),
                    props?.slug,
                  );
                }}
                block
                loading={actionLoading}
              >
                {t('Post Now')}
              </Button>
            )}
          </Flex>
        </Flex>
        <Divider style={{ marginBlock: '16px' }} />
      </>
    );
  };

  const renderDesktopView = () => {
    return (
      <Flex align={isLiteExperienceURL() ? 'center' : 'start'} justify="space-between" gap={'12px'} vertical={true}>
        <Flex
          vertical={isMultiPlatform}
          justify={!isMultiPlatform ? 'space-between' : null}
          gap={'10px'}
          align={!isMultiPlatform ? 'center' : null}
          wrap={true}
          className="w-100"
          style={!user?.is_package_user ? { maxWidth: '250px' } : {}}
        >
          <Flex vertical={true} align={'start'} gap={!isMultiPlatform ? '6px' : '14px'}>
            <Flex align="center" gap="8px">
              <div style={{ lineHeight: 1 }}>{getLogo(icon)}</div>

              {isBadge && (
                <>
                  <ProductTag
                    {...tenantData.getTagProps(productsInfo)}
                    iconProps={{ ...tenantData.getTagProps(productsInfo)?.iconProps, size: '1.2em' }}
                    tagSpace="3px 6px"
                  />
                </>
              )}

              <Tag
                style={{
                  '--tag-color': disposition?.color || '#fff',
                  '--tag-bg': disposition?.color ? chroma.mix(disposition.color, '#fff', 0.9).saturate(0.3) : '#767676',
                  fontWeight: '700',
                  fontSize: '10px',
                  paddingBlock: '2px',
                  paddingInline: '6px',
                }}
              >
                {disposition?.label}
              </Tag>
            </Flex>

            {disposition?.description && (
              <div style={{ fontStyle: 'italic', color: tenantTheme['gray800'] }}>
                {tenantUtils.getLocalisedString(disposition, 'description')}
              </div>
            )}
          </Flex>
          {showStats && <ListingsStats disposition={disposition} stats={stats} {...props} />}

          {showPostedAt && (
            <>
              <Flex gap="4px">
                <div className="text-muted">{t('Posted on')}</div>

                <div className="text-default fw-600">{getTimeDateString(postedOn) || '-'}</div>
                <Popover content={<div>{getTimeDateString(postedOn, TIME_DATE_FORMAT)}</div>} action="hover">
                  <>
                    <Icon
                      icon="AiOutlineInfoCircle"
                      size="1em"
                      color={tenantTheme['primary-color']}
                      style={{ marginTop: '4px' }}
                    />
                  </>
                </Popover>
              </Flex>
            </>
          )}
          {!hidePostNowBtn && (
            <Button
              type="primary"
              icon="MdOutlineAddLocationAlt"
              style={{
                maxWidth: '175px',
                '--btn-bg-color': props?.slug === 'dubizzle' && tenantTheme['dubizzle-primary'],
              }}
              onClick={() => {
                getDeduction(
                  'credit',
                  props,
                  getListingActions(props?.slug === 'dubizzle' ? 'basic-listing-dubizzle' : 'basic-listing', props),
                  props?.slug,
                );
              }}
              block
              loading={actionLoading}
            >
              {t('Post Now')}
            </Button>
          )}
        </Flex>
      </Flex>
    );
  };
  return (
    <>
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
      {isMobile ? renderMobileView() : renderDesktopView()}
    </>
  );
};

export default PlatformListing;
