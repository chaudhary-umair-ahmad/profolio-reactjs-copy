import tenantTheme from '@theme';
import tenantFilters from '@filters';
import React, { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Button, Checkbox, Divider, Drawer, EmptyState, Filters, Flex, Group, notification } from '../common';
import { useSelector } from 'react-redux';
import { Typography } from 'antd';
import { t } from 'i18next';
import { SelectListingCardsContainer } from './styled';
import { ListingPurpose } from '../table/table-components/listing-purpose';
import AddInterestDrawerSkeleton from './add-interest-drawer-skeleton';
import {
  useAddLeadInterestsMutation,
  useLazyGetLeadListingsQuery,
  useLazyGetUserActiveListingsQuery,
  useUpdateLeadInterestMutation,
} from '../../apis/lms';
import { submitInterestClickEvent } from '../../services/analyticsService';
const { Text } = Typography;

const AddInterestDrawer = forwardRef((props, ref) => {
  const { forTask = false, singleSelect = false, setField, fieldKey, onSuccess = () => {} } = props;

  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const locale = useSelector((state) => state.app.AppConfig.locale);
  const [btnLoading, setBtnLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedListings, setSelectedListings] = useState([]);
  const [activeListings, setActiveListings] = useState([]);
  const [interestState, setInterestState] = useState(null);
  const { leadId, interestId, updateInterest = false, userId } = interestState || {};
  const user = useSelector((state) => state.app.loginUser?.user);
  const filtersList = useMemo(() => tenantFilters.getAddInterestFilters(), []);
  const [getLeadListings, { isFetching: leadListingsFetching }] = useLazyGetLeadListingsQuery();
  const [getActiveListings, { isFetching: userActiveListingsFetching }] = useLazyGetUserActiveListingsQuery();
  const [addLeadInterests] = useAddLeadInterestsMutation();
  const [updateLeadInterest] = useUpdateLeadInterestMutation();
  const filterRef = useRef();
  const drawerRef = useRef();

  const onCloseDrawer = () => {
    setSelectedListings([]);
    setActiveListings([]);
    setInterestState(null);
  };

  useImperativeHandle(
    ref,
    () => ({
      openDrawer(leadItem) {
        getUserActiveListings(leadItem?.userId, leadItem?.leadId);
        setInterestState({
          leadId: leadItem?.leadId,
          updateInterest: !!leadItem?.interestId,
          interestId: leadItem?.interestId,
          userId: leadItem?.userId,
        });
        drawerRef.current.openDrawer();
      },
    }),
    [],
  );

  const setLeadInterests = async () => {
    submitInterestClickEvent(user, props?.leadId || leadId);
    setBtnLoading(true);
    const response = updateInterest
      ? await updateLeadInterest({
          interestId,
          body: updateInterest
            ? { interest: { listing_id: selectedListings?.[0] } }
            : {
                interests: selectedListings?.map((itemId) => ({
                  lead_id: props?.leadId || leadId,
                  listing_id: itemId,
                })),
              },
        })
      : await addLeadInterests({ selectedListings, leadId: props?.leadId || leadId });

    if (response) {
      setBtnLoading(false);
      if (response?.error) {
        notification.error(response.error);
      } else {
        onSuccess();
        drawerRef?.current?.closeDrawer();
        notification.success(t('Interest added successfully'));
      }
    }
  };
  const getUserActiveListings = async (userId, leadId, params) => {
    const response = forTask
      ? await getLeadListings({ leadId, filtersList, params: { ...params, is_project_enabled: true } })
      : await getActiveListings({ filtersList, params: { ...params, ...(userId && { 'q[user_id_eq]': userId }) } });

    if (response) {
      if (response.error) {
        setError(response.error);
        notification.error(response.error);
      } else {
        setActiveListings(response?.data);
      }
    }
  };

  const onChangeCheckbox = (item) => {
    if (singleSelect) {
      setField && setField(fieldKey, item);
      drawerRef?.current?.closeDrawer();
    } else {
      if (selectedListings?.includes(item?.id)) {
        setSelectedListings(selectedListings?.filter((id) => id !== item?.id));
      } else {
        setSelectedListings([...selectedListings, item?.id]);
      }
    }
  };

  const renderFilters = () => {
    return (
      <Filters
        list={filtersList}
        applyOnClick
        ref={filterRef}
        intialFilterCount={filtersList?.length}
        fetchFunction={(params) => getUserActiveListings(userId, leadId, params)}
        noUrlPush
        columnSpan={isMobile ? 24 : 16}
      >
        {({ renderFiltersDesktop, isData }) => isData && renderFiltersDesktop()}
      </Filters>
    );
  };

  const renderContent = () => {
    return activeListings?.map((item, i) => (
      <React.Fragment key={i}>
        <Flex
          align="center"
          justify="space-between"
          className="listing-card-check pointer"
          onClick={() => onChangeCheckbox(item)}
          style={
            selectedListings?.includes(item?.id)
              ? {
                  backgroundColor: tenantTheme['primary-light-4'],
                }
              : {
                  ...(updateInterest && !!selectedListings?.length && { opacity: 0.6, pointerEvents: 'none' }),
                }
          }
        >
          <ListingPurpose hideHealthPopover disableDetailDrawer {...item} />
          <Checkbox id={item?.id} value={selectedListings?.includes(item?.id)} style={{ marginInlineStart: 8 }} />
        </Flex>
        <Divider style={{ marginBlock: 0 }} />
      </React.Fragment>
    ));
  };

  const renderDrawerTitle = () => (
    <Flex align="center" gap="10px">
      <Button
        size="small"
        style={{ borderRadius: '50%', border: 0, height: '28px', width: '28px' }}
        type="primaryOutlined"
        icon={'IoMdArrowRoundBack'}
        onClick={() => drawerRef.current.closeDrawer()}
        iconSize="18px"
        iconClassName="flipX"
      />
      <Text className="fw-700" style={{ fontSize: '18px' }}>
        {forTask ? t('Add Interest') : t('Add Interest Manually')}
      </Text>
    </Flex>
  );

  const renderDrawerFooter = () => (
    <Group
      template={`100px ${isMobile ? '1fr' : '175px'}`}
      gap="10px"
      style={{ justifyContent: isMobile ? 'center' : 'end' }}
    >
      <Button onClick={() => drawerRef.current.closeDrawer()} size={!isMobile && 'large'}>
        {t('Cancel')}
      </Button>
      <Button
        onClick={setLeadInterests}
        type="primary"
        size={!isMobile && 'large'}
        loading={btnLoading}
        disabled={!selectedListings?.length || btnLoading}
      >
        {t('Add Interest')}
      </Button>
    </Group>
  );

  return (
    <Drawer
      style={{ '--ant-padding-lg': '12px' }}
      headerStyle={{ paddingInline: '16px' }}
      ref={drawerRef}
      title={renderDrawerTitle()}
      width={isMobile ? '100vw' : '40vw'}
      placement={isMobile ? 'bottom' : locale === 'ar' ? 'left' : 'right'}
      onCloseDrawer={onCloseDrawer}
      hideButton
      height={'100vh'}
      footer={forTask ? null : renderDrawerFooter()}
    >
      <div className="fw-600 mb-4">{t('Select a Listing')}</div>
      <Text type="secondary" className="fs12 mb-16 d-block">
        {t('Select a listing in which lead might be interested')}
      </Text>

      {renderFilters()}

      {userActiveListingsFetching || leadListingsFetching ? (
        <AddInterestDrawerSkeleton />
      ) : error ? (
        <EmptyState
          title={t('Error')}
          message={error}
          onClick={getUserActiveListings}
          buttonLoading={userActiveListingsFetching || leadListingsFetching}
        />
      ) : !activeListings?.length ? (
        <EmptyState type="table" hideRetryButton />
      ) : (
        <SelectListingCardsContainer className="select-card">{renderContent()}</SelectListingCardsContainer>
      )}
    </Drawer>
  );
});

export default AddInterestDrawer;
