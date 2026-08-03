import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { notification } from '../components/common';
import { usePostPackageOnListingMutation } from '../apis/listings';
import { usePostSavedListingMutation } from '../apis/postlisting';
import { useLazyGetCreditDeductionQuery, useLazyGetQuotaDeductionApiQuery } from '../apis/quotaCredits';

export const useApplyListingUpgradesZameen = (
  deductionModalRef,
  postStoryRef,
  adminCreditModal,
  videoGraphyModalRef,
) => {
  const { t } = useTranslation();
  const [deduction, setDeduction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [storyModalOpen, setStoryModalOpen] = useState(false);
  const [imagesToPost, setImagesToPost] = useState(null);
  const [consumeAdminCredits, setConsumeAdminCredits] = useState(false);
  const { user } = useSelector((state) => state.app.loginUser);

  const [getCreditDeduction, {}] = useLazyGetCreditDeductionQuery();
  const [postPackageOnListing, {}] = usePostPackageOnListingMutation();
  const [getQuotaDeductionApi] = useLazyGetQuotaDeductionApiQuery();
  const [postSavedListing] = usePostSavedListingMutation();

  const [footerButtonLoading, setFooterButtonLoading] = useState(false);

  const getErrorMessage = (listingOwner, loggedInUser, actionType) => {
    return loggedInUser?.id === listingOwner?.id
      ? `Insufficient ${actionType === 'credit' ? 'Credits' : 'Quota'}`
      : `${listingOwner?.name} has insufficient ${actionType}`;
  };

  const setStoryCreditDeduction = (creditToDeduct, selectedImages, totalCredits) => {
    const storyDeduction = {
      [selectedAction?.listing?.slug]: {
        ...deduction?.[selectedAction?.listing?.slug],
        available: totalCredits,
        required: creditToDeduct,
      },
    };
    setDeduction(storyDeduction);
    setImagesToPost(selectedImages);
    deductionModalRef?.current && deductionModalRef.current.showQuotaCreditModal();
  };

  const applyProductThroughAdminCredits = async () => {
    deductionModalRef?.current && deductionModalRef?.current?.setLoading(true);
    let response = await postPackageOnListing({
      listingId: selectedAction?.listing?.property_id,
      action: selectedAction?.product,
      data: {
        user_id: user?.id,
      },
    });
    if (response) {
      deductionModalRef?.current && deductionModalRef?.current?.setLoading(false);
      setActionLoading(false);
      setConsumeAdminCredits(false);
      deductionModalRef?.current && deductionModalRef.current.hideQuotaCreditModal();
      if (!!response?.error) {
        notification.error(response?.error);
      } else if (response?.message) {
        notification.success(response?.message);
      }
    }
  };

  const adminCreditsConsumption = async (listing, deductionType) => {
    // const isAdmin = !!agencyUsers && agencyUsers?.find((e) => e?.id === user?.id)?.is_agency_admin; //TODO rtkq
    const isAdmin = true;
    if (isAdmin) {
      adminCreditModal?.current && adminCreditModal?.current?.showModal();
    } else {
      setConsumeAdminCredits(false);
      setActionLoading(false);
      notification.error(getErrorMessage(listing?.listingOwner, user, deductionType));
    }
  };

  const getAdminCreditsDeduction = async () => {
    const response = await getCreditDeduction({
      data: {
        listing_id: selectedAction?.listing?.property_id,
        product_id: selectedAction?.product?.id,
        subject_id: user?.id,
      },
      platform: selectedAction?.listing?.slug,
    });

    if (response) {
      setFooterButtonLoading(false);
      adminCreditModal?.current && adminCreditModal?.current?.hideModal();
      if (response?.error) {
        setActionLoading(false);
        notification?.error(response?.error);
      } else {
        const available = response?.data?.[selectedAction?.listing?.slug]?.available;
        const required = response?.data?.[selectedAction?.listing?.slug]?.required;
        if (!available || !required || available < required) {
          notification.error(t(`Insufficient Credits`));
          setActionLoading(false);
        } else {
          setDeduction(response?.data);
          deductionModalRef?.current && deductionModalRef.current.showQuotaCreditModal();
        }
      }
    }
  };

  const getDeduction = async (deductionType, listing, product) => {
    const action = { product: product, listing: listing };
    setSelectedAction(action);
    setActionLoading((prev) => ({ ...prev, [`${listing?.slug}${product?.name}`]: true }));
    if (product?.slug === 'property_videography') {
      videoGraphyModalRef?.current && videoGraphyModalRef?.current?.showVideoGraphyModal(action);
    } else {
      let response = '';

      if (deductionType === 'quota') {
        response = await getQuotaDeductionApi({
          subject_id: listing?.listingOwner?.id ? listing?.listingOwner?.id : user?.id,
          location_id: listing?.location?.id,
        });
      } else {
        response = await getCreditDeduction({
          data: {
            listing_id: listing?.property_id,
            product_id: product?.id,
            subject_id: listing?.listingOwner ? listing?.listingOwner?.id : user?.id,
          },
          platform: listing?.slug,
        });
      }

      if (response) {
        if (response.error) {
          setActionLoading(false);
          notification.error(response.error);
        } else {
          const available = response?.data?.[listing?.slug]?.available;
          const required = response?.data?.[listing?.slug]?.required;
          if (!available || !required || available < required) {
            if (deductionType === 'quota' && listing?.slug === 'zameen' && listing?.status?.slug !== 'limit') {
              onApplyProduct(action);
            } else if (
              deductionType === 'credit' &&
              product?.slug !== 'story_ad' &&
              listing?.listingOwner?.id !== user?.id
            ) {
              setConsumeAdminCredits(true);
              adminCreditsConsumption(listing, deductionType);
            } else {
              notification.error(getErrorMessage(listing?.listingOwner, user, deductionType));
              setActionLoading(false);
            }
          } else if (available >= required) {
            setDeduction(response?.data);
            product?.slug === 'story_ad'
              ? postStoryRef?.current && postStoryRef.current.showPostStoryModal()
              : deductionModalRef?.current && deductionModalRef.current.showQuotaCreditModal();
          }
        }
      }
    }
  };

  const onApplyProduct = async (action) => {
    let response;
    if (action?.product?.actionType === 'credit') {
      response = await postPackageOnListing({
        listingId: action?.listing?.property_id,
        action: action?.product,
        data: {
          ...(action?.product?.slug === 'story_ad' && {
            story: {
              user_id: action?.listing?.listingOwner?.id,
              listing_id: action?.listing?.id,
              no_of_days: Number(deduction?.[action?.listing?.slug]?.required),
              image_ids: imagesToPost,
            },
          }),
          ...(action?.mediaDetails && {
            ...action?.mediaDetails,
          }),
          user_id: action?.listing?.listingOwner ? action?.listing?.listingOwner?.id : user?.id,
        },
      });
    } else {
      response = await postSavedListing({
        listingId: action?.listing?.property_id,
        action: action?.product,
        listingStatus: undefined,
        userId: action?.listing?.listingOwner ? action?.listing?.listingOwner?.id : user?.id,
      });
    }

    if (response) {
      deductionModalRef?.current && deductionModalRef?.current?.setLoading(false);
      setActionLoading(false);
      deductionModalRef?.current && deductionModalRef.current.hideQuotaCreditModal();
      if (!!response?.error) {
        notification.error(response?.error);
      } else if (response?.data?.message) {
        notification.success(response?.data?.message);
      }
    }
  };

  return {
    deduction,
    actionLoading,
    selectedAction,
    storyModalOpen,
    consumeAdminCredits,
    footerButtonLoading,
    setFooterButtonLoading,
    setSelectedAction,
    setActionLoading,
    setStoryModalOpen,
    setStoryCreditDeduction,
    applyProductThroughAdminCredits,
    adminCreditsConsumption,
    getAdminCreditsDeduction,
    getDeduction,
    onApplyProduct,
  };
};
