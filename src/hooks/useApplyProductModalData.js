import tenantConstants from '@constants';
import tenantUtils from '@utils';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useCreateCartMutation } from '../apis/cart';
import { useApplyProductMutation, useLazyGetApplicableProductsQuery } from '../apis/listings';
import { Icon, notification } from '../components/common';
import { TIME_DATE_FORMAT } from '../constants/formats';
import { submitUpgradePopupClickEvent } from '../services/analyticsService';
import { getTimeDateString } from '../utility/date';
import { resolveCreditsRequired } from '../utility/utility';

export const useApplyProductModalData = (user, deductionModalRef, serviceDataRef, listing) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [confirmationLoading, setConfirmationLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedPaymentOption, setSelectedPaymentOption] = useState('credits');
  const [action, setAction] = useState(null);
  const [listingData, setListingData] = useState(null);

  const [getApplicableProducts, {}] = useLazyGetApplicableProductsQuery();
  const [applyProduct, _] = useApplyProductMutation();
  const [createCartUpSell] = useCreateCartMutation();

  const leads = {
    views: listing?.[0]?.views,
    leads: listing?.[0]?.leads,
    clicks: listing?.[0]?.clicks,
    calls: listing?.[0]?.calls,
    emails: listing?.[0]?.emails,
    sms: listing?.[0]?.sms,
    whatsapp: listing?.[0]?.whatsapp,
    chat: listing?.[0]?.chat,
  }; //data[0] bayut platforms data for specific bayut

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

  // Add-on details embedded per cart line for the cart (createCart) payload:
  // cart_details_attributes[].add_on_details = { description, requested_at }.
  const getAddOnDetails = () => {
    const values = serviceDataRef?.current?.getValues();
    return values
      ? {
          description: values?.comments || null,
          requested_at: getTimeDateString(values?.requested_at, TIME_DATE_FORMAT, false, true),
        }
      : null;
  };

  const onApplyProduct = async (productId, listingId, applicableProduct) => {
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
        submitUpgradePopupClickEvent(user, response.error, listing?.[0], applicableProduct);
        setConfirmationLoading(false);
        deductionModalRef?.current && deductionModalRef.current.hideQuotaCreditModal();
        setActionLoading(false);
        if (response?.error) {
          notification.error(response?.error);
        } else if (response?.data?.listing) {
          tenantConstants.TRU_BROKER_ENABLED &&
            user?.is_tru_broker &&
            tenantUtils.showTruPointsCriteriaSuccessNotification(null, productId);
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
    appliedProduct,
    productCredits,
  ) => {
    serviceDataRef?.current?.handleSubmit();
    const errors = await serviceDataRef?.current?.getErrors();
    const quantity = Math.max(0, Math.round(Number(productCredits ?? creditsAmount) || 0));
    const addOnDetails = getAddOnDetails();
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
          ...(addOnDetails && { add_on_details: addOnDetails }),
        },
      ],
      purchased_full_credits: purchaseFullCredits,
    };
    if (!errors) {
      setConfirmationLoading(true);
      const response = await createCartUpSell({
        cart: {
          ...cart,
        },
      });
      if (response) {
        submitUpgradePopupClickEvent(user, response.error, listing?.[0], appliedProduct);
        setConfirmationLoading(false);
        deductionModalRef?.current && deductionModalRef.current.hideQuotaCreditModal();
        setActionLoading(false);
        if (response.error) {
          notification.error(response.error);
        } else {
          navigate(`/checkout?cart_id=${response?.data?.cart?.id}&upgrade_listing=true`, {
            state: {
              disposition: listingData?.disposition?.slug,
              status: listingData?.status?.slug,
              interactedFrom: 'manage-listings',
            },
          });
        }
      }
    }
  };
  const onSuccessQuotaCreditModal = () => {
    const isUsingCredits = selectedPaymentOption === 'credits';

    if (user?.isCurrencyUser) {
      if (action?.isSufficient && isUsingCredits) {
        onApplyProduct(action?.applicableProduct?.product_id, action?.listing_id, action?.applicableProduct);
      } else {
        createCart(
          action?.applicableProduct?.product_id,
          action?.listing_id,
          action?.expiryDays,
          isUsingCredits ? action?.creditsDiff : action?.requiredCredits,
          !isUsingCredits,
          action?.applicableProduct,
          action?.requiredCredits,
        );
      }
    } else {
      onApplyProduct(action?.applicableProduct?.product_id, action?.listing_id, action?.applicableProduct);
    }
  };

  const getDeduction = async (deductionType, listing, product) => {
    setListingData(listing);
    setActionLoading((prev) => ({ ...prev, [`${listing?.slug}${product?.name}`]: true }));
    const response = await getApplicableProducts({
      requestParams: { listing_id: listing?.property_id },
      productSlug: product?.slug,
    });
    if (response) {
      if (response?.error) {
        setActionLoading(false);
        notification.error(response.error);
      } else if (!response?.data?.applicableProduct) {
        setActionLoading(false);
        notification.error(t('Product can not be applied'));
      } else if (!user?.isCurrencyUser) {
        const applicable = response?.data?.applicableProduct;
        const creditsNeeded =
          resolveCreditsRequired(
            applicable?.credits_required,
            listing?.expiryDays,
            applicable?.default_expiry_days,
          ) ?? 0;
        if ((Number(response?.data?.available_credits) || 0) >= creditsNeeded) {
          setAction({ ...response?.data, platform: listing?.slug, expiryDays: listing?.expiryDays });
          deductionModalRef?.current && deductionModalRef.current.showQuotaCreditModal();
        } else {
          setActionLoading(false);
          notification.error(t(`You don't have enough credits`));
        }
      } else {
        const applicable = response?.data?.applicableProduct;
        const creditsRequired =
          resolveCreditsRequired(
            applicable?.credits_required,
            listing?.expiryDays,
            applicable?.default_expiry_days,
          ) ?? 0;
        const available = Number(response?.data?.available_credits) || 0;
        const creditsDiff = available - creditsRequired;
        setAction({
          ...response?.data,
          platform: listing?.slug,
          expiryDays: listing?.expiryDays,
          isSufficient: creditsDiff >= 0,
          creditsDiff: Math.max(0, Math.abs(creditsDiff)),
          requiredCredits: creditsRequired,
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
