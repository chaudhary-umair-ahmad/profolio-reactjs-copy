import tenantRoutes from '@routes';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useRouteNavigate } from '../../hooks';
import SuccessModal from '../success-modal/success-modal';
import { getBaseURL } from '../../utility/env';

const PitchPackageModal = ({ visible, setIsVisible, onContinue, listingId }) => {
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const locale = useSelector((state) => state.app.AppConfig.locale);
  const navigate = useRouteNavigate();
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.app.loginUser);
  const currentPath = window?.location?.pathname || '';

  const modalData = useMemo(
    () => ({
      title: t('Save Up to 44% with a Package!'),
      description: t(
        'Get a package to get credits at a discounted price along with access to Profolio, agency staff, lead reports, and much more',
      ),
      buttons: [
        {
          btnText: t('Continue'),
          type: 'default',
          href: null,
          onClick: onContinue,
        },
        {
          btnText: t('Get a Package'),
          type: 'primary',
          href: null,
          onClick: () =>
            navigate(
              `${tenantRoutes.app('', false, user).prop_shop.path}?redirectUrl=${getBaseURL()}${currentPath || `/${locale}${tenantRoutes.app('', false, user).post_listing.path}/${listingId}/upgrade`}`,
            ),
        },
      ],
    }),
    [t, onContinue, navigate, user, currentPath, locale, listingId],
  );

  return (
    <SuccessModal
      successImage="PackageSuccessIcon"
      handleCancel={() => setIsVisible(false)}
      visible={visible}
      iconStyle={{ marginBottom: isMobile ? '20px' : '30px' }}
      title={modalData?.title}
      description={modalData?.description}
      buttons={modalData?.buttons}
    />
  );
};

export default PitchPackageModal;
