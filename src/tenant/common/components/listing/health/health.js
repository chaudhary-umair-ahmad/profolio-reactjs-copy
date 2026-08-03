import tenantData from '@data';
import tenantConstants from '@constants';
import tenantRoutes from '@routes';
import tenantUtils from '@utils';
import cx from 'clsx';
import React, { useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ListingHealth from '../../../../../components/listing-health/listing-health';
import { useApplyProductModalData } from '../../../../../hooks';
import { actionButtonQualityWidgetClickEvent } from '../../../../../services/analyticsService';
import { HealthTag } from '../../../../../components/listing-health/styled';
import TenantComponents from '@components';
import { TENANT_KEY } from '../../../../../utility/env';

const getRefreshProductApplicable = (listingsData) => {
  const productsInformation = listingsData?.platform_listings?.[0]?.products_information;
  if (productsInformation == null) {
    return listingsData?.productsInfo?.refresh?.is_applicable;
  }
  if (Array.isArray(productsInformation)) {
    return productsInformation.find((p) => p?.slug === 'refresh')?.is_applicable;
  }
  return productsInformation?.refresh?.is_applicable;
};

const Health = (props) => {
  const { listingsData } = props;
  const { t } = useTranslation();
  const deductionModalRef = useRef();
  const navigate = useNavigate();
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const { user } = useSelector((state) => state.app.loginUser);
  const query = new URLSearchParams(location.search);
  const statusId = query.get('q[status_id_eq]');

  const {
    confirmationLoading,
    selectedPaymentOption,
    paymentOptions,
    action,
    onSuccessQuotaCreditModal,
    getDeduction,
    onChangePaymentOption,
    onCancelModal,
  } = useApplyProductModalData(user, deductionModalRef);

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

  const getScoreIcon = (color, percentage) => {
    return (
      <HealthTag
        className={cx('fw-700 fz-14 text-center')}
        style={{ width: '50px', paddingBlock: isMobile ? '2px' : '5px' }}
        color={getTagColor(color)}
      >
        {Math.round(percentage || 0)}%
      </HealthTag>
    );
  };

  const isBayut = TENANT_KEY === 'bayut';

  const exteriorRequired = useMemo(() => {
    const count = props?.exterior_images_count || 0;
    const percentage = props?.exterior_images_percentage_score || 0;

    if (percentage === 100) {
      return count;
    }
    if (count > 0 && percentage > 0) {
      return Math.ceil((count * 100) / percentage);
    }

    return null;
  }, [props?.exterior_images_count, props?.exterior_images_percentage_score]);

  const interiorRequired = useMemo(() => {
    const count = props?.interior_images_count || 0;
    const percentage = props?.interior_images_percentage_score || 0;

    if (percentage === 100) {
      return count;
    }
    if (count > 0 && percentage > 0) {
      return Math.ceil((count * 100) / percentage);
    }

    return null;
  }, [props?.interior_images_count, props?.interior_images_percentage_score]);

  const exteriorCount = props?.exterior_images_count || 0;
  const interiorCount = props?.interior_images_count || 0;

  const healthData = [
    {
      isHeading: true,
      title: t('Freshness'),
      ...(tenantConstants.ALLOW_LISTING_REFRESH
        ? {
            button: t('Refresh'),
            showButton: getRefreshProductApplicable(listingsData) && props?.age > 3,
            onClick: () => {
              const action = tenantData.getListingActions('refresh');
              getDeduction(action?.actionType, listingsData.platforms.data[0], action);
            },
          }
        : { showButton: false }),
    },
    {
      title: '',
      subTitle: tenantUtils.getLocalisedString(props, 'age_title'),
      message: tenantUtils.getLocalisedString(props, 'age_message'),
      status: props?.age_percentage_score,
      color: props?.age_classification,
      scoreIcon: getScoreIcon(props?.age_classification, props?.age_percentage_score),
    },
    ...(isBayut
      ? [
          {
            isHeading: true,
            title: t('Images'),
            button: t('Add'),
            showButton:
              (props?.exterior_images_percentage_score || 0) < 100 ||
              (props?.interior_images_percentage_score || 0) < 100 ||
              (props?.duplicate_percentage_score || 0) < 100,
            onClick: () => {
              actionButtonQualityWidgetClickEvent(user, statusId, 'add-images', props);
              const path = `${tenantRoutes.app().post_listing.path}/${listingsData.id}#images`;
              navigate(path);
            },
          },
          {
            title: '',
            subTitle:
              exteriorRequired !== null
                ? t('{{count}}/{{required}} Exterior Images Added', {
                    count: exteriorCount,
                    required: exteriorRequired,
                  })
                : t('{{count}} Exterior Images Added', { count: exteriorCount }),
            message:
              props?.exterior_images_percentage_score === 100
                ? t('Your listing has sufficient exterior images')
                : t('Add more exterior images (front elevation, garage, lawn, etc.)'),
            status: props?.exterior_images_percentage_score || 0,
            color:
              props?.exterior_images_percentage_score === 100
                ? 'high'
                : props?.exterior_images_percentage_score >= 50
                  ? 'medium'
                  : 'low',
            scoreIcon: getScoreIcon(
              props?.exterior_images_percentage_score === 100
                ? 'high'
                : props?.exterior_images_percentage_score >= 50
                  ? 'medium'
                  : 'low',
              props?.exterior_images_percentage_score || 0,
            ),
            showButton: false,
            isImagesSection: true,
            isFirstImagesItem: true,
          },
          {
            title: '',
            subTitle:
              interiorRequired !== null
                ? t('{{count}}/{{required}} Interior Images Added', {
                    count: interiorCount,
                    required: interiorRequired,
                  })
                : t('{{count}} Interior Images Added', { count: interiorCount }),
            message:
              props?.interior_images_percentage_score === 100
                ? t('Your listing has sufficient interior images')
                : t('Add more interior images (bedroom, kitchen, dining room, etc.)'),
            status: props?.interior_images_percentage_score || 0,
            color:
              props?.interior_images_percentage_score === 100
                ? 'high'
                : props?.interior_images_percentage_score >= 50
                  ? 'medium'
                  : 'low',
            scoreIcon: getScoreIcon(
              props?.interior_images_percentage_score === 100
                ? 'high'
                : props?.interior_images_percentage_score >= 50
                  ? 'medium'
                  : 'low',
              props?.interior_images_percentage_score || 0,
            ),
            showButton: false,
            isImagesSection: true,
            isFirstImagesItem: false,
            hideBorderBottom: true,
          },
          {
            title: '',
            subTitle: tenantUtils.getLocalisedString(props, 'duplicate_title'),
            message: tenantUtils.getLocalisedString(props, 'duplicate_message'),
            status: props?.duplicate_percentage_score || 0,
            color: props?.duplicate_percentage_score === 100 ? 'high' : 'low',
            scoreIcon: getScoreIcon(
              props?.duplicate_percentage_score === 100 ? 'high' : 'low',
              props?.duplicate_percentage_score || 0,
            ),
            showButton: false,
            isImagesSection: true,
            isFirstImagesItem: false,
          },
        ]
      : [
          {
            isHeading: true,
            title: t('Unique Images'),
            button: t('Add'),
            showButton: props?.unique_images_percentage_score === 100 ? false : true,
            onClick: () => {
              actionButtonQualityWidgetClickEvent(user, statusId, 'add-images', props);
              const path = `${tenantRoutes.app().post_listing.path}/${listingsData.id}#images`;
              navigate(path);
            },
          },
          {
            title: '',
            subTitle: tenantUtils.getLocalisedString(props, 'unique_images_title'),
            message: tenantUtils.getLocalisedString(props, 'unique_images_message'),
            status: props?.unique_images_percentage_score,
            color: props?.unique_images_classification,
            scoreIcon: getScoreIcon(props?.unique_images_classification, props?.unique_images_percentage_score),
          },
        ]),
    {
      isHeading: true,
      title: t('Features'),
      button: t('Add'),
      showButton: props?.features_percentage_score === 100 ? false : true,
      onClick: () => {
        actionButtonQualityWidgetClickEvent(user, statusId, 'add-amenities', props);
        const path = `${tenantRoutes.app().post_listing.path}/${listingsData.id}#amenities`;
        navigate(path);
      },
    },
    {
      title: '',
      subTitle: tenantUtils.getLocalisedString(props, 'features_title'),
      message: tenantUtils.getLocalisedString(props, 'features_message'),
      status: props?.features_percentage_score,
      color: props?.features_classification,
      scoreIcon: getScoreIcon(props?.features_classification, props?.features_percentage_score),
    },
  ];

  return (
    <>
      {props.hidePopover ? (
        getScoreIcon(props?.overall_classification, props?.overall_percentage_score)
      ) : (
        <ListingHealth
          dataToShow={healthData}
          overallClassification={props?.overall_classification}
          overallScoreIcon={getScoreIcon(props?.overall_classification, props?.overall_percentage_score)}
          overallPercentageScore={props?.overall_percentage_score}
          statusId={statusId}
          headerBg={
            props?.overall_classification == 'high'
              ? 'success-color'
              : props?.overall_classification == 'medium'
                ? 'warning-color'
                : 'error-color'
          }
        />
      )}
      <TenantComponents.QuotaCreditModal
        ref={deductionModalRef}
        title={action?.applicableProduct?.requestTitle}
        action={action}
        okText={action?.isSufficient ? 'Submit' : 'Continue'}
        onSuccess={onSuccessQuotaCreditModal}
        onCancel={onCancelModal}
        loading={confirmationLoading}
        selectedPaymentOption={selectedPaymentOption}
        paymentOptions={paymentOptions}
        onChangePaymentOption={onChangePaymentOption}
        showInsufficientCreditsAlert
        showInfoMessage
        hideDataTable
      />
    </>
  );
};

export default Health;
