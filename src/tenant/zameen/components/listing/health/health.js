import tenantData from '@data';
import tenantRoutes from '@routes';
import tenantUtils from '@utils';
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ListingHealth from '../../../../../components/listing-health/listing-health';
import { actionButtonQualityWidgetClickEvent } from '../../../../../services/analyticsService';
import { HealthTag } from '../../../../../components/listing-health/styled';
import cx from 'clsx';
import { QuotaCreditModal } from '../listing-platform-actions/quotaCreditModal';
import { useApplyListingUpgradesZameen } from '../../../../../hooks';
import TenantComponents from '@components';

const Health = (props) => {
  const { listingsData } = props;
  const { t } = useTranslation();
  const deductionModalRef = useRef();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.app.loginUser);
  const query = new URLSearchParams(location.search);
  const statusId = query.get('q[firmstate]');
  const isActiveListing = listingsData?.platforms?.data[0]?.status?.slug == 'on';

  const {
    deduction,
    selectedAction,
    consumeAdminCredits,
    setActionLoading,
    applyProductThroughAdminCredits,
    onApplyProduct,
    getDeduction,
  } = useApplyListingUpgradesZameen(deductionModalRef);

  const getTagColor = (color) => {
    switch (color) {
      case 'high':
        return 'success';
      case 'low':
        return 'error';
      case 'medium':
        return 'warning';
      default:
        return 'warning';
    }
  };

  const getScoreIcon = (color, percentage) => (
    <HealthTag
      className={cx('fw-700 py-2 fz-14 text-center')}
      style={{ margin: 0, width: '50px' }}
      color={getTagColor(color)}
    >
      {percentage}%
    </HealthTag>
  );

  const healthData = [
    {
      title: t('FRESHNESS'),
      subTitle: tenantUtils.getLocalisedString(props, 'age_title'),
      message: tenantUtils.getLocalisedString(props, 'age_message'),
      status: props?.age_percentage_score,
      color: props?.age_classification,
      scoreIcon: getScoreIcon(props?.age_classification, props?.age_percentage_score),
      button: t('Refresh'),
      showButton: listingsData?.canApplyRefresh && props?.age > 3 && isActiveListing,
      onClick: () => {
        const action = tenantData.getListingActions('refresh_listing');
        getDeduction(action?.actionType, listingsData.platforms.data[0], action);
      },
    },
    {
      title: t('UNIQUE IMAGES'),
      subTitle: tenantUtils.getLocalisedString(props, 'unique_images_title'),
      message: tenantUtils.getLocalisedString(props, 'unique_images_message'),
      status: props?.unique_images_percentage_score,
      color: props?.unique_images_classification,
      scoreIcon: getScoreIcon(props?.unique_images_classification, props?.unique_images_percentage_score),
      button: t('Add Images'),
      showButton: props?.unique_images_percentage_score === 100 ? false : true,
      onClick: () => {
        actionButtonQualityWidgetClickEvent(user, statusId, 'add-images', props);
        const path = `${tenantRoutes.app().post_listing.path}/${listingsData.id}`;
        navigate(path);
      },
    },
    {
      title: t('FEATURES'),
      subTitle: tenantUtils.getLocalisedString(props, 'features_title'),
      message: tenantUtils.getLocalisedString(props, 'features_message'),
      status: props?.features_percentage_score,
      color: props?.features_classification,
      scoreIcon: getScoreIcon(props?.features_classification, props?.features_percentage_score),
      button: t('Add Amenities'),
      showButton: props?.features_percentage_score === 100 ? false : true,
      onClick: () => {
        actionButtonQualityWidgetClickEvent(user, statusId, 'add-amenities', props);
        const path = `${tenantRoutes.app().post_listing.path}/${listingsData.id}`;
        navigate(path);
      },
    },
  ];

  return (
    <>
      <ListingHealth
        dataToShow={healthData}
        overallClassification={props?.overall_classification}
        overallPercentageScore={props?.overall_percentage_score}
        overallScoreIcon={getScoreIcon(props?.overall_classification, props?.overall_percentage_score)}
        statusId={statusId}
        headerBg={
          props?.overall_classification == 'high'
            ? 'success-color'
            : props?.overall_classification == 'medium'
              ? 'warning-color'
              : 'error-color'
        }
      />
      <TenantComponents.QuotaCreditModal
        ref={deductionModalRef}
        action={selectedAction?.product}
        listing={selectedAction?.listing}
        deduction={deduction}
        onSuccess={(option) => {
          if (consumeAdminCredits) {
            applyProductThroughAdminCredits();
          } else {
            deductionModalRef?.current && deductionModalRef?.current?.setLoading(true);
            onApplyProduct(option);
          }
        }}
        onCancel={() => {
          setActionLoading(false);
          deductionModalRef?.current && deductionModalRef.current.hideQuotaCreditModal();
        }}
      />
    </>
  );
};

export default Health;
