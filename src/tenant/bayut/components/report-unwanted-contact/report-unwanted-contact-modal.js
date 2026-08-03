import tenantConstants from '@constants';
import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button } from 'antd';
import { DrawerModal, RadioButtons, TextInput, Group } from '../../../../components/common';
import PhoneIntl from '../../../../components/phone-input/PhoneIntl';
import { useReportUnwantedContactMutation } from '../../../../apis/common';
import { useLazyGetMyListingsForSelectQuery } from '../../../../apis/listings';
import notify from '../../../../components/common/notification/notifications';
import { convertQueryObjToString } from '../../../../utility/urlQuery';
import { getErrorString } from '../../../../utility/utility';
import ListingCard from './listing-card';
import ListingDropdown from './listing-dropdown';
import { getCallersOptions, getNationalityOptions } from './data';

const ReportUnwantedContactModal = ({ visible, onCancel }) => {
  const { t } = useTranslation();
  const { isMobile } = useSelector((state) => state.app.AppConfig);
  const [reportUnwantedContact, { isLoading: isSubmitting }] = useReportUnwantedContactMutation();
  const [getMyListingsForSelect, { isLoading: fetchingListings, isFetching: isFetchingListings }] =
    useLazyGetMyListingsForSelectQuery();
  const [isLoadingListings, setIsLoadingListings] = useState(false);
  const [allListings, setAllListings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [selectedListingData, setSelectedListingData] = useState(null);

  const validationSchema = Yup.object().shape({
    listing_id: Yup.number().required(t('Please select a property listing')),
    callers: Yup.string().required(t('Please select how many callers')),
    nationality: Yup.string().required(t('Please select nationality')),
    sub_nationality: Yup.string().when('nationality', {
      is: 'non_saudi',
      then: (schema) => schema.required(t('Please enter nationality')),
      otherwise: (schema) => schema.nullable(),
    }),
    phone_number: Yup.string().required(t('Please enter phone number')),
    name: Yup.string().nullable(),
  });

  const formik = useFormik({
    initialValues: {
      listing_id: null,
      callers: '',
      nationality: '',
      sub_nationality: '',
      phone_number: '',
      name: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const payload = {
          listing_id: values.listing_id,
          reported_contact: {
            callers: values.callers,
            nationality: values.nationality,
            sub_nationality: values.nationality === 'non_saudi' ? values.sub_nationality : undefined,
            phone_number: values.phone_number,
            name: values.name || undefined,
          },
        };

        await reportUnwantedContact(payload).unwrap();
        notify.success(t('Report submitted successfully'));
        formik.resetForm();
        setSelectedListingData(null);
        onCancel();
      } catch (error) {
        const errorMessage = getErrorString(error);
        notify.error(errorMessage || t('Failed to submit report. Please try again.'));
      }
    },
  });

  const fetchListings = useCallback(
    async (page = 1, append = false) => {
      if ((fetchingListings || isFetchingListings || isLoadingListings) && !append) return;

      try {
        setIsLoadingListings(true);
        const queryObj = { page };
        const mappedParams = convertQueryObjToString(queryObj);

        const response = await getMyListingsForSelect({ mappedParams });

        if (response?.data?.listings) {
          if (append && page > 1) {
            setAllListings((prev) => [...prev, ...response.data.listings]);
          } else {
            setAllListings(response.data.listings);
          }

          const pagination = response.data.pagination;
          setHasMorePages(pagination?.next_page !== null);
          if (!append) {
            setCurrentPage(page);
          }
        }
      } catch (error) {
        notify.error(t('Failed to load listings'));
      } finally {
        setIsLoadingListings(false);
      }
    },
    [fetchingListings, isFetchingListings, isLoadingListings, getMyListingsForSelect, t],
  );

  useEffect(() => {
    if (visible) {
      fetchListings(1);
    } else {
      formik.resetForm();
      setAllListings([]);
      setCurrentPage(1);
      setHasMorePages(true);
      setSelectedListingData(null);
      setIsLoadingListings(false);
    }
  }, [visible]);

  useEffect(() => {
    if (formik.values.listing_id) {
      const listing = allListings.find((l) => l.id === formik.values.listing_id);
      setSelectedListingData(listing);
    } else {
      setSelectedListingData(null);
    }
  }, [formik.values.listing_id, allListings]);

  const handleListingScroll = useCallback(() => {
    if (hasMorePages && !fetchingListings && !isFetchingListings && !isLoadingListings) {
      fetchListings(currentPage + 1, true);
    }
  }, [hasMorePages, fetchingListings, isFetchingListings, isLoadingListings, currentPage, fetchListings]);

  const handleListingSelect = (listing) => {
    formik.setFieldValue('listing_id', listing.id, true);
    Promise.resolve().then(() => {
      formik.setFieldTouched('listing_id', true, false);
    });
  };

  const callersOptions = getCallersOptions(t);
  const nationalityOptions = getNationalityOptions(t);

  const isFormValid =
    formik.values.listing_id &&
    formik.values.callers &&
    formik.values.nationality &&
    formik.values.phone_number &&
    (formik.values.nationality !== 'non_saudi' || formik.values.sub_nationality) &&
    !Object.keys(formik.errors).length;
  const showSubNationality = formik.values.nationality === 'non_saudi';

  return (
    <DrawerModal
      title={
        <div>
          <div style={{ marginBottom: 8 }}>{t('Report Unwanted Contact')}</div>
          <p className="color-gray-dark fz-14" style={{ margin: 0, fontWeight: 400 }}>
            {t(
              'You can report if a broker or their representative contacts you through your listing to market your property.',
            )}
          </p>
        </div>
      }
      visible={visible}
      onCancel={onCancel}
      bodyStyle={{
        padding: 0,
        paddingLeft: isMobile ? 12 : 24,
        paddingRight: isMobile ? 12 : 24,
      }}
      width={isMobile ? '100%' : 600}
      footer={
        <Button
          type="primary"
          onClick={formik.handleSubmit}
          loading={isSubmitting}
          disabled={!isFormValid || isSubmitting}
          block
          size="large"
        >
          {t('Submit')}
        </Button>
      }
    >
      <form onSubmit={formik.handleSubmit}>
        <Group template="initial" gap="24px" style={{ maxHeight: '550px', overflowY: 'auto', paddingBottom: isMobile ? 12 : 24, paddingTop: isMobile ? 12 : 24 }}>
          <div>
            <ListingDropdown
              data={allListings}
              selectedValue={formik.values.listing_id}
              onSelect={handleListingSelect}
              placeholder={t('Select property listing to report')}
              label={t('Select property listing')}
              error={formik.touched.listing_id && formik.errors.listing_id ? formik.errors.listing_id : null}
              touched={formik.touched.listing_id}
              isLoading={isLoadingListings}
              isFetching={isFetchingListings}
              hasMorePages={hasMorePages}
              onScroll={handleListingScroll}
              showChangeButton={!!selectedListingData}
            />
          </div>

          {selectedListingData && <ListingCard listing={selectedListingData} isInDropdown={false} isSelected={false} />}

          <div>
            <RadioButtons
              name="callers"
              label={t('How many callers?')}
              value={formik.values.callers}
              handleChange={(e) => formik.setFieldValue('callers', e.target.value)}
              buttonList={callersOptions}
              shape="round"
              errorMsg={formik.touched.callers && formik.errors.callers}
            />
          </div>

          <div>
            <RadioButtons
              name="nationality"
              label={t('Nationality of person contacted (as per your assessment)')}
              value={formik.values.nationality}
              handleChange={(e) => {
                formik.setFieldValue('nationality', e.target.value);
                if (e.target.value !== 'non_saudi') {
                  formik.setFieldValue('sub_nationality', '');
                }
              }}
              buttonList={nationalityOptions}
              shape="round"
              errorMsg={formik.touched.nationality && formik.errors.nationality}
            />
          </div>

          {showSubNationality && (
            <div>
              <TextInput
                name="sub_nationality"
                label={t('Nationality')}
                placeholder={t("Please Enter Caller's Nationality")}
                value={formik.values.sub_nationality}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                errorMsg={formik.touched.sub_nationality && formik.errors.sub_nationality}
                size="large"
              />
            </div>
          )}

          <div>
            <PhoneIntl
              name="phone_number"
              label={t("Broker's Phone Number")}
              placeholder={t("Please Enter Caller's Number")}
              value={formik.values.phone_number || ''}
              onChange={(value) => formik.setFieldValue('phone_number', value || '', true)}
              onBlur={() => formik.setFieldTouched('phone_number', true)}
              errorMsg={formik.touched.phone_number && formik.errors.phone_number}
              defaultCountry={tenantConstants.COUNTRY_CODE}
              countrySelectProps={{ disabled: true }}
            />
          </div>

          <div>
            <TextInput
              name="name"
              label={t("Broker's Name (Optional)")}
              placeholder={t("Please Enter Caller's Name")}
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errorMsg={formik.touched.name && formik.errors.name}
              size="large"
            />
          </div>
        </Group>
      </form>
    </DrawerModal>
  );
};

export default ReportUnwantedContactModal;
