import React, { forwardRef, useImperativeHandle, useRef, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Button, Icon, DrawerModal } from '../common';
import { useTranslation } from 'react-i18next';
import { TrueCheckModal } from './styled';
import { TruCheckIcon } from '../svg';
import tenantUtils from '@utils';
import tenantTheme from '@theme';
import { getBaseURL } from '../../utility/env';

const TruCheckModal = forwardRef((props, ref) => {
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const drawerModalRef = useRef();
  const [modalData, setModalData] = useState(null);
  const [listingID, setListingID] = useState(null);
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();

  const trucheckModalData = useMemo(
    () => ({
      active: {
        slug: 'active',
        image: 'PackageSuccessIcon',
        title: t('TruCheck Active'),
        buttonText: t('Renew TruCheck'),
        icon: 'FaCircleCheck',
        color: tenantTheme['secondary-color'],
        description: (
          <>
            {t("You're all set! Your property is getting more visibility using TruCheck")}
            <br />
            <div style={{ marginTop: '15px' }}>
              {t('To renew TruCheck, please open the Bayut app on your mobile phone')}
            </div>
          </>
        ),
      },
      pending: {
        slug: 'pending',
        image: 'PackageSuccessIcon',
        title: t('TruCheck Pending'),
        description: t('We are reviewing your TruCheck validation request. This may take up to 2 working days.'),
        icon: 'RequestedStateIcon',
        color: '#FFCB00',
      },
      rejected: {
        slug: 'rejected',
        image: 'PackageSuccessIcon',
        title: t('TruCheck Rejected'),
        buttonText: t('Re-Apply for TruCheck'),
        icon: 'MdCancel',
        color: tenantTheme['danger-color'],
        description: (trucheck) => (
          <>
            {t('Reason')}: {tenantUtils.getLocalisedString(trucheck?.current_trucheck?.reason, 'name')}
            <br />
            {t('To re-apply TruCheck, please open the Bayut app on your mobile phone.')}
          </>
        ),
      },
      expired: {
        slug: 'expired',
        image: 'PackageSuccessIcon',
        title: t('TruCheck Expired'),
        buttonText: t('Renew TruCheck'),
        icon: 'MdError',
        color: tenantTheme['danger-color'],

        description: (
          <>
            {t(
              "TruCheck validation has been expired. Kindly, visit the property again and ensure it's availability for the users.",
            )}
            <br />
            <div style={{ marginTop: '15px' }}>
              {t('To re-apply TruCheck, please open the Bayut app on your mobile phone.')}
            </div>
          </>
        ),
      },
      eligible: {
        slug: 'eligible',
        image: 'PackageSuccessIcon',
        title: t('TruCheck Eligible'),
        buttonText: t('Apply for TruCheck'),
        icon: 'EligibleIcon',
        color: tenantTheme['secondary-color'],

        description: (
          <>
            {t(
              'TruCheck is a cutting-edge technology solution that allows real estate agents to easily validate the properties they list on Bayut.',
            )}
            <br />
            <div style={{ marginTop: '15px' }}>
              {t(
                'Please open Bayut app on your mobile phone and validate the authenticity and availability of the property listed.',
              )}
            </div>
          </>
        ),
      },
    }),
    [t],
  );

  const getModalDataByStatus = (statusSlug, trucheck) => {
    const data = trucheckModalData?.[statusSlug] || trucheckModalData?.['eligible'];
    return data
      ? { ...data, description: data.slug === 'rejected' ? data.description(trucheck) : data.description }
      : null;
  };

  useImperativeHandle(ref, () => ({
    show(item) {
      setListingID(item?.id);
      const data = getModalDataByStatus(item?.trucheck?.current_trucheck?.status?.slug, item?.trucheck);
      setModalData(data);
      drawerModalRef.current?.show();
      setVisible(true);
    },
  }));

  const renderTrueCheckModalContent = () => (
    <TrueCheckModal
      maxWidth="initial"
      textCenter={false}
      align="center"
      gap="8px"
      titleIcon={
        <TruCheckIcon
          size={20}
          style={{
            marginInlineEnd: '6px',
            color: modalData?.slug === 'active' && tenantTheme['success-color'],
          }}
        />
      }
      headingClassName={modalData?.slug === 'active' && 'text-secondary'}
      image={`${getBaseURL()}/profolio-assets/images/trucheck-placeholder.png`}
      className="statuses"
      status={modalData?.slug}
      title={modalData?.title}
      description={modalData?.description}
      renderContent={() => (
        <Icon size={34} className={'status-icon'} icon={modalData?.icon} color={modalData?.color || '#000'} />
      )}
    />
  );
  const handleCancel = () => {
    setModalData(null);
    setVisible(false);
  };
  return (
    <DrawerModal
      ref={drawerModalRef}
      footer={
        isMobile
          ? !!modalData?.buttonText && (
              <a href={`https://profolio.bayut.sa/en/listings/${listingID}`}>
                <Button style={{ width: '100%' }} type="primary" size="large">
                  {t(`${modalData?.buttonText}`)}
                </Button>
              </a>
            )
          : null
      }
      placement="bottom"
      onCancel={handleCancel}
      visible={visible}
      {...props}
    >
      {renderTrueCheckModalContent()}
    </DrawerModal>
  );
});

export default TruCheckModal;
