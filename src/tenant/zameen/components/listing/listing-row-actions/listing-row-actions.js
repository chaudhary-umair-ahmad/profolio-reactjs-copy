import tenantRoutes from '@routes';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useDeleteListingMutation } from '../../../../../apis/listings';
import { useHideUnhideListingsMutation } from '../../../../../apis/postlisting';
import { ConfirmationModal, DataTable, Group, Select, Tag, notification } from '../../../../../components/common';
import ListingDrawer from '../../../../../components/listing-drawer/listingDrawer';
import TableActions from '../../../../../components/table/table-actions/table-actions';
import { strings } from '../../../../../constants/strings';
import { useGetLocation, useRouteNavigate, useTableData } from '../../../../../hooks';
import { openExternalUrl } from '../../../../../utility/utility';

const columns = [
  {
    title: 'ID',
    dataIndex: 'property_id',
    key: 'id',
    component: 'String',
  },
  {
    title: 'Listed Date',
    dataIndex: 'posted_date',
    key: 'posted_date',
    component: 'Date',
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
    render: (record) => {
      const status = record?.props;
      return (
        <Tag color={status?.color} shape="round">
          {status?.label}
        </Tag>
      );
    },
  },
];

function ListingsRowActions(props) {
  const { t } = useTranslation();
  const { item, property_id, purpose, data } = props || {};
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.app.loginUser.user);
  const reduxQuotaCredit = useSelector((state) => state.app?.Dashboard?.quotaCreditsData);
  const hideListingRef = useRef();
  const unHideListingRef = useRef();
  const deleteListingRef = useRef();
  const changeOwnerRef = useRef();
  const navigate = useRouteNavigate();
  const location = useGetLocation();
  const path = location.pathname;
  const listingDrawerRef = useRef();
  const [deleteListings] = useDeleteListingMutation();

  const refsObject = {
    showHideListingModal: () => hideListingRef?.current && hideListingRef?.current?.showModal(),
    showUnhideListingModal: () => unHideListingRef?.current && unHideListingRef?.current?.showModal(),
    showDeleteListingModal: () => deleteListingRef?.current && deleteListingRef?.current?.showModal(),
    showChangeListingOwnerModal: () => changeOwnerRef?.current && changeOwnerRef?.current?.showModal(),
    showEditListingPage: () => navigate(`${tenantRoutes.app().post_listing.path}/${property_id}`),
    showListingOnClassified: () => openExternalUrl(item?.public_url),
    showListingDetail: () => {
      listingDrawerRef?.current && listingDrawerRef?.current?.open(item?.id);
    },
  };

  const actionList = item?.listingRowActions(refsObject, loading);

  const onChangeOwner = () => {
    changeOwnerRef?.current && changeOwnerRef.current.hideModal();
  };

  const [hideUnhideListings] = useHideUnhideListingsMutation();

  const onHide = async () => {
    setLoading(true);
    hideListingRef?.current && hideListingRef.current.setLoading(true);
    unHideListingRef?.current && unHideListingRef.current.setLoading(true);

    const response = await hideUnhideListings({
      userId: item?.listingOwner ? item?.listingOwner?.id : user?.id,
      listingId: property_id,
      platform: data[0].slug,
      status: item?.status?.slug,
    });
    if (response) {
      setLoading(false);
      hideListingRef?.current && hideListingRef.current.hideModal();
      unHideListingRef?.current && unHideListingRef.current.hideModal();
      hideListingRef?.current && hideListingRef.current.setLoading(false);
      unHideListingRef?.current && unHideListingRef.current.setLoading(false);
      if (response.error) {
        notification.error(response.error);
      } else {
        //TODO Rtkq
        // if (response?.data && !response?.dontUpdate) {
        //   path === '/dashboard'
        //     ? dispatch(updateListForDashboard(response.data.data))
        //     : dispatch(updateList(response.data.data));
        // }
        notification.success(
          item?.status?.label === 'Hidden'
            ? t('Listing has been unhided successfully')
            : item?.status?.slug === 'inactive'
              ? t('Listing has been re-published successfully!')
              : t('Listing has been hidden successfully!'),
        );
      }
    }
  };
  const onDelete = async () => {
    setLoading(true);
    !!deleteListingRef?.current && deleteListingRef.current.setLoading(true);
    const response = await deleteListings({
      userId: item?.listingOwner ? item?.listingOwner?.id : user?.id,
      listingId: property_id,
      platform: item?.slug,
      action: item?.status,
    });

    if (response) {
      setLoading(false);
      !!deleteListingRef?.current && deleteListingRef.current.hideModal();
      !!deleteListingRef?.current && deleteListingRef.current.setLoading(false);
      if (response.error) {
        notification.error(response.error);
      } else {
        if (!!response?.data && !response?.dontUpdate) {
          if (path === '/dashboard') {
            //TODO Rtkq
            // dispatch(updateListForDashboard(response.data.data));
            // dispatch(
            //   fetchQuotaCreditsData(
            //     reduxQuotaCredit?.selectedUser?.[data[0]?.slug] || user?.permissions?.[PERMISSIONS_TYPE.PROFILE]
            //       ? -1
            //       : user?.id,
            //     data[0].slug,
            //     user,
            //   ),
            // );
          } else {
            // dispatch(updateList(response.data.data));
          }
        }
        notification.success(t('Listing has been deleted!'));
        deleteListingRef?.current && deleteListingRef.current.hideModal();
      }
    }
  };

  const renderDataTable = (label, tableClassName) => {
    const [tableData, tableColumns] = useTableData(data, columns || [], []);
    return (
      <>
        <div className="mb-8">{label}</div>
        <DataTable className={tableClassName} columns={tableColumns} data={tableData} />
      </>
    );
  };
  return (
    <>
      {user?.is_admin && (
        <ConfirmationModal
          ref={changeOwnerRef}
          onSuccess={onChangeOwner}
          title={t('Change Listing Ownership')}
          okText={t('Change Owner')}
        >
          {renderDataTable(strings.msg_change_ownership, 'mb-16')}
          <Select label={strings.listing_owner} />
        </ConfirmationModal>
      )}
      <ConfirmationModal
        ref={hideListingRef}
        onSuccess={onHide}
        title={data?.[0]?.slug === 'zameen' ? t('Hide Listing') : t('Disable Listing')}
        type="danger"
        okText={data?.[0]?.slug === 'zameen' ? t('Hide Listing') : t('Disable')}
      >
        {renderDataTable(
          data?.[0]?.slug === 'zameen'
            ? t("The following listing will be hidden and won't be visible to users")
            : t("The following listing will be disabled and won't be visible to users"),
        )}
      </ConfirmationModal>
      <ConfirmationModal
        ref={unHideListingRef}
        onSuccess={onHide}
        title={data?.[0]?.slug === 'zameen' ? t('Unhide Listing') : t('Enable Listing')}
        type="danger"
        okText={data?.[0]?.slug === 'zameen' ? t('Unhide Listing') : t('Enable')}
      >
        {renderDataTable(
          data?.[0]?.slug === 'zameen'
            ? t('The following listing will be published And will be visible to user')
            : t('The following listing will be enabled and will be visible to user'),
        )}
      </ConfirmationModal>
      <ConfirmationModal
        ref={deleteListingRef}
        onSuccess={onDelete}
        title={t('Delete Listing')}
        type="danger"
        okText={t('Delete')}
      >
        {renderDataTable(t('The following listing will be deleted'))}
      </ConfirmationModal>
      <ListingDrawer ref={listingDrawerRef} />
      <TableActions id={property_id} isMobile={props.isMobile} actionsList={actionList} />
    </>
  );
}

const RowActions = (props) => {
  const { t } = useTranslation();

  const { property_id, purpose, data = [] } = props || {};
  return (
    <Group template="auto" gap="8px" key={property_id} style={{ gridAutoRows: '1fr' }}>
      {data &&
        data.length > 0 &&
        data?.map((item) => {
          return item.posted ? (
            <ListingsRowActions
              item={item}
              data={[{ ...item, purpose: t(purpose?.title), posted_date: { value: item?.posted_on } }]}
              property_id={property_id}
              platform={{ slug: item.slug, icon: item.icon }}
              key={item?.slug}
              isMobile={props.isMobile}
            />
          ) : (
            <div key={item?.slug} />
          );
        })}
    </Group>
  );
};

export default RowActions;
