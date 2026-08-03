import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import tenantConstants from '@constants';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Icon, notification } from '../components/common';
import { TIME_DATE_FORMAT } from '../constants/formats';
import { submitUpgradePopupClickEvent } from '../services/analyticsService';
import { getTimeDateString } from '../utility/date';
import { resolveCreditsRequired } from '../utility/utility';
import { useCreateCartMutation } from '../apis/cart';
import { useApplyProductMutation, useLazyGetApplicableProductsQuery } from '../apis/listings';
import { upgradeClickEvent } from '../services/analyticsService';

export const useApplyProductModalDataEg = (user, deductionModalRef, serviceDataRef) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [confirmationLoading, setConfirmationLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedPaymentOption, setSelectedPaymentOption] = useState('credits');
  const [action, setAction] = useState(null);
  const [listingData, setListingData] = useState(null);
  const { selectedUser: selectedUser } = useSelector((state) => state.app.Dashboard);
  const isMemberArea = useSelector((state) => state.app.AppConfig.isMemberArea);
  const [getApplicableProducts, {}] = useLazyGetApplicableProductsQuery();
  const [applyProduct, _] = useApplyProductMutation();
  const [createCartUpSell] = useCreateCartMutation();

  const getServicePayload = () => {
    const values = serviceDataRef?.current?.getValues();
    return values
      ? [
          {
            product_id: action?.applicableProduct?.product_id,
            comments: values?.comments || null,
            requested_at: getTimeDateString(values?.requested_at, TIME_DATE_FORMAT, false, true),
          },
        ]
      : null;
  };

  const onApplyProduct = async (productId, listingId, productTitle, creditsAmount) => {
    upgradeClickEvent(user, productTitle, listingData, creditsAmount);
    serviceDataRef?.current?.handleSubmit();
    const errors = await serviceDataRef?.current?.getErrors();
    if (!errors) {
      setConfirmationLoading(true);
      const add_ons = getServicePayload();
      const response = await applyProduct({
        listingId,
        body: {
          product_ids: [productId],
          ...(add_ons && { add_ons }),
        },
      });
      if (response) {
        setConfirmationLoading(false);
        deductionModalRef?.current && deductionModalRef.current.hideQuotaCreditModal();
        setActionLoading(false);
        if (response?.error) {
          notification.error(response?.error);
        } else if (response?.data?.listing) {
          notification.success(t('Listing Updated Successfully'));
        }
      }
    }
  };

  const createCart = async (
    productId,
    listingId,
    expiryDays,
    creditsAmount,
    purchaseFullCredits,
    productTitle,
    productCredits,
  ) => {
    upgradeClickEvent(user, productTitle, selectedPaymentOption, listingData);
    serviceDataRef?.current?.handleSubmit();
    const errors = await serviceDataRef?.current?.getErrors();
    const quantity = Math.max(0, Math.round(Number(productCredits ?? creditsAmount) || 0));
    const cart = {
      total_credits: creditsAmount,
      listing_expiry_days: expiryDays,
      source: 'profolio',
      listing_id: listingId,
      cart_details_attributes: [
        {
          item_id: productId,
          item_type: 'Product',
          source: 'profolio',
          quantity,
          required_credits: quantity,
        },
      ],
      purchased_full_credits: purchaseFullCredits,
    };
    const add_ons = getServicePayload();
    if (!errors) {
      setConfirmationLoading(true);
      const response = await createCartUpSell({ ...cart, ...(add_ons && { add_ons }) });
      if (response) {
        setConfirmationLoading(false);
        deductionModalRef?.current && deductionModalRef.current.hideQuotaCreditModal();
        setActionLoading(false);
        if (response.error) {
          notification.error(response.error);
        } else {
          const isBasicListing =
            action?.applicableProduct?.slug === 'basic-listing-dubizzle' ||
            action?.applicableProduct?.slug === 'basic-listing';

          const postListing = isBasicListing ? true : false;
          const upgradeListing = isBasicListing ? false : true;

          navigate(
            `/checkout?cart_id=${response?.data?.cart?.id}&upgrade_listing=${upgradeListing}&post_listing=${postListing}`,
            {
              state: {
                purpose: listingData?.purpose,
                interactedFrom: 'manage-listings',
              },
            },
          );
        }
      }
    }
  };
  const onSuccessQuotaCreditModal = () => {
    const isUsingCredits = selectedPaymentOption === 'credits';

    if (user?.isCurrencyUser) {
      if (action?.isSufficient && isUsingCredits) {
        onApplyProduct(
          action?.applicableProduct?.product_id,
          action?.listing_id,
          action?.applicableProduct?.appliedTitle,
          action?.required_credits,
        );
      } else {
        createCart(
          action?.applicableProduct?.product_id,
          action?.listing_id,
          action?.expiryDays,
          isUsingCredits ? action?.creditsDiff : action?.required_credits,
          !isUsingCredits,
          action?.applicableProduct?.appliedTitle,
          action?.required_credits,
        );
      }
    } else {
      onApplyProduct(
        action?.applicableProduct?.product_id,
        action?.listing_id,
        action?.applicableProduct?.appliedTitle,
      );
    }
  };

  const getDeduction = async (deductionType, listing, product, platformSlug = null) => {
    setListingData(listing);
    setActionLoading((prev) => ({ ...prev, [`${listing?.slug}${product?.name}`]: true }));
    const response = await getApplicableProducts({
      requestParams: { listing_id: listing?.property_id },
      platformProductSlugs: { [platformSlug]: product?.slug },
    });
    if (response) {
      if (response?.error) {
        setActionLoading(false);
        notification.error(response.error);
      } else if (!response?.data?.[platformSlug]?.applicableProduct) {
        setActionLoading(false);
        notification.error(t('Product can not be applied'));
      } else if (!user?.isCurrencyUser) {
        const applicable = response?.data?.[platformSlug]?.applicableProduct;
        const creditsNeeded =
          resolveCreditsRequired(
            applicable?.credits_required,
            listing?.expiryDays,
            applicable?.default_expiry_days,
          ) ?? 0;
        if ((Number(response?.data?.[platformSlug]?.available_credits) || 0) >= creditsNeeded) {
          setAction({ ...response?.data?.[platformSlug], platform: listing?.slug, expiryDays: listing?.expiryDays });
          deductionModalRef?.current && deductionModalRef.current.showQuotaCreditModal();
        } else {
          setActionLoading(false);
          notification.error(t(`You don't have enough credits`));
        }
      } else {
        const applicableProduct = response?.data?.[platformSlug]?.applicableProduct;
        const creditsRequired =
          resolveCreditsRequired(
            applicableProduct?.credits_required,
            listing?.expiryDays,
            applicableProduct?.default_expiry_days,
          ) ?? 0;
        const available = Number(response?.data?.[platformSlug]?.available_credits) || 0;
        const creditsDiff = available - creditsRequired;
        setAction({
          ...response?.data?.[platformSlug],
          platform: listing?.slug,
          expiryDays: listing?.expiryDays,
          isSufficient: creditsDiff >= 0,
          creditsDiff: Math.max(0, Math.abs(creditsDiff)),
          requiredCredits: creditsRequired,
          required_credits:
            !!(creditsDiff >= 0) || selectedPaymentOption === 'currency'
              ? creditsRequired
              : creditsRequired - applicableProduct?.availableCredits,
          availableCredits: applicableProduct?.availableCredits,
        });
        deductionModalRef?.current && deductionModalRef.current.showQuotaCreditModal();
      }
    }
  };

  const paymentOptions = useMemo(
    () => [
      {
        key: 'credits',
        title: t('Credits'),
        description: t('Pay using your available credits to get the upgrade instantly'),
        value: action?.requiredCredits,
        prefix: <Icon icon="IconTotalCredit"></Icon>,
      },
      {
        key: 'currency',
        title: t('Credit or Debit Card'),
        description: (
          <span>
            {t('Pay online in ')} {tenantConstants.CURRENCY_SYMBOL()} {t('using other payment methods at checkout')}
          </span>
        ),
        value: (Number(action?.requiredCredits) || 0) * (Number(action?.credit_unit_price) || 0),
        prefix: tenantConstants.CURRENCY_SYMBOL(),
      },
    ],
    [action],
  );

  const onChangePaymentOption = (e) => {
    setSelectedPaymentOption(e.key);
  };

  const onCancelModal = () => {
    setActionLoading(null);
    serviceDataRef?.current?.resetForm();
    deductionModalRef?.current?.hideQuotaCreditModal();
  };

  return {
    selectedPaymentOption,
    confirmationLoading,
    deductionModalRef,
    paymentOptions,
    action,
    actionLoading,
    onSuccessQuotaCreditModal,
    getDeduction,
    onChangePaymentOption,
    onCancelModal,
    onApplyProduct,
  };
};
