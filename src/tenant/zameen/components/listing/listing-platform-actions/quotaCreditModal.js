import { Col, Row } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { Alert, ConfirmationModal, DataTable, notification } from '../../../../../components/common';
import { IconZoneFactor } from '../../../../../components/svg';
import { JeffiDetail } from './JeffiDetail';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

export const QuotaCreditModal = forwardRef((props, ref) => {
  const { action, deduction, listing, onSuccess, onCancel } = props;
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);

  const { t } = useTranslation();

  const quotaColumns = (shifted, t) => {
    return [
      { title: shifted ? t('Quota Available') : t('Credits Available'), dataIndex: 'available', key: 'available' },
      { title: shifted ? t('Quota Required') : t('Credits Required'), dataIndex: 'used', key: 'used' },
    ];
  };

  const creditColumns = (t) => [
    { title: t('Product'), dataIndex: 'product', key: 'product' },
    { title: t('Credits Available'), dataIndex: 'available', key: 'available' },
    { title: t('Credits Required'), dataIndex: 'used', key: 'used' },
  ];

  const renderDataTable = (label, tableClassName, data, columns) => {
    return (
      <>
        <div className="mb-8">{label}</div>
        <DataTable className={tableClassName} columns={columns} data={data} />
      </>
    );
  };
  const modalRef = useRef();
  const jeffiRef = useRef();

  useImperativeHandle(ref, () => ({
    showQuotaCreditModal() {
      modalRef && modalRef?.current && modalRef?.current?.showModal();
    },
    hideQuotaCreditModal() {
      modalRef && modalRef?.current && modalRef?.current?.hideModal();
    },
    setLoading(value) {
      modalRef && modalRef?.current && modalRef?.current?.setLoading(value);
    },
  }));

  return (
    <>
      <ConfirmationModal
        key={action?.actionName}
        width={'708px'}
        ref={modalRef}
        onSuccess={() => {
          const details = jeffiRef?.current && jeffiRef?.current?.getSelectionAndDate();
          if (details?.request_date == 'Invalid date' || details?.request_date == 'Invalid Date') {
            notification.error(t('Please select date and time for the service'));
          } else {
            onSuccess({
              listing: listing,
              product: action,
              ...(details && { mediaDetails: details }),
            });
          }
        }}
        onCancel={onCancel}
      >
        <>
          {listing?.status?.slug == 'downgraded' && (
            <Alert
              type="info"
              showIcon
              className="mb-8"
              message={t('Reposting will reset the posted date, and the listing cannot be deleted for 30 days.')}
              isMobile={isMobile}
              style={!isMobile && { marginTop: '20px' }}
            />
          )}
          {renderDataTable(
            action?.actionType === 'credit'
              ? t('Following credits will be utilized')
              : t('Following quota will be utilized'),
            'mb-16',
            [
              {
                ...(action?.actionType === 'credit' && { product: action?.name }),
                key: 0,
                available: deduction?.[listing?.slug]?.available,
                used: deduction?.[listing?.slug]?.required,
              },
            ],
            action?.actionType === 'credit' ? creditColumns(t) : quotaColumns(true, t),
          )}
          {deduction?.[listing?.slug]?.isZoneArea && (
            <Row className="mb-20">
              <Col md={1} xs={2}>
                <IconZoneFactor />
              </Col>
              <Col md={23} xs={22} className="fs12">
                <strong>{t('Zone Factor Alert')}</strong>

                <p className="color-gray-dark">
                  {t('You are ') +
                    `${
                      action?.actionType === 'credit' ? t('upgrading the listing on') : t('posting the listing to')
                    }  a premium location, ${deduction?.[listing?.slug]?.zoneFactor} ` +
                    t('extra ') +
                    `${action?.actionType} ${t('will be deducted because of zone factor')}`}
                </p>
              </Col>
            </Row>
          )}

          {action?.slug === 'shot_listing' && <JeffiDetail listing={listing} ref={jeffiRef} isMobile={isMobile} />}
        </>
      </ConfirmationModal>
    </>
  );
});
