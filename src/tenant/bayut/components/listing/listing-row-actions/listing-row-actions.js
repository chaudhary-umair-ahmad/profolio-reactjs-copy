import tenantRoutes from '@routes';
import tenantUtils from '@utils';
import { Radio, Typography } from 'antd';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useDeleteListingMutation, useLazyListingDeleteReasonsQuery } from '../../../../../apis/listings';
import { openExternalUrl } from '../../../../../utility/utility';
import {
  ConfirmationModal,
  DateRangePickerOne,
  Group,
  Popover,
  Spinner,
  Tag,
  TextInput,
  notification,
} from '../../../../../components/common';
import ListingDrawer from '../../../../../components/listing-drawer/listingDrawer';
import TableActions from '../../../../../components/table/table-actions/table-actions';
import TruCheckModal from '../../../../../components/trucheckmodal/trucheckModal';
import BookingModal from '../../../../../components/bookedUntilModal/bookedUnitilModal';
import { useGetLocation, useRouteNavigate } from '../../../../../hooks';
import { deleteListingConfirmEvent } from '../../../../../services/analyticsService';
import { setDashboardSelectedUser } from '../../../../../store/appSlice';
const { Title } = Typography;

const columns = [
  {
    title: 'ID',
    dataIndex: 'property_id',
    key: 'id',
    component: 'String',
  },
  {
    title: 'Listed Date',
    dataIndex: 'posted_on',
    key: 'posted_on',
    component: 'String',
  },
  {
    title: 'Purpose',
    dataIndex: 'purpose',
    key: 'purpose',
    component: 'String',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (props) => {
      return (
        <Tag color={props?.color} shape="round">
          {props?.label}
        </Tag>
      );
    },
  },
];

const ListingsRowActions = (props) => {
  const { t } = useTranslation();
  const { item, property_id, purpose, data } = props || {};
  const listingDrawerRef = useRef();
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.app.loginUser.user);
  const deleteListingRef = useRef();
  const trucheckModalRef = useRef();
  const navigate = useRouteNavigate();
  const location = useGetLocation();
  const { isMobile } = useSelector((state) => state.app.AppConfig);
  const [selectedReason, setSelectedReason] = useState(null);
  const [otherReason, setOtherReason] = useState('');
  const [deleteReasonError, setDeleteReasonError] = useState(null);
  const purposeId = item?.purposeId;
  const [deleteListing] = useDeleteListingMutation();
  const dispatch = useDispatch();
  const bookingModalRef = useRef();
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
      deleteListingRef?.current && deleteListingRef?.current?.showModal();
      getDeleteReasons(purposeId);
    },
    showBookingModal: (listing) => {
      bookingModalRef.current.show(listing);
    },
    showEditListingPage: () => navigate(`${tenantRoutes.app().post_listing.path}/${property_id}`),
    showListingOnClassified: () => openExternalUrl(item?.public_url),
    showListingDetail: () => {
      listingDrawerRef?.current && listingDrawerRef?.current?.open(item?.id);
    },
    trucheckModal: () => {
      trucheckModalRef.current.show(item);
    },
  };
  const updatePersonaUserOnListingsCountChange = () => {
    dispatch(setDashboardSelectedUser({ ...user }));
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
    const response = await deleteListing({
      user_id: item?.listingOwner ? item?.listingOwner?.id : user?.id,
      listingId: item?.id,
      reason_id: payload.reason_id,
      reason_text: payload.reason_text,
    });
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
        updatePersonaUserOnListingsCountChange();
      }
    }
  };

  const onCancelDeleteModal = () => {
    setDeleteReasonError(null);
    setSelectedReason(null);
    setOtherReason('');
  };
  return (
    <>
      <ConfirmationModal
        ref={deleteListingRef}
        onSuccess={onDelete}
        title={t('Delete Listing')}
        type="danger"
        okText={t('Delete')}
        onCancel={onCancelDeleteModal}
        loading={deleteLoading || loading}
        bodyStyle={{ padding: isMobile ? 16 : 24 }}
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
              <Radio className="color-gray-dark" value={option.id}>
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
      <TruCheckModal ref={trucheckModalRef} />
      <BookingModal ref={bookingModalRef} />

      <TableActions id={property_id} isMobile={props.isMobile} actionsList={actionList} wrapAction={true} />
    </>
  );
};

const RowActions = (props) => {
  const { t } = useTranslation();
  const { property_id, purpose, data = [] } = props || {};
  return (
    <Group template="auto" gap="8px" key={property_id} style={{ alignSelf: 'start' }}>
      {data &&
        data.length > 0 &&
        data?.map((item) => {
          return item.posted ? (
            <ListingsRowActions
              item={item}
              data={[{ ...item, purpose: t(purpose?.title) }]}
              property_id={property_id}
              platform={{ slug: item.slug, icon: item.icon }}
              key={item?.slug}
              isMobile={props.isMobile}
            />
          ) : (
            <div style={{ minHeight: 32 }} key={item?.slug}></div>
          );
        })}
    </Group>
  );
};

export default RowActions;
