import { Button, Card, Flex, Group, Number, RadioButtons, Select, TextInput, notification } from '@/components/common';
import { useRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { PriceCheckValue } from '@components/post-listing/styled';
import tenantData from '@data';
import { useFormik } from 'formik';
import tenantUtils from '@utils';
import tenantConstants from '@constants';
import TenantComponents from '@components';
import MobileVerification from '@/components/mobile-number-verification/mobile-verification';
import { PostListingAction } from '../../../common/components/post-listing/styled';
import { Divider } from '../../../../components/common';
import CardBlock from './card-block';
import PurposeRadioButtonRightComponent from './purpose-radio-button';
import {
  useGetPropertyAgesQuery,
  useGetAdLicenseProductsQuery,
  useLazyGetListingCategoriesByParentQuery,
  useCreateAdLicenseMutation,
} from '../../apis/adLicense';
import { useCreateCartMutation } from '../../../../apis/cart';
import { useRouteNavigate } from '../../../../hooks';
import {
  continuePaymentClickEvent,
  Scroll100Event,
  Scroll50Event,
  viewAdFromEvent,
} from '../../../../services/analyticsService';

const CreateAdLicense = (props) => {
  const { isMobile } = useSelector((state) => state.app.AppConfig);
  const { user } = useSelector((state) => state.app.loginUser);

  const { t } = useTranslation();
  const formikRef = useRef();
  const formRef = useRef(null);

  const [hasTriggered50, setHasTriggered50] = useState(false);
  const [hasTriggered100, setHasTriggered100] = useState(false);

  const [propertySubTypes, setPropertySubTypes] = useState([]);
  const [selectedPurpose, setSelectedPurpose] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedPurposePrice, setSelectedPurposePrice] = useState(0);

  const { data: propertyAges = [] } = useGetPropertyAgesQuery();
  const {
    data: adLicenseProducts = tenantConstants.PURPOSE_LIST,
  } = useGetAdLicenseProductsQuery();
  const [getListingCategoriesByParent] = useLazyGetListingCategoriesByParentQuery();
  const [createAdLicense, { isLoading: isSubmitting }] = useCreateAdLicenseMutation();
  const [createCart] = useCreateCartMutation();
  const navigate = useRouteNavigate();

  useEffect(() => {
    viewAdFromEvent(user);
  }, []);


  useEffect(() => {
    const formEl = formRef.current;
    if (!formEl) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = formEl;
      const scrollPosition = scrollTop + clientHeight;
      const percent = (scrollPosition / scrollHeight) * 100;

      if (percent >= 50 && !hasTriggered50) {
        Scroll50Event(user);
        setHasTriggered50(true);
      }

      if (percent >= 95 && !hasTriggered100) {
        Scroll100Event(user);
        setHasTriggered100(true);
      }
    };

    formEl.addEventListener('scroll', handleScroll);
    return () => formEl.removeEventListener('scroll', handleScroll);
  }, [hasTriggered50, hasTriggered100, user]);

  const formik = useFormik({
    initialValues: tenantData?.getAdLicenseInitialValues?.(user),
    validate: (values) => {
      const schema = tenantData?.getAdLicenseValidationSchema?.(
        tenantData.getAdLicensePropertyPermissions(values.property_sub_type),
      );
      try {
        schema.validateSync(values, { abortEarly: false });
      } catch (err) {
        return err.inner.reduce((acc, curr) => {
          acc[curr.path] = curr.message;
          return acc;
        }, {});
      }
      return {};
    },
    innerRef: formikRef,
    validateOnChange: false,
    onSubmit: (values, formikHelpers) => handleSubmit(values, formikHelpers),
  });

  const propertyPermissions = tenantData.getAdLicensePropertyPermissions(formik.values.property_sub_type);

  useEffect(() => {
    if (formik.values.purpose && adLicenseProducts.length > 0) {
      const selectedProduct = adLicenseProducts.find((product) => product.purpose_id === formik.values.purpose);
      setSelectedPurposePrice(selectedProduct?.price || 0);
    }
  }, [formik.values.purpose, adLicenseProducts]);

  useEffect(() => {
    if (formik.values.property_type) {
      formik.setFieldValue('property_sub_type', null);
    }
  }, [formik.values.property_type]);

  const handleSubmit = async (values, formikHelpers) => {
    try {
      const requiredFields = {
        name: values.name,
        mobile: values.mobile,
        purpose: values.purpose,
        property_type: values.property_type,
        property_sub_type: values.property_sub_type,
        property_ownership_document_number: values.property_ownership_document_number,
        price: values.price,
      };

      const missingFields = Object.entries(requiredFields).filter(([key, value]) => !value);
      if (missingFields.length > 0) {
        notification.error(t('Please fill in all required fields'));
        formikHelpers.setSubmitting(false);
        return;
      }

      const payload = {
        ad_license: {
          name_en: values.name,
          name_ar: values.name,
          phone_number: values.mobile,
          whatsapp_number: values.mobile,
          purpose_id: parseInt(values.purpose),
          type_id: parseInt(values.property_type),
          deed_number: values.property_ownership_document_number,
          property_price: parseInt(values.price),
          latitude: parseFloat(values?.['location-info']?.map?.latitude),
          longitude: parseFloat(values?.['location-info']?.map?.longitude),
          rooms_count: parseInt(values.bedrooms) || 0,
          location_id: values?.location?.value || null,
        },
      };

      const response = await createAdLicense(payload).unwrap();

      notification.success(t('Ad License request submitted successfully!'));

      if (response?.ad_license_request?.id) {
        continuePaymentClickEvent(user, true);
        await createAdLicenseCart(response.ad_license_request.id, values.purpose);
      } else {
        navigate('/listings?tab=ad_licenses');
      }
    } catch (error) {
      continuePaymentClickEvent(user, false);
      const errorMessage =
        error?.data?.message || error?.message || 'Failed to create ad license request. Please try again.';
      notification.error(t(errorMessage));
      formikHelpers.setSubmitting(false);
    }
  };

  const createAdLicenseCart = async (adLicenseId, purposeId) => {
    try {
      const cartPayload = {
        source: 'profolio',
        requestable_type: 'AdLicenseRequest',
        requestable_id: adLicenseId,
        total_credits:1,
        cart_details_attributes: [
          {
            item_id: adLicenseProducts.find(item => item.purpose_id === purposeId)?.id,
            item_type: 'Product',
            source: 'profolio',
            quantity: 1,
          },
        ],
      };

      const cartResponse = await createCart({ cart: cartPayload }).unwrap();

      if (cartResponse?.cart?.id) {
        navigate(`/checkout?cart_id=${cartResponse.cart.id}&ad_license=true`, {
          state: {
            interactedFrom: 'ad_license',
            adLicenseId: adLicenseId,
          },
        });
      } else {
        navigate('/listings?tab=ad_licenses');
      }
    } catch (error) {
      notification.error(t('Ad License created but failed to create payment. Please check your requests in listings.'));
      navigate('/listings?tab=ad_licenses');
    }
  };


  const getListingCategories =  (slug, purposeSlug, response) => {
    const purposeName = adLicenseProducts.find((item) => item.purpose_id === purposeSlug)?.name;
    let slugPurpose = ''
    if(purposeName?.includes('Sell')){
      slugPurpose = 'sale';
    } else if(purposeName?.includes('Rent')){
      slugPurpose = 'rent';
    }
    if(slug ==='residential' && slugPurpose){
      setPropertySubTypes(response.filter((item) => item?.dynamic_section?.slug === 'residential' && item?.purpose_hash?.slug === slugPurpose));
    }
    if(slug ==='commercial' && slugPurpose){
      setPropertySubTypes(response.filter((item) => item?.dynamic_section?.slug === 'commercial' && item?.purpose_hash?.slug === slugPurpose));
    }
  }

  useEffect(() => {
    getListingCategories(selectedProperty, selectedPurpose, categories)
  }, [selectedProperty, selectedPurpose])

  const handlePropertyTypeChange = (e) => {
    const value = e?.target?.value;

    formik.setFieldValue('property_type', value, true);
   
    if (!value) {
      setPropertySubTypes([]);
      return;
    }

    const propertyTypeOption = tenantData.AD_LICENSE_PROPERTY_TYPE_LIST.find((item) => item.key == value);
    setSelectedProperty(propertyTypeOption.slug);
    if (!propertyTypeOption?.slug) {
      setPropertySubTypes([]);
      return;
    }
    getListingCategoriesByParent()
      .unwrap()
      .then((response) => {
        setCategories(response);
        getListingCategories(propertyTypeOption.slug, selectedPurpose, response);
      })
      .catch(() => {
        setPropertySubTypes([]);
      });
  };


  return (
    <form ref={formRef} className="form-post-listing" style={{ height: '80vh', overflowY: 'auto' }}>
      <Card
        bodyStyle={{
          padding: isMobile ? '0 0 20px' : '40px 0',
        }}
        style={{ marginBottom: '20px' }}
      >
        <Group gap={isMobile ? '0px' : '8px'}>
          <CardBlock icon="IconPropertyInfo" title={t('Property Information')}>
            <Group id="specs" gap="32px" style={{ maxWidth: 640 }}>
              <RadioButtons
                name="purpose"
                shape="round"
                key="purpose"
                label={t('Purpose')}
                inputLeftIcon="user"
                labelIcon="IconPurpose"
                value={formik?.values['purpose']}
                handleChange={(e) => {
                  formik.setFieldValue('purpose', e?.target?.value, true);
                  setSelectedPurpose(e?.target?.value)
                }}
                buttonList={adLicenseProducts.map((item) => ({
                  key: item.purpose_id,
                  label: t(item.name.replace('Ad License ', '')),
                  slug: item.name.toLowerCase().replace('ad license ', ''),
                  price: item.price,
                  icon: item.purpose_id === 1 ? 'IconHome' : 'IconRent',
                  RightComponent: PurposeRadioButtonRightComponent,
                }))}
                errorMsg={formik.errors['purpose'] && formik?.touched['purpose'] && formik.errors['purpose']}
              />
              <RadioButtons
                name="property_type"
                shape="round"
                key="purpose"
                label={t('Property Type')}
                inputLeftIcon="user"
                labelIcon="IconPropertyType"
                value={formik?.values['property_type']}
                handleChange={handlePropertyTypeChange}
                buttonList={tenantData.AD_LICENSE_PROPERTY_TYPE_LIST.map((item) => ({ ...item, label: t(item.label) }))}
                errorMsg={
                  formik.errors['property_type'] && formik?.touched['property_type'] && formik.errors['property_type']
                }
              />
              <Select
                name="property_sub_type"
                key="property_sub_type"
                label={t('Property Sub Type')}
                labelIcon="IconPropertySubType"
                placeholder={t('Select Property Sub Type')}
                onChange={(_value, option) => formik.setFieldValue('property_sub_type', option, true)}
                onBlur={() => formik?.setFieldTouched('property_sub_type', true)}
                value={tenantUtils.getLocalisedString(formik?.values?.['property_sub_type'], 'type_title')}
                options={propertySubTypes}
                getOptionLabel={(op) => tenantUtils.getLocalisedString(op, 'type_title')}
                getOptionValue={(op) => op?.type_id}
                disabled={!formik.values.purpose || !formik.values.property_type}
                errorMsg={
                  formik?.errors['property_sub_type'] &&
                  formik?.touched['property_sub_type'] &&
                  formik?.errors['property_sub_type']
                }
              />
              <TextInput
                key="property_ownership_document_number"
                name="property_ownership_document_number"
                label={t('Property Ownership Document Number')}
                labelIcon="IconDocument"
                placeholder={t('Enter 10-20 digit deed number')}
                inputType="number"
                maxLength={20}
                handleChange={(event) => {
                  const value = event.target.value.replace(/\D/g, '').slice(0, 20);
                  formik.setFieldValue('property_ownership_document_number', value, true);
                }}
                handleBlur={(event) => {
                  formik.setFieldTouched('property_ownership_document_number', true);
                  const value = event.target.value.replace(/\D/g, '').slice(0, 20);
                  formik.setFieldValue('property_ownership_document_number', value, true);
                }}
                value={formik?.values['property_ownership_document_number']}
                errorMsg={
                  formik?.errors['property_ownership_document_number'] &&
                  formik?.touched['property_ownership_document_number'] &&
                  formik?.errors['property_ownership_document_number']
                }
              />
              {propertyPermissions.property_age && (
                <Select
                  name="property_age"
                  key="property_age"
                  label={t('Property Age')}
                  labelIcon="IconPropertyAge"
                  placeholder={t('Select Property Age')}
                  onChange={(_value, option) => formik.setFieldValue('property_age', option, true)}
                  onBlur={() => formik?.setFieldTouched('property_age', true)}
                  value={formik?.values?.['property_age']?.title ? t(formik?.values?.['property_age']?.title) : null}
                  options={propertyAges}
                  getOptionLabel={(op) => t(op?.title)}
                  getOptionValue={(op) => op?.id}
                  errorMsg={
                    formik?.errors['property_age'] && formik?.touched['property_age'] && formik?.errors['property_age']
                  }
                />
              )}
              {propertyPermissions.bedrooms && (
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
                  buttonList={tenantData.bedroomsList}
                  errorMsg={formik.errors['bedrooms'] && formik?.touched['bedrooms'] && formik.errors['bedrooms']}
                />
              )}
              {propertyPermissions.area_size && (
                <TextInput
                  key="area_size"
                  name="area_size"
                  label={
                    <>
                      {t('Area Size')} <span className="text-muted fw-500">({t('Sq. M.')})</span>
                    </>
                  }
                  labelIcon={'IconAreaSize'}
                  placeholder={t('Enter Area')}
                  handleBlur={(event) => {
                    formik.setFieldTouched('area_size', true);
                    formik.setFieldValue('area_size', event.target.value, true);
                  }}
                  handleChange={(event) => {
                    formik.setFieldValue('area_size', event.target.value, true);
                  }}
                  value={formik?.values['area_size']}
                  // skeletonLoading={loading}
                  errorMsg={formik?.errors['area_size'] && formik?.touched['area_size'] && formik?.errors['area_size']}
                />
              )}
              <TextInput
                key="price"
                name="price"
                inputType="number"
                label={
                  <>
                    {t('Price of Property')} <>({tenantConstants.CURRENCY_SYMBOL()})</>
                  </>
                }
                labelIcon="IconPriceTag"
                placeholder={t('Enter Price')}
                handleBlur={(event) => {
                  formik.setFieldTouched('price', true);
                  formik.setFieldValue('price', event.target.value, true);
                }}
                handleChange={(event) => {
                  const value = event.target.value.replace(/\D/g, '').slice(0, 20);
                  formik.setFieldValue('price', value, true);
                }}
                value={formik?.values['price']}
                // skeletonLoading={loading}
                errorMsg={formik?.errors['price'] && formik?.touched['price'] && formik?.errors['price']}
                suffix={<span className="color-gray-dark">{tenantConstants.CURRENCY_SYMBOL()}</span>}
                extra={() => {
                  return formik?.values['price'] && !formik?.errors['price'] ? (
                    <PriceCheckValue>
                      <Number
                        type="price"
                        value={formik?.values['price']}
                        tooltip={false}
                        compact={false}
                        className={'text-muted'}
                      />
                    </PriceCheckValue>
                  ) : null;
                }}
              />
            </Group>
          </CardBlock>
          <CardBlock icon="IconLocationPurpose" title={t('Property Location')}>
            <Group id="location" gap="32px" style={{ maxWidth: 640, padding: '20px 0' }}>
              <TenantComponents.LocationSelect
                name="Location_select"
                formik={formik}
                setFieldValue={formik.setFieldValue}
                setFieldTouched={formik.setFieldTouched}
                value={{ location: formik?.values?.['location'], city: formik?.values?.['city'], map: formik?.values?.['location-info']?.['map'] }}
                error={{ location: formik.errors?.['location'], city: formik.errors?.['city'] }}
                touched={{ location: formik.touched?.['location'], city: formik.touched?.['city'] }}
                onBlur={formik.handleBlur}
                item={{ key: 'location-info' }}
                onCityChange={(option) => {
                  formik?.setFieldValue('city', option);
                  formik?.setFieldValue('location', null);
                }}
                onLocationSelect={(option) => {
                  formik?.setFieldValue('location', option);
                }}
                disabled={{}}
                renderCrossCityAlerts={() => {}}
                hideLocation={false}
                user={user}
                showPlot={true}
              />
            </Group>
          </CardBlock>
          <CardBlock icon="IconContactInfo" title={t('Contact Information')}>
            <Group id="contactInfo" gap="32px" style={{ maxWidth: 640 }}>
              <TextInput
                name="name"
                key="name"
                label={t('Name')}
                labelIcon="FiUser"
                placeholder={t('Enter Name')}
                value={user?.name ?? tenantUtils.getLocalisedString(formik?.values['name'], 'name')}
                handleBlur={(event) => {
                  formik.setFieldTouched('name', true);
                  formik.setFieldValue('name', event.target.value, true);
                }}
                handleChange={(event) => {
                  formik.setFieldValue('name', event.target.value, true);
                }}
                errorMsg={formik?.errors['name'] && formik?.touched['name'] && formik?.errors['name']}
                disabled={!!user?.name}
              />

              <Group template="max-content auto" gap="16px">
                <MobileVerification
                  name={`mobile`}
                  placeholder={t('Enter Phone Number')}
                  defaultCountry={tenantConstants.COUNTRY_CODE}
                  value={user?.mobile ?? formik?.values['mobile']}
                  onChange={(value) => {
                    formik.setFieldValue(`mobile`, !!value ? value : '', true);
                  }}
                  errorMsg={formik.errors['mobile'] && formik.touched['mobile'] && formik.errors['mobile']}
                  touched={formik.touched.mobile}
                  onBlur={() => formik.setFieldTouched(`mobile`, true)}
                  label={t('Phone Number')}
                  labelIcon={'MdOutlinePhone'}
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
        </Group>
        <Divider />
        <PostListingAction style={{ paddingInline: isMobile ? '16px' : '64px', alignItems: 'center' }}>
          <Flex
            gap="60px"
            align="center"
            justify={isMobile ? 'space-between' : 'end'}
            className={'w-100'}
            style={{ marginInlineStart: 'auto' }}
          >
            <div>
              <span className="d-block text-muted">{t('Total')}</span>
              <span className={isMobile ? 'fz-12 fw-400 text-primary' : 'fz-14 fw-400 text-primary'}>
                {tenantConstants.CURRENCY_SYMBOL()}
              </span>{' '}
              <span className={isMobile ? 'fz-14 fw-700 text-primary' : 'fz-18 fw-700 text-primary'}>
                {selectedPurposePrice}
              </span>
            </div>
            <Button
              style={{ width: isMobile ? 140 : 200 }}
              type="primary"
              size={isMobile ? 'medium' : 'large'}
              onClick={formik.handleSubmit}
              loading={isSubmitting}
              disabled={isSubmitting || !user?.is_mobile_verified}
            >
              {t('Continue')}
            </Button>
          </Flex>
        </PostListingAction>
      </Card>
    </form>
  );
};

export default CreateAdLicense;
