import React, { useMemo } from 'react';
import tenantRoutes from '@routes';
import { t } from 'i18next';
import { DrawerModal } from '../common';
import SuccessModalContent from '../success-modal/successModalContent';
import { getBaseURL } from '../../utility/env';
import { Link } from 'react-router-dom';
import { getLocaleForURL } from '../../utility/language';
import { isHttpUrl } from '../../utility/utility';
import { useGetNafathVerificationUrlQuery } from '../../apis/user';
const NafathVerificationModal = (props) => {
  const { visible, setVisible, listingId, actionSource, cartId } = props;

  const modalData = useMemo(
    () => ({
      checkout: {
        title: 'Verification Required Before Purchase',
        description: t(
          'To comply with local regulations, only Saudi nationals are eligible to purchase packages and credits on Bayut.',
        ),
        redirectUrl: `${getBaseURL()}${getLocaleForURL()}/checkout?cart_id=${cartId}`,
      },
      upgrade: {
        title: 'Nafath Verification Needed',
        description: (
          <>
            {t(
              'Almost there! Complete your Nafath verification to make your listing live. Until verified, your listing will remain in',
            )}{' '}
            <Link to={`${tenantRoutes.app().listings.path}?q[status_id_eq]=11`}>{t('drafts')}</Link>
          </>
        ),
        redirectUrl: `${getBaseURL()}${getLocaleForURL()}${tenantRoutes.app().post_listing.path}/${listingId}/upgrade?nafath_verified=true`,
      },
    }),
    [listingId, cartId],
  );
  const {
    data: urlData,
    isFetching,
    isError,
  } = useGetNafathVerificationUrlQuery(
    { redirect_url: modalData[actionSource]?.redirectUrl },
    { skip: !visible || !modalData[actionSource]?.redirectUrl },
  );

  const buttons = useMemo(
    () =>
      !isError
        ? [
            {
              btnText: t('Verify Nafath'),
              href: isHttpUrl(urlData?.auth_request_url?.redirectUrl)
                ? urlData?.auth_request_url?.redirectUrl
                : undefined,
              type: 'primary',
              disabled: isFetching || isError,
              loading: isFetching,
            },
          ]
        : [],
    [isError, isFetching],
  );
  const handleCancel = () => {
    setVisible(false);
  };
  return (
    <DrawerModal
      type="primary"
      visible={visible}
      okButtonProps={{ type: 'primary' }}
      onCancel={handleCancel}
      footer={null}
    >
      <SuccessModalContent
        title={t(modalData[actionSource]?.title)}
        description={modalData[actionSource]?.description}
        buttons={buttons}
        image={`${getBaseURL()}/profolio-assets/images/nafath-verification.jpg`}
        imageWidth={150}
        maxWidth={350}
        imageStyle={{ marginBottom: 25 }}
        btnStyle={{ width: 250, margin: 'auto' }}
      />
    </DrawerModal>
  );
};

export default NafathVerificationModal;
