import tenantRoutes from '@routes';
import tenantUtils from '@utils';
import { Radio, Typography } from 'antd';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  useDeleteListingFromDubizzleMutation,
  useDeleteListingMutation,
  useLazyListingDeleteReasonsQuery,
} from '../../../../../apis/listings';
import { ConfirmationModal, Group, Spinner, TextInput, notification } from '../../../../../components/common';
import ListingDrawer from '../../../../../components/listing-drawer/listingDrawer';
import { useGetLocation, useRouteNavigate } from '../../../../../hooks';
import ListingRowActions from '../../../../../components/table/table-actions/listing-row-actions';
import { useApplyProductModalDataOman } from '../../../../../hooks/useApplyProductModalDataOman';
import { useApplyProductModalDataEg } from '../../../../../hooks/useApplyProductModalDataEg';
import { TENANT_KEY } from '../../../../../utility/env';
import { openExternalUrl } from '../../../../../utility/utility';
import { QuotaCreditModal } from '../../../../common/components/listing/listing-platform-actions/quotaCreditModal';
import { deleteListingConfirmEvent, listingActionClickEvent } from '../../../../../services/analyticsService';
import { getListingActions } from '../../../data/products';
const { Title } = Typography;

const ListingsRowActions = (props) => {
  const { t } = useTranslation();
  const { item, property_id } = props || {};
  const serviceDataRef = useRef();
  const deductionModalRef = useRef();
  const listingDrawerRef = useRef();
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.app.loginUser.user);
  const deleteListingRef = useRef();
  const [deleteFromDubizzle, setDeleteFromDubizzle] = useState(false);
  const navigate = useRouteNavigate();
  const location = useGetLocation();
  const { isMobile } = useSelector((state) => state.app.AppConfig);
  const [selectedReason, setSelectedReason] = useState(null);
  const [otherReason, setOtherReason] = useState('');
  const [deleteReasonError, setDeleteReasonError] = useState(null);
  const purposeId = item?.purposeId;
  const [deleteListing] = useDeleteListingMutation();
  const [deleteListingFromDubizzle] = useDeleteListingFromDubizzleMutation();
  const handleReasonChange = (e) => {
    setSelectedReason(deleteReasons.find((reason) => reason.id == e.target.value));
    setDeleteReasonError(null);
  };

  const [getDeleteReasons, { data: deleteReasons, isLoading: deleteLoading, error: deleteError }] =
    useLazyListingDeleteReasonsQuery();

  const handleOtherReasonChange = (e) => {
    setOtherReason(e.target.value);
  };

  const refsObject = {
    showDeleteListingModal: () => {
      listingActionClickEvent(user, 'delete', item?.purpose);
      deleteListingRef?.current && deleteListingRef?.current?.showModal();
      getDeleteReasons(purposeId);
    },
    showEditListingPage: () => {
      listingActionClickEvent(user, 'edit', item?.purpose);
      navigate(`${tenantRoutes.app().post_listing.path}/${property_id}`);
    },
    applyRefresh: (productSlug) => {
      getDeduction('credit', item, getListingActions(productSlug, item?.platforms), 'bayut');
    },
    applyBoostToTop: (productSlug) => {
      getDeduction('credit', item, getListingActions(productSlug, item?.platforms), 'dubizzle');
    },
    showListingOnClassified: () => {
      listingActionClickEvent(user, 'preview', item?.purpose);
      openExternalUrl(item?.bayut?.public_url);
    },
    showListingOnDubizzleClassified: () => {
      listingActionClickEvent(user, 'preview', item?.purpose);
      openExternalUrl(item?.dubizzle?.public_url);
    },
    showListingDetail: () => {
      listingDrawerRef?.current && listingDrawerRef?.current?.open(item?.property_id);
    },
    showDeleteListingDubizzleModal: () => {
      setDeleteFromDubizzle(true);
      deleteListingRef?.current && deleteListingRef?.current?.showModal();
      getDeleteReasons(purposeId);
    },
  };

  const actionList = item?.listingRowActions(refsObject, loading);

  const onDelete = async () => {
    if (!selectedReason) {
      setDeleteReasonError(t('Please add reason to delete your listing.'));
      return;
    }
    if (selectedReason?.is_text_required && !otherReason.trim()) {
      setDeleteReasonError(t('Please add reason to delete your listing.'));
      return;
    }
    const payload = {
      reason_id: selectedReason?.id,
      reason_text: selectedReason?.slug === 'other' ? otherReason : selectedReason.name,
    };
    setLoading(true);
    !!deleteListingRef?.current && deleteListingRef.current.setLoading(true);
    const response = !!deleteFromDubizzle
      ? await deleteListingFromDubizzle({
          // user_id: item?.listingOwner ? item?.listingOwner?.id : user?.id,
          listingId: item?.property_id,
          reason_id: payload?.reason_id,
          reason_text: payload?.reason_text,
        })
      : await deleteListing({
          // user_id: item?.listingOwner ? item?.listingOwner?.id : user?.id,
          listingId: item?.property_id,
          reason_id: payload?.reason_id,
          reason_text: payload?.reason_text,
        });
    setDeleteFromDubizzle(false);
    if (response) {
      deleteListingConfirmEvent(user, response, selectedReason?.slug === 'other' ? otherReason : selectedReason?.name);
      setLoading(false);
      !!deleteListingRef?.current && deleteListingRef.current.hideModal();
      !!deleteListingRef?.current && deleteListingRef.current.setLoading(false);
      if (response.error) {
        notification.error(response.error);
      } else {
        notification.success(t('Listing has been deleted!'));
        deleteListingRef?.current && deleteListingRef.current.hideModal();
        setDeleteReasonError(null);
      }
    }
  };

  const omanApplyProductData = useApplyProductModalDataOman(user, deductionModalRef, serviceDataRef);
  const egApplyProductData = useApplyProductModalDataEg(user, deductionModalRef, serviceDataRef);
  const {
    confirmationLoading,
    selectedPaymentOption,
    paymentOptions,
    action,
    onSuccessQuotaCreditModal,
    getDeduction,
    onChangePaymentOption,
    onCancelModal,
    actionLoading,
  } = TENANT_KEY === 'eg' ? egApplyProductData : omanApplyProductData;

  const onCancelDeleteModal = () => {
    setDeleteReasonError(null);
    setSelectedReason(null);
    setOtherReason('');
    setDeleteFromDubizzle(false);
  };

  return (
    <>
      <QuotaCreditModal
        ref={deductionModalRef}
        title={action?.applicableProduct?.requestTitle}
        action={action}
        okText={action?.isSufficient ? 'Submit' : 'Continue'}
        onSuccess={onSuccessQuotaCreditModal}
        onCancel={onCancelModal}
        loading={confirmationLoading}
        serviceDataRef={serviceDataRef}
        selectedPaymentOption={selectedPaymentOption}
        paymentOptions={paymentOptions}
        onChangePaymentOption={onChangePaymentOption}
        showInsufficientCreditsAlert
        showInfoMessage
        hideDataTable
      />
      <ConfirmationModal
        ref={deleteListingRef}
        onSuccess={onDelete}
        title={t('Delete Listing')}
        type="danger"
        okText={t('Delete')}
        onCancel={onCancelDeleteModal}
        loading={deleteLoading || loading}
        bodyStyle={{ padding: isMobile ? 16 : 24 }}
        destroyOnClose
        footerError={deleteReasonError && selectedReason?.slug != 'other' && deleteReasonError}
      >
        <Title className="mb-16" level={5}>
          {t('Why are you deleting your listing?')}
        </Title>

        <Radio.Group
          className="d-flex flex-column mb-8"
          style={{ gap: '16px' }}
          onChange={handleReasonChange}
          value={selectedReason?.id}
        >
          {deleteLoading ? (
            <Spinner />
          ) : deleteReasons?.length ? (
            deleteReasons.map((option) => (
              <Radio key={option?.id} className="color-gray-dark" value={option.id}>
                {tenantUtils.getLocalisedString(option, 'name')}
              </Radio>
            ))
          ) : null}
        </Radio.Group>

        {selectedReason?.slug == 'other' && (
          <TextInput
            value={otherReason}
            handleChange={handleOtherReasonChange}
            errorMsg={deleteReasonError}
            lineCount={3}
            placeholder={t('Please enter your reason')}
          />
        )}
      </ConfirmationModal>
      <ListingDrawer ref={listingDrawerRef} />
      <ListingRowActions
        id={property_id}
        isMobile={isMobile}
        actionsList={actionList}
        wrapAction={true}
        loading={actionLoading}
      />
    </>
  );
};

const RowActions = (props) => {
  const { t } = useTranslation();
  const { property_id, purpose } = props || {};
  return (
    <Group template="auto" gap="8px" key={property_id} style={{ alignSelf: 'start' }}>
      {props?.listingRowActions?.length > 0 ? (
        <ListingsRowActions
          item={props}
          data={[{ ...props, purpose: t(purpose?.title) }]}
          property_id={property_id}
          platform={{ slug: props.slug, icon: props.icon }}
          key={props?.slug}
        />
      ) : (
        <div style={{ minHeight: 32 }} key={props?.slug}></div>
      )}
    </Group>
  );
};

export default RowActions;
