import TenantComponents from '@components';
import tenantConstants from '@constants';
import { Radio, Typography } from 'antd';
import cx from 'clsx';
import React, { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Alert, Card, ConfirmationModal, DataTable, Flex, Icon } from '../../../../../components/common';
import { CardCompact } from '../../../../../components/common/cards/styled';
import { formatPrice, resolveCreditsRequired } from '../../../../../utility/utility';
import { RadioStyled } from './styled';
const { Text } = Typography;

const RadioGroup = Radio.Group;

export const QuotaCreditModal = forwardRef((props, ref) => {
  const {
    action,
    onSuccess,
    onCancel,
    serviceDataRef,
    showInsufficientCreditsAlert,
    showInfoMessage,
    hideDataTable = false,
    paymentOptions,
    selectedPaymentOption,
    onChangePaymentOption,
    ...rest
  } = props;
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const { user } = useSelector((state) => state.app.loginUser);

  const { t } = useTranslation();
  const modalRef = useRef();

  useImperativeHandle(ref, () => ({
    showQuotaCreditModal() {
      serviceDataRef && serviceDataRef?.current && serviceDataRef?.current?.resetForm();
      modalRef && modalRef?.current && modalRef?.current?.showModal();
    },
    hideQuotaCreditModal() {
      modalRef && modalRef?.current && modalRef?.current?.hideModal();
    },
    setLoading(value) {
      modalRef && modalRef?.current && modalRef?.current?.setLoading(value);
    },
  }));

  const quotaColumns = (t) => {
    return [
      { title: t('Quota Required'), dataIndex: 'used', key: 'used' },
      { title: t('Quota Available'), dataIndex: 'available', key: 'available' },
    ];
  };

  const creditColumns = (t) => [
    { title: t('Credits Required'), dataIndex: 'used', key: 'used' },
    { title: t('Credits Available'), dataIndex: 'available', key: 'available' },
  ];

  const requestService = useMemo(
    () =>
      action?.applicableProduct?.slug == 'photography-service' ||
      action?.applicableProduct?.slug == 'videography-service' ||
      action?.applicableProduct?.slug == 'drone-footage-service'
        ? action?.applicableProduct
        : null,
    [action?.applicableProduct],
  );

  const renderDataTable = (label, tableClassName, data, columns) => {
    return (
      <>
        <div className="mb-8">{label}</div>
        <DataTable className={tableClassName} columns={columns} data={data} />
      </>
    );
  };

  return (
    <ConfirmationModal
      title={requestService && requestService?.title}
      key={action?.id}
      width={'708px'}
      ref={modalRef}
      okText={requestService && t('Request Now')}
      onSuccess={onSuccess}
      onCancel={onCancel}
      {...rest}
    >
      <>
        {showInfoMessage && user?.isCurrencyUser && (
          <>
            <Alert
              type="info"
              showIcon
              className="mb-8"
              // message={t(action?.applicableProduct?.infoMessage, { expiry_days: action?.expiryDays })} // original expiryDays from API.
              message={t(action?.applicableProduct?.infoMessage, {
                expiry_days: 30,
              })}
              isMobile={isMobile}
            />
          </>
        )}
        {requestService && (
          <TenantComponents.ServiceOptions
            className={isMobile ? 'mb-16' : 'mb-24'}
            template={'initial'}
            gap="8px"
            ref={serviceDataRef}
          />
        )}
        {!hideDataTable &&
          renderDataTable(
            action?.applicableProduct?.actionType === 'credit'
              ? t('Following credits will be utilized')
              : t('Following quota will be utilized'),
            'mb-16',
            [
              {
                ...(action?.applicableProduct?.actionType && { product: action?.applicableProduct?.name }),
                available:
                  action?.applicableProduct?.actionType === 'credit'
                    ? Number(action?.available_credits).toFixed(2)
                    : Number(action?.available_quota).toFixed(2),
                used:
                  Number(
                    resolveCreditsRequired(
                      action?.applicableProduct?.credits_required,
                      action?.expiryDays || 30,
                      action?.applicableProduct?.default_expiry_days,
                    ) ?? 0,
                  ) ||
                  (action?.applicableProduct?.quantity_required
                    ? Number(action?.applicableProduct?.quantity_required?.toFixed(2))
                    : 0),
              },
            ],
            action?.applicableProduct?.actionType === 'credit' ? creditColumns(t) : quotaColumns(t),
          )}
      </>
      {paymentOptions && (
        <>
          <Flex justify="space-between" className="mb-8">
            <Text className="fw-700">{t('Payment Method')} </Text> <div></div>
            <Text className="fw-700">
              <span className="text-muted fw-400 fz-12">{t('Available Credits')}</span>{' '}
              {action?.available_credits && formatPrice(action?.available_credits)}
            </Text>
          </Flex>
          <RadioGroup value={selectedPaymentOption} className="w-100">
            {paymentOptions?.map((e) => (
              <Card
                key={e?.key}
                as={selectedPaymentOption == e.key && CardCompact}
                compactCardRadius="8px"
                compactCardPadding="12px"
                onClick={() => onChangePaymentOption(e)}
                style={{ borderWidth: 1 }}
                className="pointer mb-12"
              >
                <Flex justify="space-between" align="center">
                  <RadioStyled value={e.key} className="radioInput">
                    <TenantComponents.Product title={e?.title} description={e?.description} />
                  </RadioStyled>
                  <Flex align="center" gap="4px">
                    <div className={cx('fz-12', 'text-primary', 'text-muted')} style={{ display: 'inline-flex' }}>
                      {e.prefix}
                    </div>
                    <div className="fw-700 fz-16 text-primary">{e.value}</div>
                  </Flex>
                </Flex>
              </Card>
            ))}
          </RadioGroup>
        </>
      )}
      {showInsufficientCreditsAlert &&
        user?.isCurrencyUser &&
        !action?.isSufficient &&
        selectedPaymentOption == 'credits' && (
          <Alert
            style={{ padding: 0 }}
            showIcon
            type=""
            icon={<Icon className="color-gray-dark" icon="HiInformationCircle" size={16} />}
            message={
              <div
                className={cx('color-gray-light', isMobile ? 'fz-12' : 'fz-14')}
                style={{ paddingBlockStart: !isMobile && '3px', lineHeight: isMobile && 1.5 }}
              >
                {t('Insufficient Credits')}
                {'.'} {t('Pay')}{' '}
                <strong className="color-primary">
                  {tenantConstants.CURRENCY_SYMBOL()}{' '}
                  {formatPrice(
                    Math.round(
                      (Number(action?.creditsDiff) || 0) * (Number(action?.credit_unit_price) || 0),
                    ),
                  )}
                </strong>{' '}
                {t(`for the additional {{credits}} credits at checkout`, {
                  credits: Number(action?.creditsDiff) || 0,
                })}
              </div>
            }
          />
        )}
    </ConfirmationModal>
  );
});
