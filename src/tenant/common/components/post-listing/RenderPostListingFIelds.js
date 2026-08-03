import tenantConstants from '@constants';
import tenantData from '@data';
import TenantComponents from '@components';
import tenantUtils from '@utils';
import { Col, Row, Typography } from 'antd';
import { t } from 'i18next';
import React, { useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  Flex,
  Group,
  Icon,
  Number,
  RadioButtons,
  Select,
  Skeleton,
  Switch,
  TextInput,
} from '../../../../components/common';
import { IconStyled } from '../../../../components/common/icon/IconStyled';
import CreditInfo from '../../../../components/credits-info/credits-info';
import MobileVerification from '../../../../components/mobile-number-verification/mobile-verification';
import { AddAmenities, ImageSelect, VideoSelect } from '../../../../components/post-listing';
import { useScrollToPageSection } from '../../../../hooks';
import { imageUploadSuccessEvent } from '../../../../services/analyticsService';
import { formatDiscountPercentageForChip } from '../../../../components/discount-tag/DiscountTag';
import { BlockTitle, CardListing, PriceCheckValue } from './styled';
import appConstants from '@constants';
const allowedFilesType = ['jpg', 'png', 'jpeg'];

const { Text } = Typography;

const listingPriceToNumber = (raw) => {
  if (raw == null || raw === '') return NaN;
  const v = typeof raw === 'object' && raw !== null && 'value' in raw ? raw.value : raw;
  const n = globalThis.Number(v);
  return globalThis.Number.isFinite(n) ? n : NaN;
};

const parsePriceFieldValue = (value) => {
  if (value === '' || value == null) return null;
  const n = Number(String(value).replace(/,/g, '').trim());
  return Number.isFinite(n) ? n : null;
};

const formatPriceThousands = (n) =>
  new Intl.NumberFormat('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(n);

const RenderPostListingFields = (props) => {
  const {
    loading,
    formik,
    isMobile,
    setLoading,
    users,
    alreadyPosted = [],
    setAutoGenerateContent,
    autoGenerateContent,
    isOffPlan = false,
  } = props;
  const { user } = useSelector((state) => state.app.loginUser);
  const { locale } = useSelector((state) => state?.app?.AppConfig);
  const { t } = useTranslation();
  const showVideoField = appConstants.SHOW_VIDEO_FIELD
  const bedroomList = useMemo(() => {
    return tenantData.skipFieldsForField?.['bedrooms'].property_type[
      formik.values['sub_listing_type']?.id || formik.values['property_type']
    ]?.studio
      ? tenantData.bedroomsList?.filter((item) => item.key !== '-1')
      : tenantData.bedroomsList;
  }, [
    tenantData.skipFieldsForField,
    formik.values['property_type'],
    tenantData.bedroomsList,
    formik.values['sub_listing_type']?.id,
  ]);
  useScrollToPageSection();
  useEffect(() => {
    setAutoGenerateContent((prev) => ({
      ...prev,
      title: formik.values?.generate_title,
      description: formik.values?.generate_description,
    }));
  }, [formik.values?.generate_title, formik.values?.generate_description, locale]);

  const listingPurposeSlug = formik?.values?.listing_purpose?.slug;

  const v = formik.values;
  const discountPercentDisplay = useMemo(() => {
    if (!v.property_discount_enabled || listingPurposeSlug !== 'sale') return null;
    const base = listingPriceToNumber(v.price);
    const discounted = globalThis.Number(v.discounted_price);
    if (!(base > 0 && discounted > 0 && discounted < base)) return null;
    return ((base - discounted) / base) * 100;
  }, [v.property_discount_enabled, v.price, v.discounted_price, listingPurposeSlug]);

  const hasFormikDiscountPercentage =
    v.discount_percentage != null && v.discount_percentage !== '';
  const hasNonEmptyDiscountedPrice =
    v.discounted_price != null && String(v.discounted_price).trim() !== '';
  const showDiscountPercentageExtra =
    discountPercentDisplay != null || (hasFormikDiscountPercentage && hasNonEmptyDiscountedPrice);
  const discountPercentageShown = hasFormikDiscountPercentage && hasNonEmptyDiscountedPrice
    ? discountPercentDisplay ?? v.discount_percentage
    : discountPercentDisplay;

  const discountPercentageFormatted = useMemo(
    () => formatDiscountPercentageForChip(discountPercentageShown),
    [discountPercentageShown],
  );

  return (
    <>
    <CardBlock icon="PropertyInformationIcon" title={t('Property Information')}>
            <Group id="location" gap="32px" style={{ maxWidth: 640 }}>
            <Select
              name="listing_type"
              key="listing_type"
              label={t('Property Type')}
              labelIcon="FiUser"
              placeholder={t('Select Listing Type')}
              onChange={(_value, option) => formik.setFieldValue('listing_type', option, true)}
              onBlur={() => formik?.setFieldTouched('listing_type', true)}
              value={tenantUtils.getLocalisedString(formik?.values?.['listing_type'], 'title')}
              options={formik?.values?.listing_types || []}
              getOptionLabel={(op) => tenantUtils.getLocalisedString(op, 'title')}
              getOptionValue={(op) => op?.id}
              errorMsg={
                formik?.errors['listing_type'] &&
                formik?.touched['listing_type'] &&
                formik?.errors['listing_type']
              }
            />
            </Group>
      </CardBlock>
      <CardBlock icon="IconLocationPurpose" title={t('Property Location')}>
        <Group id="location" gap="32px" style={{ maxWidth: 640 }}>
          <TenantComponents.LocationSelect
            name="Location_select"
            formik={formik}
            setFieldValue={formik.setFieldValue}
            setFieldTouched={formik.setFieldTouched}
            value={formik?.values['location-info']}
            error={formik.errors?.['location-info']}
            touched={formik.touched?.['location-info']}
            onBlur={formik.handleBlur}
            item={{ key: 'location-info' }}
            onCityChange={(option) => {
              // formik.setFieldValue(['location-info']?.city, { ...option, id: option?.city?.city_id });
            }}
            renderCrossCityAlerts={() => {}}
            hideLocation={false}
            onLocationSelect={() => {}}
            user={user}
            showPlot={true}
            propertyType={formik.values['listing_type']}
          />
        </Group>
      </CardBlock>
      <CardBlock icon="IconImagesPost" title={t('Property Images')}>
        <Group id="images" gap="32px" style={{ maxWidth: 640 }}>
          <ImageSelect
            labelIcon="LuImage"
            label={t('Images')}
            values={formik.values}
            setFieldValue={formik.setFieldValue}
            errorMsg={
              formik.errors['property_images'] && formik.touched['property_images'] && formik.errors['property_images']
            }
            valueKey={'property_images'}
            filesAllowed={tenantData.allowedFilesType}
            imageBankIcon={false}
            showImageBank={false}
            onImageUpload={(response) => {
              imageUploadSuccessEvent(user, response, !alreadyPosted, formik.values);
            }}
            showQualityTip={tenantConstants.SHOW_QUALITY_TIP}
            propertyTypeId={formik.values?.['property_type']}
          />
          {showVideoField && (
            <VideoSelect
              labelIcon="MdVideoCall"
              label={t('Add Videos of your Property')}
              value={formik.values['videos']}
              setFieldValue={formik.setFieldValue}
              errorMsg={formik.errors['videos'] && formik.touched['videos'] && formik.errors['videos']}
              valueKey="videos"
              hostList={tenantData.videoHostsList}
              isMobile={isMobile}
            />
          )}
        </Group>
      </CardBlock>
      <CardBlock icon="IconAdInformation" title={t('Price and Specs')}>
        <Group id="specs" gap="32px" style={{ maxWidth: 640 }}>
          {formik?.values?.listing_purpose?.slug == 'sale' ? (
            <>
            <TextInput
              key="price"
              name="price"
              label={
                <>
                  {t('Price')} <>({tenantConstants.CURRENCY_SYMBOL()})</>
                </>
              }
              labelIcon="RiPriceTag3Line"
              placeholder={t('Enter Price')}
              handleChange={(event) => {
                formik.setFieldValue('price', event.target.value, true);
              }}
              suffix={<span className="color-gray-dark">{tenantConstants.CURRENCY_SYMBOL()}</span>}
              handleBlur={(event) => {
                formik.setFieldTouched('price', true);
                formik.setFieldValue('price', event.target.value, true);
              }}
              value={formik?.values['price']}
              skeletonLoading={loading}
              errorMsg={formik?.errors['price'] && formik?.touched['price'] && formik?.errors['price']}
              extra={() => {
                if (!formik?.values['price'] || formik?.errors['price']) return null;
                const n = parsePriceFieldValue(formik?.values['price']);
                if (n === null) return null;
                return (
                  <PriceCheckValue>
                    <Flex align="center" gap="8px">
                      <span
                        className="color-gray-dark"
                        style={{ display: 'inline-flex', alignItems: 'center', lineHeight: 1 }}
                      >
                        {tenantConstants.CURRENCY_SYMBOL()}
                      </span>
                      <span>{formatPriceThousands(n)}</span>
                    </Flex>
                  </PriceCheckValue>
                ) : null;
              }}
              disabled={!!formik?.values['price']}
            />
            {tenantConstants.SHOW_LISTING_DISCOUNT_TAG && listingPurposeSlug === 'sale' && !isOffPlan && (
              <Group template="max-content auto" gap="16px" className="w-100" style={{ marginTop: 8 }}>
                <IconStyled aria-hidden="true" style={{ visibility: 'hidden' }}>
                  <Icon icon="RiCalendar2Fill" />
                </IconStyled>
                <Group template="initial" gap="16px" className="w-100">
                  <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                    <Switch
                      switchOnly
                      size="small"
                      name="property_discount_enabled"
                      value={!!formik.values.property_discount_enabled}
                      onChange={(checked) => {
                        const on = !!checked;
                        formik.setFieldValue('property_discount_enabled', on, false);
                        if (!on) {
                          formik.setFieldValue('discounted_price', '', false);
                          formik.setFieldTouched('discounted_price', false, false);
                          const nextErrors = { ...(formik.errors || {}) };
                          delete nextErrors.discounted_price;
                          formik.setErrors(nextErrors);
                        }
                      }}
                    />
                    <Text
                      style={{
                        marginInlineStart: 6,
                        fontSize: isMobile ? 10 : 13,
                        lineHeight: '1.1',
                      }}
                    >
                      {t('Apply Discount')}
                    </Text>
                  </div>
                  {!!formik.values.property_discount_enabled && (
                    <TextInput
                      key="discounted_price"
                      id="post-listing-discounted-price"
                      name="discounted_price"
                      label={
                        <>
                          {t('Discounted Price')} <>({tenantConstants.CURRENCY_SYMBOL()})</>
                        </>
                      }
                      placeholder={t('Enter discounted price')}
                      type="number"
                      handleChange={(event) => {
                        formik.setFieldValue('discounted_price', event.target.value, true);
                      }}
                      suffix={<span className="color-gray-dark">{tenantConstants.CURRENCY_SYMBOL()}</span>}
                      value={formik?.values?.discounted_price ?? ''}
                      skeletonLoading={loading}
                      errorMsg={formik?.errors?.discounted_price}
                      extra={() =>
                        showDiscountPercentageExtra ? (
                          <Text
                            type="secondary"
                            className="fz-12 color-gray-dark"
                            style={{ display: 'block', textAlign: 'start', marginTop: 6, width: '100%' }}
                          >
                            {t('Discount Percentage')}:{' '}
                            <strong>
                              <span dir="ltr">{discountPercentageFormatted}%</span>
                            </strong>
                          </Text>
                        ) : null
                      }
                    />
                  )}
                </Group>
              </Group>
            )}
          </>
          ) : (
            <>
              <RadioButtons
                name="rental_frequency"
                shape="round"
                key="rental_frequency"
                label={t('Rental Frequency')}
                inputLeftIcon="user"
                labelIcon="MdOutlineMap"
                value={formik?.values['rental_frequency']}
                handleChange={(e) => {
                  formik.setFieldValue('rental_frequency', e?.target?.value, true);
                }}
                buttonList={tenantData.rentalFrequencyList.map((item) => ({ ...item, label: t(item.label) }))}
                errorMsg={
                  formik.errors['rental_frequency'] &&
                  formik?.touched['rental_frequency'] &&
                  formik.errors['rental_frequency']
                }
              />
              <TextInput
                key="rental_price"
                name="rental_price"
                label={
                  <>
                    {t('Rent Price')} <>({tenantConstants.CURRENCY_SYMBOL()})</>
                  </>
                }
                labelIcon="RiPriceTag3Line"
                placeholder={t('Enter Rent')}
                handleBlur={(event) => {
                  formik.setFieldTouched('rental_price', true);
                  formik.setFieldValue('rental_price', event.target.value, true);
                }}
                handleChange={(event) => {
                  formik.setFieldValue('rental_price', event.target.value, true);
                }}
                value={formik?.values['rental_price']}
                skeletonLoading={loading}
                errorMsg={
                  formik?.errors['rental_price'] && formik?.touched['rental_price'] && formik?.errors['rental_price']
                }
                suffix={<span className="color-gray-dark">{tenantConstants.CURRENCY_SYMBOL()}</span>}
                extra={() => {
                  if (!formik?.values['rental_price'] || formik?.errors['rental_price']) return null;
                  const n = parsePriceFieldValue(formik?.values['rental_price']);
                  if (n === null) return null;
                  return (
                    <PriceCheckValue>
                      <Flex align="center" gap="8px">
                        <span
                          className="color-gray-dark"
                          style={{ display: 'inline-flex', alignItems: 'center', lineHeight: 1 }}
                        >
                          {tenantConstants.CURRENCY_SYMBOL()}
                        </span>
                        <span>{formatPriceThousands(n)}</span>
                      </Flex>
                    </PriceCheckValue>
                  );
                }}
              />
            </>
          )}
          {!!formik?.values?.listingTypes?.length && (
            <Select
              name="sub_listing_type"
              key="sub_listing_type"
              label={t('Property Type')}
              labelIcon="FiUser"
              placeholder={t('Select Property Type')}
              onChange={(_value, option) => formik.setFieldValue('sub_listing_type', option, true)}
              onBlur={() => formik?.setFieldTouched('sub_listing_type', true)}
              value={tenantUtils.getLocalisedString(formik?.values?.['sub_listing_type'], 'title')}
              options={formik?.values?.listingTypes}
              getOptionLabel={(op) => tenantUtils.getLocalisedString(op, 'title')}
              getOptionValue={(op) => op?.id}
              errorMsg={
                formik?.errors['sub_listing_type'] &&
                formik?.touched['sub_listing_type'] &&
                formik?.errors['sub_listing_type']
              }
            />
          )}
          {!tenantData.skipFieldsForField?.['bedrooms'].property_type[
            formik.values['sub_listing_type']?.id || formik.values['property_type']
          ]?.skipField && (
            <RadioButtons
              name="bedrooms"
              shape="round"
              key="bedrooms"
              label={t('Number of Bedrooms')}
              inputLeftIcon="user"
              labelIcon="LuBedDouble"
              value={formik?.values['bedrooms']}
              handleChange={(e) => {
                formik.setFieldValue('bedrooms', e?.target?.value, true);
              }}
              buttonList={bedroomList}
              errorMsg={formik.errors['bedrooms'] && formik?.touched['bedrooms'] && formik.errors['bedrooms']}
            />
          )}
          {!tenantData.skipFieldsForField?.['bathrooms'].property_type[
            formik.values['sub_listing_type']?.id || formik.values['property_type']
          ]?.skipField && (
            <RadioButtons
              name="bathrooms"
              shape="round"
              key="bathrooms"
              label={t('Number of Bathrooms')}
              inputLeftIcon="user"
              labelIcon="BiBath"
              value={formik?.values['bathrooms']}
              handleChange={(e) => {
                formik.setFieldValue('bathrooms', e?.target?.value, true);
              }}
              buttonList={tenantData.bathroomsList}
              errorMsg={formik.errors['bathrooms'] && formik?.touched['bathrooms'] && formik.errors['bathrooms']}
            />
          )}
          {!tenantData.skipFieldsForField?.['furnished'].property_type[
            formik.values['sub_listing_type']?.id || formik.values['property_type']
          ] && (
            <RadioButtons
              name="furnished"
              shape="round"
              key="furnished"
              label={t('Furnished')}
              inputLeftIcon="user"
              labelIcon="LuLamp"
              value={formik?.values['furnished']}
              handleChange={(e) => {
                formik.setFieldValue('furnished', e?.target?.value, true);
              }}
              buttonList={[
                { key: '1', label: t('Yes') },
                { key: '0', label: t('No') },
              ]}
              errorMsg={formik.errors['furnished'] && formik?.touched['furnished'] && formik.errors['furnished']}
            />
          )}
          {formik?.values?.residence_type_applicable && formik?.values?.residenceTypes?.length > 0 && (
            <Select
              name="residence_type"
              key="residence_type"
              label={t('Residence Type')}
              labelIcon="IconResidentialPlots"
              placeholder={t('Select Residence Type')}
              value={formik?.values['residence_type']}
              onChange={(e) => {
                formik?.setFieldValue('residence_type', e);
              }}
              onBlur={() => formik?.setFieldTouched('residence_type', true)}
              options={formik?.values?.residenceTypes}
              getOptionLabel={(op) => tenantUtils.getLocalisedString(op, 'name')}
              getOptionValue={(op) => op.id}
            />
          )}
        </Group>
      </CardBlock>
      <CardBlock icon="IconAdInformation" title={t('Features and Amenities')}>
        <Group id="amenities" gap="32px" style={{ maxWidth: 640 }}>
          <AddAmenities
            name="feature_and_amenities"
            handleChange={(values) => {
              formik.setFieldValue('feature_and_amenities', values);
            }}
            handleBlur={formik?.handleBlur}
            value={formik?.values['feature_and_amenities']}
            skeletonLoading={loading}
            key="feature_and_amenities"
            labelIcon="MdOutlineOtherHouses"
            bodyStyle={{ paddingBlockStart: 'initial' }}
            payloadKey={formik.values?.['property_type']}
            showQualityTip={tenantConstants.SHOW_QUALITY_TIP}
            propertyTypeId={formik.values?.['property_type']}
            listingPurpose={formik.values?.['listing_purpose']}
            isPosted={formik.values?.['is_posted']}
          />
        </Group>
      </CardBlock>
      <CardBlock icon="IconFeaturesAmenities" title={t('Title and Description')}>
        <Group id="description" gap="32px" style={{ maxWidth: 640 }}>
          <div style={{ marginTop: 24 }}>
            <TenantComponents.GenerateContentField
              formik={formik}
              setSubmitDisable={setLoading}
              labelIcon="PiTextT"
              desc={'title'}
              skipField={locale == 'en' ? 'property_description_en' : 'property_description_ar'}
              name={locale == 'ar' ? 'property_title_ar' : 'property_title_en'}
              dir={locale == 'ar' ? 'rtl' : ''}
              label={locale == 'ar' ? 'عنوان' : 'Title'}
              placeholder={
                locale == 'ar'
                  ? 'أدخل العنوان، على سبيل المثال، منزل جديد جميل...'
                  : 'Enter title e.g Beautiful new house...'
              }
              payloadKey={locale == 'en' ? 'title' : 'title_l1'}
              showAutoSwitch={true}
            />
          </div>
          {!autoGenerateContent.title && tenantConstants?.AUTO_TRANSLATE_CONTENT && (
            <div
              style={{
                marginInlineEnd: 49,
                marginTop: 24,
                direction: locale === 'en' ? 'rtl' : 'ltr',
                textAlign: locale === 'en' ? 'right' : 'left',
              }}
            >
              <TenantComponents.GenerateContentField
                formik={formik}
                setSubmitDisable={setLoading}
                lineCount={1}
                desc={'title'}
                skipField={locale === 'en' ? 'property_description_en' : 'property_description_ar'}
                name={locale === 'en' ? 'property_title_ar' : 'property_title_en'}
                dir={locale == 'en' ? 'rtl' : ''}
                label={locale === 'en' ? 'عنوان' : 'Title'}
                placeholder={
                  locale === 'en'
                    ? 'أدخل العنوان، على سبيل المثال، منزل جديد جميل...'
                    : 'Enter title e.g Beautiful new house...'
                }
                payloadKey={locale === 'en' ? 'title_l1' : 'title'}
              />
            </div>
          )}
          <div style={{ marginTop: 24 }}>
            <TenantComponents.GenerateContentField
              formik={formik}
              setSubmitDisable={setLoading}
              labelIcon="BiDetail"
              lineCount={isMobile ? 3 : 5}
              limit={2500}
              desc={'description'}
              skipField={locale == 'en' ? 'property_title_en' : 'property_title_ar'}
              payloadKey={locale == 'en' ? 'description' : 'description_l1'}
              name={locale == 'ar' ? 'property_description_ar' : 'property_description_en'}
              dir={locale == 'ar' ? 'rtl' : ''}
              label={locale == 'ar' ? 'وصف' : 'Description'}
              placeholder={locale == 'ar' ? 'صف عقارك بالتفصيل' : 'Describe your property in detail'}
              showAutoSwitch={true}
            />
          </div>
          {!autoGenerateContent.description && tenantConstants?.AUTO_TRANSLATE_CONTENT && (
            <div
              style={{
                marginInlineEnd: 49,
                marginTop: 24,
                direction: locale === 'en' ? 'rtl' : 'ltr',
                textAlign: locale === 'en' ? 'right' : 'left',
              }}
            >
              <TenantComponents.GenerateContentField
                formik={formik}
                setSubmitDisable={setLoading}
                lineCount={isMobile ? 3 : 5}
                limit={2500}
                desc={'description'}
                skipField={locale == 'ar' ? 'property_title_en' : 'property_title_ar'}
                payloadKey={locale == 'ar' ? 'description' : 'description_l1'}
                name={locale == 'en' ? 'property_description_ar' : 'property_description_en'}
                dir={locale == 'en' ? 'rtl' : ''}
                label={locale == 'en' ? 'وصف' : 'Description'}
                placeholder={locale == 'en' ? 'صف عقارك بالتفصيل' : 'Describe your property in detail'}
              />
            </div>
          )}
        </Group>
      </CardBlock>
      <CardBlock icon="IconContactInfo" title={t('Contact Information')}>
        <Group id="contactInfo" gap="32px" style={{ maxWidth: 640 }}>
          {user?.is_agency_admin && (
            <Select
              name="posting_as"
              key="posting_as"
              label={t('Posting As')}
              labelIcon="FiUser"
              placeholder={t('Select User')}
              value={tenantUtils.getLocalisedString(formik?.values['posting_as'], 'name')}
              // onChange={onUserChange}
              onBlur={() => formik?.setFieldTouched('posting_as', true)}
              options={users}
              getOptionLabel={(op) => tenantUtils.getLocalisedString(op, 'name')}
              getOptionValue={(op) => op.id}
              disabled={true}
            />
          )}

          <Group template="max-content auto" gap="16px">
            <MobileVerification
              name={`mobile`}
              placeholder={t('Enter Phone Number')}
              defaultCountry={tenantConstants.COUNTRY_CODE}
              value={formik?.values['mobile']}
              onChange={(value) => {
                formik.setFieldValue(`mobile`, !!value ? value : '', true);
              }}
              errorMsg={formik.errors['mobile'] && formik.touched['mobile'] && formik.errors['mobile']}
              touched={formik.touched.mobile}
              onBlur={() => formik.setFieldTouched(`mobile`, true)}
              label={t('Phone Number')}
              labelIcon={'MdSmartphone'}
              isMobile={isMobile}
              userType={'User'}
              isUserVerified={!!user?.is_mobile_verified}
              disabled={user?.mobile && !!user?.is_mobile_verified}
              containerClassName={'pos-rel'}
              userId={user?.id}
              countrySelectProps={{ disabled: true }}
            />
          </Group>
        </Group>
      </CardBlock>
      {user?.credits?.ksa?.available > 0 && (
        <div id="creditsInfo">
          <CardBlock icon="IconPackageCredit" title={t('Package & Credits Info')}>
            {isMobile && (
              <>
                <Flex gap="16px" align="start">
                  {/* <Icon
                  icon={'IconListings'}
                  style={{ borderRadius: '50%' }}
                  iconProps={{ size: 16 }}
                  width={isMobile ? 32 : 52}
                  height={isMobile ? 32 : 52}
                /> */}

                  <IconStyled>
                    <Icon icon="IconCredit" />
                  </IconStyled>
                  <Flex vertical gap="8px" className="w-100">
                    <Text strong>{t('Package & Credits Info')}</Text>
                  </Flex>
                </Flex>
              </>
            )}
            <CreditInfo
              isMobile={isMobile}
              loading={loading}
              cardStyle={{ marginInlineStart: '48px', width: !isMobile && '594px', borderWidth: 1 }}
            />
          </CardBlock>
        </div>
      )}
    </>
  );
};

const CardBlock = ({ title, children, icon, loading, renderTitleOnMobile = false }) => {
  const isMob = useSelector((state) => state.app.AppConfig.isMobile);
  const renderTitle = (icon = 'MdCircle', title = t('Block title goes here')) => {
    return (
      <Col xs={24} lg={5} style={{ alignSelf: 'self-start' }}>
        <Row align="middle" gutter={[16, 0]}>
          <Col xs={4} lg={24}>
            {loading ? (
              <Skeleton type="avatar" size={isMob ? 40 : 52} className="mb-8" />
            ) : (
              <Icon icon={icon} width={isMob ? 40 : 52} height={isMob ? 40 : 52} />
            )}
          </Col>
          <Col xs={20} lg={24}>
            {loading ? <Skeleton type="title" width={100} /> : <BlockTitle>{title}</BlockTitle>}
          </Col>
        </Row>
      </Col>
    );
  };

  return (
    <CardListing>
      <Row align="middle" gutter={[32, 16]}>
        {(renderTitleOnMobile || !isMob) && renderTitle(icon, title)}
        <Col xs={24} lg={19}>
          {children}
        </Col>
      </Row>
    </CardListing>
  );
};

const PostListingSkeleton = () => {
  const renderFields = (list, key) => {
    return [1, 2, 3, 4, 5].map((e) => {
      return (
        <Col key={e}>
          <Row className="mb-8">
            <Skeleton type="avatar" />
            <Skeleton type="input" />
          </Row>
          <Skeleton type="input" />
        </Col>
      );
    });
  };
  return [1, 2, 3].map((item) => (
    <CardBlock loading key={item}>
      <Group style={{ maxWidth: 640 }}>{renderFields()}</Group>
    </CardBlock>
  ));
};

export default RenderPostListingFields;
