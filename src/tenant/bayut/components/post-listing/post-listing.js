import TenantComponents from '@components';
import tenantData from '@data';
import tenantRoutes from '@routes';
import tenantTheme from '@theme';
import { Col, Divider, Popover, Row, Space, Typography } from 'antd';
import { useFormik } from 'formik';
import { handlePostListingFormSubmit } from '../../../../helpers/post-listing';
import isListingPostedOnBayut from '../../../../helpers/isListingPostedOnBayut';
import normalizePostListingResponse, {
  resolveListingDispositionSlug,
} from '../../../../helpers/normalizePostListingResponse';
import * as Yup from 'yup';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import tenantConstants from '@constants';
import { postListingClickEvent } from '../../../../services/analyticsService';
import {
  Button,
  Card,
  ConfirmationModal,
  Flex,
  Group,
  Heading,
  Icon,
  NationalDayGift,
  Skeleton,
  Switch,
  notification,
} from '../../../../components/common';
import OtpVerificationModal from '../../../../components/otp-verification-modal/otp-verification-modal';
import { PERMISSIONS_TYPE } from '../../../../constants/permissions';
import { usePageTitle, useRouteNavigate, useScrollToFieldForm } from '../../../../hooks';
import RegaCard from './RegaCard';
import { PostListingForm } from '../../../../components/post-listing';
import { getAppSource } from '../../../../store/parentApi';
import { setUsersList } from '../../../../store/appSlice';
import { useUpdateListingMutation } from '../../../../apis/postlisting';
import { useLazyGetApplicableProductsQuery } from '../../../../apis/listings';
import ProjectHeaderCard from './projectHeaderCard';
import { PostListingAction } from '../../../common/components/post-listing/styled';
import NafathVerificationModal from '../../../../components/nafath-verification-modal/nafath-verification-modal';
import LimitNonSaudiNationalModal from '../../../../components/limitNonSaudiNationalModal/LimitNonSaudiNationalModal';
import { isKeycloakDisabledForPath } from '../../../../utility/helpers';
import { resolveCreditsRequired } from '../../../../utility/utility';
import { useNationalDay } from '@/hooks';
import {
  consumeOpenDiscountListingsSession,
  scrollToPostListingDiscountedPriceField,
} from '../../utils/openDiscountListingsSession';
import { useParams } from 'react-router-dom';
import { TENANT_KEY } from '../../../../utility/env';
import {
  usePostListingResetOnPropertyTypeChange,
} from '../../../common/hooks/usePostListingFormDerivedState';
import { surgeListingPurposeId } from '../../data/listingDynamicFieldsPrefill';

/** Same resolution as listing payload (see bayut/payloads/listings.js) so applicable_products gets a stable location_id. */
function resolveLocationIdForApplicableProducts(locationInfo) {
  if (!locationInfo) return undefined;
  return (
    locationInfo.location?.location_id ??
    locationInfo.location?.id ??
    locationInfo.city?.location_id ??
    locationInfo.city?.id
  );
}

const PostListing = (props) => {
  const { Text } = Typography;
  const { isNationalDayActive } = useNationalDay();
  const { t } = useTranslation();
  usePageTitle(t('Post Listing - Profolio'));

  const { formData = {}, loading, isMobile, handleMagicAdPost } = props;
  const listingIsPosted = isListingPostedOnBayut(formData?.listing);
  const [getApplicableProducts, {}] = useLazyGetApplicableProductsQuery();

  const [autoRenew, setAutoRenew] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [fetchContentLoading, setFetchContentLoading] = useState(false);
  const [applicableProduct, setApplicableProduct] = useState(null);
  const [creditsInfo, setCreditsInfo] = useState(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  // const [successModalData, setSuccessModalData] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const { user } = useSelector((state) => state.app.loginUser);
  const { id: listingId } = useParams();

  const users = useSelector((state) => state.app.userGroup.list);
  const { locale } = useSelector((state) => state?.app?.AppConfig);
  const [validationSchema, setValidationSchema] = useState(() => Yup.object().shape({}));
  const [dynamicFieldDefinitions, setDynamicFieldDefinitions] = useState([]);
  const isDailyRentalListing =
    formData?.listing?.listing_purpose?.slug == 'daily-rental' ||
    formData?.listing?.listing_category?.purpose_hash?.slug === 'daily-rental';
  const isOffPlan = formData?.listing?.is_offplan_listing;
  const deductionRef = useRef();
  const formikRef = useRef();
  const autoRenewModalRef = useRef();
  const otpVerifyRef = useRef();
  const [updateListing] = useUpdateListingMutation();
  const [autoGenerateContent, setAutoGenerateContent] = useState({
    title: false,
    description: false,
  });
  const limitModalRef = useRef();
  const sellRentDiscountScrollPendingRef = useRef(false);
  const navigate = useRouteNavigate();
  const dispatch = useDispatch();

  const onSubmit = async () => {
    if (user?.is_nafaz_verified && !user?.is_saudi_national) {
      limitModalRef.current.open();
      return;
    }
    if (formik?.values?.property_images?.some((e) => !!e?.uploading && !e?.inError)) {
      notification.error(t('Image uploading is still in progress'));
    } else {
      if (!listingIsPosted && !user?.is_mobile_verified) {
        setSubmitLoading(true);
        otpVerifyRef.current.onVerify(formik?.values['mobile']);
      } else {
        handlePostOrUpdateListing();
      }
    }
  };
  const formik = useFormik({
    initialValues: isDailyRentalListing
      ? tenantData.getRentalInitialValues(formData?.listing, user)
      : isOffPlan
        ? tenantData.getOffPlanInitialValues(formData?.listing, user)
        : tenantData.getPostListingInitialValues(formData?.listing, user),
    validationSchema: validationSchema,
    validateOnChange: false,
    onSubmit: onSubmit,
    innerRef: formikRef,
  });

  useEffect(() => {
    if (!listingId) {
      const values = isDailyRentalListing
        ? tenantData.getRentalInitialValues(null, user)
        : isOffPlan
          ? tenantData.getOffPlanInitialValues(null, user)
          : tenantData.getPostListingInitialValues(null, user);
      formik.resetForm({ values });
    }
  }, [listingId]);

  const resetValuesOnPropertyTypeChange = usePostListingResetOnPropertyTypeChange(formik, locale, {
    clearArea: true,
    preservePrice: true,
  });

  const applicableProductsLocationId = resolveLocationIdForApplicableProducts(formik?.values['location-info']);
  const shouldFetchApplicableProductsForLocation =
    formData?.listing?.id &&
    !!user?.credits?.ksa;

  useEffect(() => {
    if (shouldFetchApplicableProductsForLocation && applicableProductsLocationId) {
      getApplicableProductsData();
    }
  }, [shouldFetchApplicableProductsForLocation, applicableProductsLocationId]);

  const getApplicableProductsData = async () => {
    const locationId = resolveLocationIdForApplicableProducts(formik?.values['location-info']);
    const response = await getApplicableProducts({
      requestParams: {
        listing_id: formData?.listing?.id,
        ...(locationId != null && locationId !== '' ? { location_id: locationId } : {}),
      },
      platforms: user?.platforms,
      upSell: false,
      listingDetailResponse: null,
    });
    if (response) {
      if (response.error) {
        notification.error(response.error);
      } else {
        const basicListing = response?.data?.products?.find((p) => p.slug === 'basic-listing');
        setCreditsInfo({
          ...creditsInfo,
          productId: basicListing?.product_id,
          requiredCredits: resolveCreditsRequired(basicListing?.credits_required, 30),
          isSufficient: !!(user?.credits?.ksa?.available >= resolveCreditsRequired(basicListing?.credits_required, 30)),
        });
      }
    }
  };

  const fetchRequiredQuota = async () => {
    const response = await getApplicableProducts({
      requestParams: {
        listing_id: formData?.listing?.id,
      },
      productSlug: tenantData.getListingActions('basic-listing')?.slug,
    });

    if (response) {
      if (response?.error) {
        notification.error(response?.error);
      } else {
        setApplicableProduct(response);
        deductionRef?.current && deductionRef?.current?.showQuotaCreditModal();
      }
    }
  };
  const onSaveChanges = async () => {
    setSaveLoading(true);
    const res = await updateListing({
      listingId: formik?.values?.id,
      values: formik?.values,
      listing: formData?.listing,
      autoRenew,
      source: getAppSource(),
      dynamicFieldDefinitions,
    });
    setSaveLoading(false);

    if (res?.error) {
      notification.error(t(res?.error));
    } else {
      notification.success(t('Changes saved successfully'));
      if (TENANT_KEY === 'bayut') {
        window.location.reload();
      }
    }
  };

  const onUpdateListing = async () => {
    setModalLoading(true);
    const res = await updateListing({
      listingId: formik?.values?.id,
      values: formik?.values,
      listing: formData?.listing,
      autoRenew,
      source: getAppSource(),
      productId: creditsInfo?.isSufficient ? creditsInfo?.productId : null,
      dynamicFieldDefinitions,
    });
    if (res) {
      setSubmitLoading(false);
      setModalLoading(false);
      deductionRef?.current && deductionRef?.current?.hideQuotaCreditModal();
      if (res?.error) {
        notification.error(res?.error);
      } else {
        const listing = normalizePostListingResponse(res?.data?.listing);
        const responseForAnalytics = res?.data
          ? { ...res.data, listing: listing || res.data.listing }
          : res?.data;
        if (responseForAnalytics?.listing?.platforms) {
          postListingClickEvent(user, responseForAnalytics, formik?.values, autoRenew, listingIsPosted);
        }

        if (typeof handleMagicAdPost === 'function') {
          handleMagicAdPost(res);
          return;
        }

        if (!listingIsPosted && !!user?.isCurrencyUser) {
          const listingDispositionSlug = resolveListingDispositionSlug(res?.data?.listing, user);
          if (listingDispositionSlug === 'pending-nafaz-verification') {
            setShowVerificationModal(true);
            // setSuccessModalData({ listing_id: formData?.listing?.id });
          } else {
            navigate(`${tenantRoutes.app().post_listing.path}/${formData?.listing?.id}/upgrade`, {
              state: { listing: formData?.listing, listingDispositionSlug },
            });
          }
        } else {
          notification?.success(
            `${t('Listing')} ${listingIsPosted ? t('Updated') : t('Posted')} ${t('Successfully!')}`,
          );
          navigate(`${tenantRoutes.app().listings.path}`);
        }
      }
    }
  };

  const handlePostOrUpdateListing = () => {
    setSubmitLoading(true);
    if (!listingIsPosted) {
      if (!user?.isCurrencyUser) {
        fetchRequiredQuota();
      } else {
        onUpdateListing();
      }
    } else {
      onUpdateListing();
    }
  };

  const setUserUpdatedValues = () => {
    if (formik && formData.listing) {
      formik.setValues(
        isDailyRentalListing
          ? tenantData.getRentalInitialValues(formData.listing, user)
          : isOffPlan
            ? tenantData.getOffPlanInitialValues(formData.listing, user)
            : tenantData.getPostListingInitialValues(formData.listing, user),
      );
      if (formData.listing.id != null && consumeOpenDiscountListingsSession(formData.listing.id)) {
        sellRentDiscountScrollPendingRef.current = true;
        scrollToPostListingDiscountedPriceField();
      }
    }
  };

  // Stable primitive for magic-ad flows only; avoids effect re-running on every new `user` object reference from Redux.
  const magicAdUserSyncKey = handleMagicAdPost ? user?.id ?? null : null;
  const listingIdForFormSync = formData?.listing?.id;

  useEffect(() => {
    //ToDo as discussed
    user?.permissions?.[PERMISSIONS_TYPE.LISTINGS] && !users?.length && setUsersList();
  }, [user, formik?.values?.posting_as]);

  useEffect(() => {
    setUserUpdatedValues();
  }, [listingIdForFormSync, magicAdUserSyncKey]);

  useEffect(() => {
    if (loading || !sellRentDiscountScrollPendingRef.current) return;
    sellRentDiscountScrollPendingRef.current = false;
    scrollToPostListingDiscountedPriceField();
  }, [loading]);

  useScrollToFieldForm(formik);
  const autoGenerate = {
    autoGenerateContent,
    setAutoGenerateContent,
  };
  const renderAutoRenew = () => {
    return (
      <Card
        className="w-100"
        style={{ backgroundColor: '#F7F7F7', maxWidth: !isMobile && 'max-content' }}
        bodyStyle={{ padding: 8 }}
      >
        <Flex gap="10px" align="center" justify={isMobile && 'space-between'}>
          <Flex align="center" gap="4px">
            <Text type="secondary" className={isMobile && 'fz-12'}>
              {t('Auto-Renew')}
            </Text>
            <Popover content={<>{t('The listing will be automatically renewed after 30 days')}</>} action="hover">
              <>
                <Icon
                  style={{ marginTop: isMobile && '2px' }}
                  icon="AiOutlineInfoCircle"
                  size={12}
                  color={tenantTheme.gray700}
                />
              </>
            </Popover>
          </Flex>

          <Switch
            value={autoRenew}
            size="small"
            onChange={() => {
              autoRenew ? autoRenewModalRef?.current?.showModal() : setAutoRenew(true);
            }}
          />
        </Flex>

        <ConfirmationModal
          title={t('Disable auto renew')}
          ref={autoRenewModalRef}
          onCancel={() => autoRenewModalRef?.current?.hideModal()}
          onSuccess={() => {
            setAutoRenew(!autoRenew);
            autoRenewModalRef?.current?.hideModal();
          }}
        >
          {t('Are you sure you want to disable auto renew for this listing')}
        </ConfirmationModal>
      </Card>
    );
  };

  return !!loading ? (
    <PostListingSkeleton />
  ) : (
    <>
      <TenantComponents.QuotaCreditModal
        ref={deductionRef}
        action={applicableProduct}
        onSuccess={onUpdateListing}
        loading={modalLoading}
        onCancel={() => {
          deductionRef?.current && deductionRef?.current?.hideQuotaCreditModal();
          setSubmitLoading(false);
        }}
      />
      <Group gap={isMobile ? '0px' : '8px'}>
        {!isMobile && !listingIsPosted && (
          <div>
            <Heading as="h2" className="fs20 mb-4 ">
              {isDailyRentalListing ? t('Post a Daily Rental Listing') : t('Post a Listing')}
            </Heading>
            <Typography.Paragraph className="color-gray-dark mb-0">
              {isDailyRentalListing
                ? t('Reach thousands of guests in a few simple step')
                : t('Reach thousand of buyers and tenants in a few steps')}
            </Typography.Paragraph>
          </div>
        )}
        {isOffPlan && <ProjectHeaderCard project={formData?.listing?.project} />}
        {!isDailyRentalListing && <RegaCard listing={formData?.listing} />}
        <Card
          bodyStyle={{
            padding: isMobile ? '0 0 20px' : '40px 0',
          }}
        >
          <form className="form-post-listing">
            <Group gap={isMobile ? '12px' : '32px'}>
              <PostListingForm
                formik={formik}
                isMobile={isMobile}
                loading={loading}
                users={users}
                listing={formData?.listing}
                onValidationSchemaReady={setValidationSchema}
                onDynamicFieldDefinitionsReady={setDynamicFieldDefinitions}
                setLoading={setFetchContentLoading}
                listingPurposeId={surgeListingPurposeId(formData?.listing)}
                isDailyRental={isDailyRentalListing}
                isOffPlan={!!formData?.listing?.is_offplan_listing}
                packageInfo={!(isDailyRentalListing || isOffPlan)}
                tooltipText={
                  isDailyRentalListing || isOffPlan
                    ? t(
                        'The National Address, developed by Saudi Post, is a uniform address format designed to standardize address information across Saudi Arabia.',
                      )
                    : undefined
                }
                clearUserSelections={resetValuesOnPropertyTypeChange}
                {...autoGenerate}
              />
              {creditsInfo?.isSufficient && !tenantConstants?.HIDE_AUTO_RENEWAL && (
                <div style={{ paddingInline: '16px' }}>{isMobile && renderAutoRenew()}</div>
              )}
            </Group>
          </form>

          <Divider />

          <PostListingAction style={{ paddingInline: isMobile ? '16px' : '64px', alignItems: 'center' }}>
            {creditsInfo?.isSufficient && !tenantConstants?.HIDE_AUTO_RENEWAL && <>{!isMobile && renderAutoRenew()}</>}
            <Flex
              gap={isMobile ? '20px' : '60px'}
              align="center"
              justify={isMobile ? 'space-between' : 'end'}
              className={'w-100'}
              style={{ marginInlineStart: 'auto' }}
              disabled={isDailyRentalListing && !creditsInfo}
            >
              {creditsInfo?.isSufficient && !isKeycloakDisabledForPath() && (
                <Flex gap={'8px'}>
                  <NationalDayGift />
                  {(!isNationalDayActive || !isMobile) && (
                    <div>
                      <Text type="secondary" className="d-block">
                        {t('Required')}
                      </Text>
                      <Text className="fw-700">
                        {' '}
                        {creditsInfo?.requiredCredits} <span className="fw-400">{t('Credits')}</span>
                      </Text>
                    </div>
                  )}
                </Flex>
              )}

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 20,
                }}
              >
                {!listingIsPosted && !isKeycloakDisabledForPath() && (
                  <Button
                    type="default"
                    size={isMobile ? 'medium' : 'large'}
                    onClick={onSaveChanges}
                    loading={saveLoading}
                    style={{ width: isMobile ? 100 : 140 }}
                  >
                    {t('Save Changes')}
                  </Button>
                )}

                <Button
                  style={{ width: isMobile ? 100 : 140 }}
                  type="primary"
                  size={isMobile ? 'medium' : 'large'}
                  onClick={(e) => handlePostListingFormSubmit(formik, e)}
                  loading={submitLoading}
                  disabled={fetchContentLoading}
                >
                  {listingIsPosted
                    ? t('Update')
                    : user?.is_mobile_verified
                      ? creditsInfo?.isSufficient
                        ? t('Post Listing')
                        : t('Continue')
                      : t('Verify & Submit')}
                </Button>
              </div>
            </Flex>
          </PostListingAction>
        </Card>
      </Group>
      <NafathVerificationModal
        listingId={formData?.listing?.id}
        setVisible={setShowVerificationModal}
        visible={showVerificationModal}
        actionSource="upgrade"
      />
      {/* <SuccessfulPaymentModal data={successModalData} setData={setSuccessModalData} /> */}
      <LimitNonSaudiNationalModal ref={limitModalRef} actionSource="upgrade" clickTrigger={true} />
      <OtpVerificationModal
        ref={otpVerifyRef}
        value={user?.mobile}
        onSuccess={handlePostOrUpdateListing}
        onCancelModal={() => setSubmitLoading(false)}
        onFail={() => setSubmitLoading(false)}
      />
    </>
  );
};

const PostListingSkeleton = () => {
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);

  const renderFields = () => {
    return [1, 2, 3, 4, 5].map((e) => {
      return (
        <Col xs={{ span: 24 }} key={e}>
          <Group className="mb-16" template="auto 1fr" gap="16px">
            <Skeleton type="avatar" />
            <Space direction="vertical">
              <Skeleton block style={{ height: 26, maxWidth: '20%' }} />
              <Skeleton type="input" block />
            </Space>
          </Group>
        </Col>
      );
    });
  };

  const renderRega = () => {
    return (
      <>
        {isMobile ? (
          <Group template="initial" gap="0px">
            <Skeleton type="paragraph" paragraph={{ rows: 3 }} />
          </Group>
        ) : (
          <Group template="repeat(3,minmax(100px, 250px))" gap="40px" className="justify-content-between">
            <Skeleton type="paragraph" paragraph={{ rows: 2 }} />
            <Skeleton type="paragraph" paragraph={{ rows: 2 }} />
            <Skeleton type="paragraph" paragraph={{ rows: 2 }} />
          </Group>
        )}
      </>
    );
  };

  return (
    <Group gap="16px">
      <Card bodyStyle={{ padding: 30 }}>{renderRega()}</Card>

      <Card bodyStyle={{ padding: 30 }}>
        {/* <Row align="center" className="mb-40" style={{ gap: 16 }}>
          <Skeleton type="avatar" />
          <Skeleton type="input" style={{ height: 2, marginTop: 12 }} />
          <Skeleton type="avatar" />
        </Row> */}
        <Row align="center" style={{ gap: 16 }}>
          <Col xs={{ span: 24, offset: 0 }} lg={{ span: 18, offset: 6 }}>
            <Group style={{ maxWidth: 640 }}>{renderFields()}</Group>
          </Col>
        </Row>
      </Card>

      {/* {[1].map(item => (
        <CardBlock loading key={item}>
          <Group style={{ maxWidth: 640 }}>{renderFields()}</Group>
        </CardBlock>
      ))} */}
    </Group>
  );
};

export default PostListing;
