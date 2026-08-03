import tenantConstants from '@constants';
import tenantRoutes from '@routes';
import tenantUtils from '@utils';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLazyGetListingCardDetailQuery } from '../../apis/listings';
import { useGetLocation, useRouteNavigate } from '../../hooks';
import { getBaseURL, getClassifiedBaseURL, TENANT_KEY } from '../../utility/env';
import { CardCompact } from '../common/cards/styled';
import SuccessModal from '../success-modal/success-modal';
import { ListingPurpose } from '../table/table-components/listing-purpose';

const SuccessfulPaymentModal = ({ data, setData, productId }) => {
  const listingId = data?.listing_id;
  const { t } = useTranslation();
  const user = useSelector((state) => state.app.loginUser.user);
  const { locale, isMemberArea } = useSelector((state) => state.app.AppConfig);
  const navigate = useRouteNavigate();
  const [listing, setListing] = useState(null);
  const [getListingCardData] = useLazyGetListingCardDetailQuery();
  const key = !!listingId ? 'listing' : 'shop';
  const location = useGetLocation();
  const params = new URLSearchParams(location.search);
  const isPostListing = params.get('post_listing') === 'true';
  const isUpgradeListing = params.get('upgrade_listing') === 'true';

  const fetchListingCardData = async () => {
    if (listingId) {
      const response = await getListingCardData({ listingId });
      if (response) {
        if (!response.error) {
          setListing(response);
        }
      }
    }
  };

  useEffect(() => {
    fetchListingCardData();
  }, [key]);

  const modalData = useMemo(
    () => ({
      listing: {
        title: t('Listing Submitted!'),
        description: {
          'pending-nafaz-verification': t(
            'Almost there! Complete your Nafath Verification to publish your listing live.',
          ),
          default: t('Congratulations! Your listing has been submitted successfully'),
        },
        buttons: [
          { btnText: t('Go to Listings'), url: tenantRoutes.app().listings.path, type: 'default' },
          ...(!user?.is_nafaz_verified
            ? [
                {
                  btnText: t('Verify Nafath'),
                  href: `${getClassifiedBaseURL()}/${locale}/verification/nafath/?redirectPath=${getBaseURL()}`,
                  type: 'primary',
                },
              ]
            : []),
        ],
      },
      shop: {
        title:
          (TENANT_KEY === 'oman' || TENANT_KEY === 'eg')
            ? isPostListing
              ? t('Listing Published!')
              : isUpgradeListing
                ? t('Listing Upgraded!')
                : t('Credits Purchased')
            : t('Credits Purchased'),
        description: {
          default:
            (TENANT_KEY === 'oman' || TENANT_KEY === 'eg')
              ? isPostListing
                ? t('Congratulations! Your listing has been published successfully')
                : isUpgradeListing
                  ? t('Congratulations! Your listing has been upgraded successfully')
                  : t('Congratulations! You have purchased credits')
              : t('Congratulations! You have purchased credits'),
        },
        buttons: [
          isMemberArea
            ? { btnText: t('Go to Listings'), url: tenantRoutes.app().listings.path }
            : { btnText: t('Go to Dashboard'), url: tenantRoutes.app().dashboard.path },
        ],
      },
    }),
    [user],
  );

  const handleTruPointsSuccessIntimation = () => {
    tenantConstants.TRU_BROKER_ENABLED &&
      user?.is_tru_broker &&
      tenantUtils.showTruPointsCriteriaSuccessNotification(null, productId);
  };

  const onCloseModal = () => {
    setData(null);
    if (modalData?.[key]?.buttons?.[0]?.url) {
      navigate(modalData?.[key]?.buttons?.[0]?.url);
      handleTruPointsSuccessIntimation();
    } else if (modalData?.[key]?.buttons?.[0]?.href) {
      window.location.href = modalData?.[key]?.buttons?.[0]?.href;
    }
  };

  const handleButtonClick = (item) => {
    setData(null);
    if (item?.url) {
      navigate(item?.url);
      handleTruPointsSuccessIntimation();
      window.location.reload();
    }
  };

  return (
    <SuccessModal
      title={modalData?.[key]?.title}
      description={modalData?.[key]?.description?.[listing?.disposition] || modalData?.[key]?.description?.default}
      buttons={modalData?.[key]?.buttons}
      handleButtonClick={handleButtonClick}
      handleCancel={onCloseModal}
      visible={!!data}
      renderContent={() =>
        listing && (
          <CardCompact style={{ borderRadius: 8 }}>
            <ListingPurpose {...listing} thumbnailStyles={{ borderRadius: 4 }} />
          </CardCompact>
        )
      }
    />
  );
};

export default SuccessfulPaymentModal;
