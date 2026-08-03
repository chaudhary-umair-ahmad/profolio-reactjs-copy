import tenantData from '@data';
import tenantRoutes from '@routes';
import { Col, Divider, Row, Space, Typography } from 'antd';
import { useFormik } from 'formik';
import { handlePostListingFormSubmit } from '../../../../helpers/post-listing';
import isListingPostedOnBayut from '../../../../helpers/isListingPostedOnBayut';
import normalizePostListingResponse from '../../../../helpers/normalizePostListingResponse';
import * as Yup from 'yup';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useCreateCartMutation } from '../../../../apis/cart';
import { useLazyGetApplicableProductsQuery } from '../../../../apis/listings';
import { usePostNewListingMutation, useUpdateListingMutation } from '../../../../apis/postlisting';
import { useLazyGetUserSettingsDetailQuery } from '../../../../apis/user';
import {
  Button,
  Card,
  Flex,
  Group,
  Heading,
  Skeleton,
  TextWithIcon,
  notification,
} from '../../../../components/common';
import OtpVerificationModal from '../../../../components/otp-verification-modal/otp-verification-modal';
import { PostListingForm } from '../../../../components/post-listing';
import { usePageTitle, useRouteNavigate, useScrollToFieldForm, useScrollToPageSection } from '../../../../hooks';
import { getAppSource } from '../../../../store/parentApi';
import { setAppUser } from '../../../../store/appSlice';
import { PostListingAction } from './styled';
import tenantTheme from '@theme';
import MultiPlatform from '../../../../components/common/multiplatform';
import { useParams } from 'react-router-dom';
import { editListingClickEvent, postListingClickEvent } from '../../../../services/analyticsService';
import { resolveCreditsRequired } from '../../../../utility/utility';
import {
  usePostListingResetOnPropertyTypeChange,
} from '../../hooks/usePostListingFormDerivedState';

const PostListing = (props) => {
  const { Text } = Typography;

  const { t } = useTranslation();
  usePageTitle(t('Post Listing - Profolio'));

  const { formData = {}, loading, isMobile } = props;
  const listingIsPosted = isListingPostedOnBayut(formData?.listing);
  const [getApplicableProducts, {}] = useLazyGetApplicableProductsQuery();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [fetchContentLoading, setFetchContentLoading] = useState(false);
  const [creditsInfo, setCreditsInfo] = useState(null);
  const { user } = useSelector((state) => state.app.loginUser);
  const users = useSelector((state) => state.app.userGroup.list);
  const { locale } = useSelector((state) => state?.app?.AppConfig);
  const formikRef = useRef();
  const otpVerifyRef = useRef();
  const [updateListing] = useUpdateListingMutation();
  const [postNewListing] = usePostNewListingMutation();
  const [getUserSettingsDetail] = useLazyGetUserSettingsDetailQuery();
  const navigate = useRouteNavigate();
  const dispatch = useDispatch();
  const [createCart, _] = useCreateCartMutation();
  const [purpose, setPurpose] = useState();
  const { id: listingId } = useParams();
  // Validation schema from API only (dynamic_fields); no static fallback
  const [validationSchema, setValidationSchema] = useState(() => Yup.object().shape({}));
  // API dynamic field definitions for payload (depends on current API schema)
  const [dynamicFieldDefinitions, setDynamicFieldDefinitions] = useState([]);
  useEffect(() => {
    if (!listingId) {
      formik.resetForm({
        values: tenantData.getPostListingInitialValues(null, user),
      });
    }
  }, [listingId]);

  const fetchUserData = async () => {
    try {
      const response = await getUserSettingsDetail({ id: user?.id });
      if (response) {
        if (response?.error) {
          notification.error(response?.error);
        } else {
          dispatch(
            setAppUser({
              mobile: response?.data?.mobile,
              is_mobile_verified: response?.data?.is_mobile_verified,
            }),
          );
        }
      }
    } catch (_) {
    }
  };

  const onSubmit = async () => {
    setPurpose(formik?.values?.purpose);
    if (formik?.values?.property_images?.some((e) => !!e?.uploading && !e?.inError)) {
      notification.error(t('Image uploading is still in progress'));
    } else {
      if ((!listingIsPosted || !listingId) && !user?.is_mobile_verified) {
        setSubmitLoading(true);
        otpVerifyRef.current.onVerify(formik?.values['mobile']);
      } else {
        handlePostOrUpdateListing();
      }
    }
  };

  const formik = useFormik({
    initialValues: tenantData.getPostListingInitialValues(formData?.listing, user),
    validationSchema,
    validateOnChange: false,
    onSubmit: onSubmit,
    innerRef: formikRef,
  });

  const resetValuesOnPropertyTypeChange = usePostListingResetOnPropertyTypeChange(formik, locale);

  useEffect(() => {
    getApplicableProductsData();
  }, []);
  // Only reset to empty when creating new listing; on edit, prefill is applied via setValues in the other useEffect
  useEffect(() => {
    if (!formData?.listing && !listingId) {
      formik.resetForm();
    }
  }, []);

  const getApplicableProductsData = async () => {
    const response = await getApplicableProducts({
      platformProductSlugs: { bayut: 'basic-listing', dubizzle: 'basic-listing-dubizzle' },
    });
    if (response) {
      if (response.error) {
        notification.error(response.error);
      } else {
        let data = user?.platforms?.reduce((acc, e) => {
          const slug = e?.slug;
          if (slug) {
            acc[slug] = response?.data?.[slug]?.applicableProduct;
          }
          return acc;
        }, {});
        let isSufficient = user?.platforms?.every(
          (e) => response?.data?.[e?.slug]?.applicableProduct?.isSufficient === true,
        );
        const totalCreditsRequired = user?.platforms?.reduce((total, e) => {
          const creditsRequired = resolveCreditsRequired(response?.data?.[e?.slug]?.applicableProduct?.credits_required, 30) || 0;
          return total + creditsRequired;
        }, 0);

        setCreditsInfo({ ...data, isSufficient, totalCreditsRequired });
      }
    }
  };
  const onUpdateListing = async () => {
    const res =
      listingIsPosted && listingId
        ? await updateListing({
            listingId: formik?.values?.id,
            values: formik?.values,
            listing: formData?.listing,
            source: getAppSource(),
            creditsInfo: creditsInfo,
            dynamicFieldDefinitions,
          })
        : await postNewListing({
            userId: user?.id,
            listingId: formik?.values?.id,
            values: formik?.values,
            listing: formData?.listing,
            source: getAppSource(),
            creditsInfo: creditsInfo,
            dynamicFieldDefinitions,
          });


    const listing = normalizePostListingResponse(res?.data?.listing);
    const responseForAnalytics = res?.data
      ? { ...res.data, listing: listing || res.data.listing }
      : res?.data;

    listingIsPosted && listingId
      ? editListingClickEvent(user, formik?.values, res?.data?.listing?.discount_applied)
      : responseForAnalytics?.listing?.platforms &&
        postListingClickEvent(user, responseForAnalytics, formik?.values, !listingId);
    if (res) {
      setSubmitLoading(false);
      if (res?.error) {
        notification.error(res?.error);
      } else {
        if (!(listingIsPosted && listingId)) {
          if (!creditsInfo?.isSufficient) {
            createCheckoutCart(listing);
          } else {
            notification?.success(`${t('Listing Posted Successfully')}`);
            navigate(`${tenantRoutes.app().post_listing.path}/${listing?.id}/upgrade`, {
              state: { listing },
            });
          }
        } else {
          notification?.success(`${t('Listing Updated Successfully')}`);
          navigate(`${tenantRoutes.app().listings.path}`);
        }
      }
    }
  };
  const handlePostOrUpdateListing = () => {
    setSubmitLoading(true);
    onUpdateListing();
  };

  const handleOtpVerificationSuccess = async () => {
    await fetchUserData();
    handlePostOrUpdateListing();
  };

  useEffect(() => {
    if (!formik || !formData.listing) return;
    formik.setValues(tenantData.getPostListingInitialValues(formData.listing, user));
  }, [formData?.listing?.id]);

  useScrollToFieldForm(formik);
  useScrollToPageSection();
  const createCheckoutCart = async (listing) => {
    let totalCreditsRequired = 0;
    const cartDetailsAttributes = [];
    const listingExpiryDays = listing?.expiry_days || 30;
    user?.platforms.forEach((platform) => {
      const platformData = creditsInfo?.[platform?.slug];
      if (platformData && !platformData.isSufficient) {
        const creditsRequired = resolveCreditsRequired(platformData.credits_required, listingExpiryDays) || 0;
        totalCreditsRequired += creditsRequired;

        cartDetailsAttributes.push({
          item_id: platformData.product_id,
          item_type: 'Product',
          source: getAppSource(),
          quantity: creditsRequired,
        });
      }
    });
    const cart = {
      total_credits: totalCreditsRequired,
      listing_expiry_days: listingExpiryDays,
      source: getAppSource(),
      listing_id: listing?.id,
      cart_details_attributes: cartDetailsAttributes,
    };
    const response = await createCart(cart);
    if (response?.error) {
      notification.error(response?.error);
    } else {
      navigate(`/checkout?cart_id=${response?.data?.cart?.id}&upgrade_listing=false&post_listing=true`, {
        state: {
          interactedFrom: 'post-listing',
        },
      });
    }
  };

  return !!loading ? (
    <PostListingSkeleton />
  ) : (
    <>
      <Group gap={isMobile ? '0px' : '8px'}>
        {!isMobile && !listingIsPosted && !listingId && (
          <div>
            <Heading as="h2" className="fs20 mb-4 ">
              {t('Post a Listing')}
            </Heading>
            <Typography.Paragraph className="color-gray-dark mb-0">
              {t('Reach thousand of buyers and tenants in a few steps')}
            </Typography.Paragraph>
          </div>
        )}
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
                listingPurposeId={formData?.listing?.listing_purpose?.id}
                clearUserSelections={resetValuesOnPropertyTypeChange}
                packageInfo={true}
                isOffPlan={!!formData?.listing?.is_offplan_listing}
              />
            </Group>
          </form>
          <Divider />
          {isMobile && user?.isMultiPlatform && <div style={{ height: '40px' }}></div>}
          <PostListingAction
            disabled={false}
            style={{ paddingInline: isMobile ? '16px' : '64px', alignItems: 'center' }}
          >
            <Flex
              gap={isMobile ? '8px' : '20px'}
              align="center"
              justify="space-between"
              className="w-100"
              style={{ marginInlineStart: 'auto' }}
              vertical={isMobile}
            >
              {(!listingIsPosted || !listingId) && user?.isMultiPlatform && (
                <>
                  <Flex align="center" gap="5px">
                    <TextWithIcon
                      className="color-gray-dark"
                      icon="HiInformationCircle"
                      value={t('Your listing will be published on both')}
                      iconProps={{ color: tenantTheme['gray700'] }}
                      textSize={isMobile ? '12px' : null}
                      gap={isMobile ? '4px' : '8px'}
                    />

                    <MultiPlatform style={{ marginTop: '2px' }} />
                  </Flex>
                  {isMobile && <Divider variant="dashed" style={{ marginBlock: 0 }} />}
                </>
              )}

              <Flex
                gap="20px"
                justify={isMobile ? 'space-between' : 'normal'}
                className={isMobile ? 'w-100' : null}
                style={{ marginInlineStart: 'auto' }}
              >
                {!listingIsPosted && !listingId && (
                  <Flex align="center" gap="20px">
                    <div>
                      <Text type="secondary" className="d-block fw-600">
                        {t('Required')}
                      </Text>
                      <Text className="fw-700">
                        {creditsInfo?.totalCreditsRequired} <span className="fw-400">{t('Credits')}</span>
                      </Text>
                    </div>
                  </Flex>
                )}

                <Button
                  style={{ maxWidth: '190px', marginInlineStart: 'auto' }}
                  type="primary"
                  size="large"
                  className={isMobile ? 'w-100' : null}
                  onClick={(e) => {
                    setPurpose(formik?.values?.purpose);
                    handlePostListingFormSubmit(formik, e);
                  }}
                  loading={submitLoading}
                  disabled={fetchContentLoading}
                >
                  {listingIsPosted && listingId
                    ? t('Update')
                    : user?.is_mobile_verified
                      ? creditsInfo?.isSufficient
                        ? t('Post Listing')
                        : t('Continue')
                      : t('Verify & Submit')}
                </Button>
              </Flex>
            </Flex>
          </PostListingAction>
        </Card>
      </Group>
      <OtpVerificationModal
        ref={otpVerifyRef}
        value={user?.mobile}
        onSuccess={handleOtpVerificationSuccess}
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

  return (
    <Group gap="16px">
      <Card bodyStyle={{ padding: 30 }}>
        <Row align="center" style={{ gap: 16 }}>
          <Col xs={{ span: 24, offset: 0 }} lg={{ span: 18, offset: 6 }}>
            <Group style={{ maxWidth: 640 }}>{renderFields()}</Group>
          </Col>
        </Row>
      </Card>
    </Group>
  );
};

export default PostListing;
