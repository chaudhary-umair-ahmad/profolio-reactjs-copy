import React, { forwardRef, useImperativeHandle, useState, useMemo } from 'react';
import { Button, Tag, Popover, DrawerModal, DateRangePickerOne, ErrorMessage, notification } from '../common';
import { Space, Row } from 'antd';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { getTimeDateString } from '../../utility/date';
import { NoSidebarPickerWrapper } from './style';
import { useUpdateListingMutation } from '../../apis/postlisting';
import { useSelector } from 'react-redux';
import store from '@store';
import tenantConstants from '@constants';
import { patchAllMyListingsCachesForBooking } from '../../helpers/patchMyListingsBookingCache';

const BookingModal = forwardRef(({}, ref) => {
  const [visible, setVisible] = useState(false);
  const [ranges, setRanges] = useState([]);
  const [initialRanges, setInitialRanges] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [listing, setListing] = useState([]);
  const { t } = useTranslation();
  const [updateListing, { isLoading, error, reset }] = useUpdateListingMutation();
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);

  useImperativeHandle(ref, () => ({
    show(listing) {
      setListing(listing);
      setRanges(listing?.additional_details?.booked_dates || []);
      setInitialRanges(listing?.additional_details?.booked_dates);
      setVisible(true);
      setShowDatePicker(false);
    },
    hide() {
      setVisible(false);
      setRanges([]);
      setInitialRanges([]);
      setShowDatePicker(false);
    },
  }));
  const expiry = dayjs(listing?.expiry_date);
  const minDate = dayjs().startOf('day');
  // Bayut KSA: bookings shouldn't be capped by the listing's expiry date.
  const maxDate = tenantConstants?.BOOKING_IGNORE_EXPIRY
    ? null
    : listing?.is_autorenewal_on
      ? expiry.add(1, 'month')
      : expiry;

  const disabledDates = useMemo(() => {
    return ranges.flatMap((range) => {
      const dates = [];
      let start = dayjs(range.start_date);
      const end = dayjs(range.end_date);

      while (start.isBefore(end, 'day') || start.isSame(end, 'day')) {
        dates.push(start.toDate());
        start = start.add(1, 'day');
      }
      return dates;
    });
  }, [ranges]);

  const handleRangeSelect = (start_date, end_date) => {
    const exists = ranges.some((r) => r.start_date === start_date && r.end_date === end_date);
    !exists && setRanges((prev) => [...prev, { start_date, end_date }]);
    setShowDatePicker(false);
  };

  const handleRemoveRange = (index) => {
    setRanges((prev) => prev.filter((_, i) => i !== index));
  };
  const hasChanges = useMemo(
    () =>
      initialRanges?.length !== ranges?.length ||
      initialRanges.some((ir) => !ranges.some((r) => r.start_date === ir.start_date && r.end_date === ir.end_date)),
    [initialRanges, ranges],
  );
  const onSubmit = async () => {
    const response = await updateListing({
      listingId: listing?.id,
      values: {
        ...listing,
        additional_details: { booked_dates: ranges },
        booked: ranges?.length > 0,
      },
      listing: listing,
      autoRenew: listing?.is_autorenewal_on,
      skipMyListingsInvalidate: true,
    });
    if (!response.error) {
      patchAllMyListingsCachesForBooking(store.dispatch, store.getState, listing?.id, ranges);
      setVisible(false);
      notification.success(t('Bookings updated successfully'));
    }
    setRanges([]);
    setShowDatePicker(false);
  };

  const onClose = () => {
    reset();
    setVisible(false);
    setRanges([]);
    setShowDatePicker(false);
  };
  const datePickerContent = (
    <NoSidebarPickerWrapper style={{ padding: isMobile ? 16 : undefined }}>
      <DateRangePickerOne
        onSelect={handleRangeSelect}
        setIsOpen={(open) => {
          if (!open) setShowDatePicker(false);
        }}
        okText={t('Save Date Range')}
        onCancel={() => setShowDatePicker(false)}
        minDate={minDate.toDate()}
        maxDate={maxDate ? maxDate.toDate() : undefined}
        disabledDates={disabledDates}
        loading={isLoading}
        disabled={isLoading}
        staticRanges={[]}
        inputRanges={[]}
      />
    </NoSidebarPickerWrapper>
  );
  return (
    <DrawerModal
      title={t('Mark as Booked')}
      visible={visible}
      onCancel={onClose}
      width={isMobile ? 600 : 800}
      footerError={error}
      footer={[
        <Row justify="end" style={{ gap: '10px' }}>
          <Button key="cancel" onClick={onClose}>
            {t('Cancel')}
          </Button>
          <Button key="save" type="primary" onClick={onSubmit} disabled={isLoading || !hasChanges} loading={isLoading}>
            {t('Save Dates')}
          </Button>
        </Row>,
      ]}
      destroyOnClose
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        {ranges?.length > 0 && (
          <div>
            {ranges.map((date, index) => {
              return (
                <Tag
                  shape="round"
                  closable
                  key={index}
                  style={{ overflow: 'hidden', display: 'inline-flex', '--space-top': '1px', margin: '3px' }}
                  onClose={() => handleRemoveRange(index)}
                >
                  {`${getTimeDateString(date.start_date)} – ${getTimeDateString(date.end_date)}`}
                </Tag>
              );
            })}
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
          {isMobile ? (
            <>
              <Button
                onClick={() => {
                  !isLoading && setShowDatePicker(true);
                }}
                disabled={isLoading}
                size="large"
              >
                {t('Add Range')}
              </Button>

              <DrawerModal
                title={t('Select Date Range')}
                visible={showDatePicker}
                onCancel={() => setShowDatePicker(false)}
                width="100%"
                footer={null}
                destroyOnClose
              >
                {datePickerContent}
              </DrawerModal>
            </>
          ) : (
            <Popover placement="top" content={datePickerContent} trigger="click" open={showDatePicker}>
              <Button
                onClick={() => {
                  if (!isLoading) setShowDatePicker(true);
                }}
                disabled={isLoading}
                size="large"
              >
                {t('Add Range')}
              </Button>
            </Popover>
          )}
        </div>
        <ErrorMessage message={error} asAlert />
      </Space>
    </DrawerModal>
  );
});

export default BookingModal;
