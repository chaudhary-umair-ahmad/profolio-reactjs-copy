import tenantData from '@data';
import tenantRoutes from '@routes';
import tenantUtils from '@utils';
import tenantConstants from '@constants';
import { Col, Row, Space, Spin, Typography, Flex } from 'antd';
import { useFormik } from 'formik';
import React, { Fragment, useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  Alert,
  Button,
  Checkbox,
  ConfirmationModal,
  DataTable,
  Group,
  Icon,
  Label,
  Number,
  PhoneInput,
  Popover,
  RadioButtons,
  Select,
  Skeleton,
  Switch,
  Tag,
  TextInput,
  TextInputWithUnit,
  TextWithIcon,
  notification,
} from '../../../../components/common';
import { IconStyled } from '../../../../components/common/icon/IconStyled';
import { AddAmenities, ImageSelect, VideoSelect } from '../../../../components/post-listing';
import { IconZoneFactor } from '../../../../components/svg';
import { PERMISSIONS_TYPE } from '../../../../constants/permissions';
import { useRouteNavigate, useScrollToFieldForm, useScrollToPageSection } from '../../../../hooks';
import Algolia from '../../../../services/algolia';
import LocationSelect from './location-select/location-select';
import { BlockTitle, CardListing, CheckboxPlatforms, PriceCheckValue, PriceCheckWrapper } from './styled';
import { imageUploadSuccessEvent } from '../../../../services/analyticsService';
import { setUsersList } from '../../../../store/appSlice';
import {
  useLazyFetchCrossCityDetailQuery,
  useLazyGetPriceCheckQuery,
  usePostNewListingMutation,
  useUpdateListingMutation,
} from '../../../../apis/postlisting';
import { useLazyGetQuotaDeductionApiQuery } from '../../../../apis/quotaCredits';
import { getBaseURL } from '../../../../utility/env';

const quotaColumns = [
  { title: 'Quota Available', dataIndex: 'quota_available', key: 'quota_available' },
  { title: 'Quota Required', dataIndex: 'quota_used', key: 'quota_used' },
];

const PostListing = (props) => {
  const { formData = {}, loading, isMobile, forUpdate } = props;
  const { user } = useSelector((state) => state.app.loginUser);

  const users = useSelector((state) => state.app.userGroup.list);
  const newAgencyDetails = useSelector((state) => state.app.userGroup.list);
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [priceCheckError, setPriceCheckError] = useState('');
  const [crossCityData, setCrossCityData] = useState(null);
  const [availableQuota, setAvailableQuota] = useState(null);
  const [quotaFetchError, setQuotaFetchError] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const factorModalRef = useRef();
  const formikRef = useRef();
  const navigate = useRouteNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [getPriceCheck, { isLoading: priceCheckLoading, isFetching: priceCheckFetching }] = useLazyGetPriceCheckQuery();
  const [getQuotaDeductionApi] = useLazyGetQuotaDeductionApiQuery();
  const [fetchCrossCityDetail] = useLazyFetchCrossCityDetailQuery();
  const [updateListing] = useUpdateListingMutation();

  const onSubmit = async (values, { setSubmitting, ...rest }) => {
    setSubmitting(true);
    setSubmitLoading(true);
    if (formData?.listing) {
      postListing(values, { setSubmitting, ...rest }, formData?.listing?.id);
    } else {
      if (!!availableQuota) {
        if (quotaFetchError) {
          setSubmitting(false);
          setSubmitLoading(false);
          rest.setStatus(quotaDeductionResponse.error);
        } else {
          let showConfirmModal = false;
          const selectedPlatforms = Object.keys(values?.platform_selection || {}).filter(
            (e) => !!values.platform_selection[e]?.checked,
          );
          selectedPlatforms.forEach((e) => {
            if (
              e === 'zameen' &&
              availableQuota?.[e]?.available &&
              availableQuota?.[e]?.required &&
              availableQuota?.[e]?.available >= availableQuota?.[e]?.required &&
              availableQuota?.[e]?.isZoneArea
            ) {
              showConfirmModal = true;
            } else {
              if (e === 'olx' && !!availableQuota?.[e] && !!availableQuota?.[e]?.isZoneArea) {
                showConfirmModal = true;
              }
            }
          });
          if (showConfirmModal) {
            factorModalRef?.current && factorModalRef.current.showModal();
          } else {
            postListing(values, { setSubmitting, ...rest });
          }
        }
      }
    }
  };

  const formik = useFormik({
    initialValues: tenantData.getPostListingInitialValues(
      formData?.listing,
      user?.permissions?.[PERMISSIONS_TYPE?.LISTINGS],
      user,
    ),
    validationSchema: tenantData.getPostListingValidationSchema(formData?.listing),
    validateOnChange: false,
    onSubmit: onSubmit,
    innerRef: formikRef,
  });

  useEffect(() => {
    user?.permissions?.[PERMISSIONS_TYPE.LISTINGS] && !users?.length && setUsersList();
  }, [user, formik?.values?.posting_as]);

  useEffect(() => {
    formik &&
      formData.listing &&
      formik.setValues(
        tenantData.getPostListingInitialValues(
          formData.listing,
          user?.permissions?.[PERMISSIONS_TYPE.LISTINGS],
          user,
          newAgencyDetails,
        ),
      );
  }, [formData.listing, newAgencyDetails]);

  useEffect(() => {
    !!formik &&
      formik?.values?.location_select?.location &&
      getAvailableQuota(formik?.values?.location_select?.location);
  }, [formik?.values?.posting_as, formik?.values?.location_select]);

  useScrollToFieldForm(formik);
  const [postNewListing, _] = usePostNewListingMutation();

  const postListing = async (values, { setSubmitting, setStatus }, listingId) => {
    factorModalRef.current && factorModalRef.current.setLoading(true);
    const response = await (listingId
      ? updateListing({
        user: values?.posting_as?.id ? values.posting_as : user,
        listingId,
        values,
        listing: formData?.listing,
      })
      : postNewListing({ user: values?.posting_as?.id ? values.posting_as : user, values: values }));
    if (response) {
      factorModalRef.current && factorModalRef.current.setLoading(false);
      setSubmitting(false);
      setSubmitLoading(false);
      if (response.error) {
        setStatus(response?.error?.errorMessage);
        notification.error(response?.error);
      } else {
        factorModalRef.current && factorModalRef.current.hideModal();
        if (listingId) {
          notification.success(t('Updated Successfully'));
          navigate(tenantRoutes.app().listings.path);
        } else {
          let selectedPlatforms = {};
          Object.keys(formik.values.platform_selection).forEach((key) => {
            if (formik.values.platform_selection[key]) {
              selectedPlatforms = { ...selectedPlatforms, [key]: true };
            }
          });
          if (!response?.data?.listing?.id) {
            navigate(tenantRoutes.app().listings.path);
          } else {
            navigate(`${tenantRoutes.app().post_listing.path}/${response.data.listing.id}/upgrade`, {
              selectedPlatforms: selectedPlatforms,
            });
          }
        }
      }
    }
  };

  const fetchProjects = async () => {
    //    TODO: to enabled
    setProjectsLoading(true);
    let queryObj = {
      filters: `${user?.agency?.id ? `developer=${user?.agency?.id}` : ''}`,
      facets: ['dev_status'],
      facetFilters: ['dev_status:on'],
      hitsPerPage: 100,
    };
    const res = await Algolia.getProjectsIndex().search('', queryObj);
    if (res) {
      setProjectsLoading(false);
      if (res?.error) {
      } else {
        const projects = res?.hits?.length
          ? res?.hits?.map((e) => ({ ...e, title: e?.dev_title?.en, id: e?.dev_id }))
          : [];
        setProjects(projects);
      }
    }
  };

  const fetchCrossCityData = async (id, cityId) => {
    const response = await fetchCrossCityDetail({ id, cityId });
    if (response) {
      if (response.error) {
        notification.error(`${t('Cross City Error:')} ${response.error}`);
      } else {
        setCrossCityData(response?.data);
      }
    }
  };

  const priceCheck = async () => {
    const values = formik.values;
    if (
      !!values.location_select?.location &&
      !formik.errors.location_select?.location &&
      !!values.area?.unit &&
      !!values.area?.value &&
      !formik.errors.area &&
      (formik.values.purpose == 1
        ? !!values.price?.value && !formik.errors.price
        : values.monthly_rent?.value && !formik.errors?.monthly_rent)
    ) {
      const response = await getPriceCheck({
        price: values?.monthly_rent.value ? values?.monthly_rent?.value : values.price.value,
        purpose: values?.purpose,
        area: values?.area,
        propertyType: values?.property_type,
        locationSelect: values?.location_select?.location?.location_id,
      });
      if (response) {
        if (!!response?.data?.price_check) {
          setPriceCheckError({
            message: response.data.price_check.message,
            pct_classification: response.data.price_check.classification,
            status: response?.data?.price_check?.status,
          });
        } else {
          setPriceCheckError(response?.data?.data.price_check);
        }
      }
    }
  };

  useEffect(() => {
    priceCheck();
  }, [
    formik.values.location_select?.location,
    formik.errors?.location_select?.location,
    formik.values.area?.unit,
    formik.values.area?.value,
    formik.errors?.area,
    formik.values.price?.value,
    formik.errors?.price,
    formik.values.monthly_rent?.value,
    formik.errors?.monthly_rent,
  ]);

  const setAreaUnit = useCallback(
    (slug) => {
      if (!formik.values.area.value) {
        const unit = tenantData.areaUnitList.find((e) =>
          slug ? e.slug === slug : e.slug == user?.settings?.find((it) => it.slug === 'area_unit')?.value,
        )?.id;
        formik.setFieldValue('area', { ...formik.values.area, unit });
      }
    },
    [formik.values.area.value],
  );

  const setFormToInitials = (obj) => {
    formik.setValues(
      {
        ...tenantData.getPostListingInitialValues(null, user?.permissions?.[PERMISSIONS_TYPE?.LISTINGS], user),
        ...obj,
      },
      false,
    );
  };

  const setAreaUnitOnType = (propertyType) => {
    if (!formik.values.area.value) {
      let selectedProperty;
      tenantData.listingTypes().some((type) => {
        type.sub_types.some((sType) => {
          if (sType.id == propertyType) {
            selectedProperty = sType;
            return sType.id == propertyType;
          }
        });
        if (!!selectedProperty) {
          return true;
        }
      });
      let unit = selectedProperty.slug_area_unit;
      if (formik.values.location_select?.location?.label == 'Karachi' && unit == tenantData.AREA_UNIT.MARLA) {
        unit = tenantData.AREA_UNIT.SQUARE_YARD;
      }
      formik.setFieldValue('area', {
        ...formik.values.area,
        unit: tenantData.areaUnitList.find((e) => e.slug === unit)?.id,
      });
    }
  };

  const onCityChange = (city) => {
    if (city.label === 'Karachi') {
      formik.values?.['property_type'] == 8
        ? setAreaUnit(tenantData.AREA_UNIT.SQUARE_FEET)
        : setAreaUnit(tenantData.AREA_UNIT.SQUARE_YARD);
    } else {
      setAreaUnitOnType(formik?.values['property_type']);
    }
    if (city?.city_id) {
      if (!forUpdate) {
          fetchCrossCityData(formik?.values?.posting_as?.id ? formik?.values?.posting_as?.id : user?.id, city?.city_id);
      }
    }
  };

  const onPlotSelect = (plot) => {
    if (plot) {
      const area = {
        value: plot.area.substring(0, plot.area.indexOf(' ')),
        unit: tenantData.areaUnitList.find((e) => e.title_short == plot.area.substring(plot.area.indexOf(' ') + 1))?.id,
      };
      formik.setFieldValue('area', area);
    }
  };

  const onChangePurpose = (e) => {
    formik.handleChange(e);
    setFormToInitials({ purpose: e.target.value });
  };

  const onChangeType = (value) => {
    setFormToInitials({ purpose: formik.values.purpose, property_type: value });
    setAreaUnitOnType(value);
  };

  const onUserChange = (value, option) => {
    formik?.setFieldValue('posting_as', option);

    formik.setFieldValue('email', !!option?.email ? option?.email : '');
    formik.setFieldValue('landline', !!option?.phone ? tenantUtils.formatMobile(option?.phone, 'singleNumber') : '');
    formik.setFieldValue(
      'mobile',
      !!option?.mobile ? tenantUtils.formatMobile(option?.mobile, 'multipleNumbers') : [''],
    );
  };

  const getPropertyTypeList = useCallback(() => {
    return tenantData.listingTypes(formik.values.purpose == 2 ? [23, 26] : []).map((data) => ({
      tabKey: data.id,
      tabTitle: data.title,
      id: data.id,
      buttonList: data.sub_types.map((e) => ({ ...e, id: e.id, label: e.title })),
    }));
  }, [formik.values.purpose]);

  const findParentPropertyTypeId = useCallback(
    (propertyId) => {
      const parentProperty = tenantData
        .listingTypes(formik.values.purpose == 2 ? [23, 26] : [])
        .find((parentProperty) => {
          return parentProperty.sub_types.find((e) => e.id === propertyId);
        });
      return parentProperty ? parentProperty.id.toString() : '';
    },
    [formik.values.purpose, formik.values.property_type],
  );

  const getPlatformList = () => {
    if (!!crossCityData) {
      return tenantData.platformList.filter((e) => crossCityData?.[e?.slug]?.mapped);
    } else {
      return tenantData.platformList.filter((e) => e?.slug === 'zameen');
    }
  };

  const getCrossCityEnable = (platform) => {
    if (crossCityData) {
      return (
        !!crossCityData?.[platform]?.restricted &&
        !!formik.values.location_select?.city &&
        !crossCityData.assigned_cities.find((e) => e === formik.values.location_select?.city?.location_id)
      );
    }
  };

  useEffect(() => {
    if (!formData?.listing) {
      if (!!availableQuota) {
        formik?.setFieldValue('platform_selection', {
          zameen: {
            checked: !!getCrossCityEnable('zameen') ? false : true,
            disabled: !!getCrossCityEnable('zameen') ? true : false,
          },
          olx: {
            checked: !!getCrossCityEnable('olx')
              ? false
              : !availableQuota?.['olx']?.available
                ? false
                : !!(availableQuota?.['olx']?.available >= availableQuota?.['olx']?.required),
            disabled: !!getCrossCityEnable('olx')
              ? true
              : !availableQuota?.['olx']?.available
                ? true
                : !!(availableQuota?.['olx']?.available < availableQuota?.['olx']?.required),
          },
        });
      } else {
        formik?.setFieldValue('platform_selection', {
          zameen: {
            checked: !crossCityData ? true : getCrossCityEnable('zameen') ? false : true,
            disabled: !crossCityData ? false : getCrossCityEnable('zameen') ? true : false,
          },
          olx: {
            checked: false,
            disabled: true,
          },
        });
      }
    } else {
      formik?.setFieldValue('platform_selection', {
        ...(availableQuota?.zameen && {
          zameen: {
            checked: formData?.listing?.platform?.['zameen'],
            disabled: true,
          },
        }),
        ...(availableQuota?.olx && {
          olx: {
            checked: formData?.listing?.platform?.['olx'],
            disabled: true,
          },
        }),
      });
    }
  }, [formik?.values?.location_select, formik?.values?.posting_as, availableQuota, crossCityData]);

  useScrollToPageSection();

  const onImageUpload = (response) => {
    imageUploadSuccessEvent(user, response, !forUpdate, formik.values);
  };

  const renderCrossCityAlerts = useCallback(() => {
    return tenantData.platformList.map(({ key: platform }) => {
      return !!getCrossCityEnable(platform) ? (
        <div style={{ marginTop: '8px', maxWidth: 640 }}>
          <Alert
            type="warning"
            showIcon
            icon={<Icon icon={`Icon${platform === 'zameen' ? 'Zameen' : 'OLX'}`} size={25} />}
            message={
              <div className="color-gray-light" style={{ fontSize: 13 }}>
                {t('Cross-City limit has been reached. Please post ads in your designated city.')}
              </div>
            }
            action={<Icon icon="AiFillInfoCircle" size={15} color="#FA8B0C" />}
            key={platform}
          />
        </div>
      ) : null;
    });
  }, [crossCityData, availableQuota, formik?.values?.location_select?.city]);

  const renderForDeveloper = () => {
    return (
      user?.agency?.entity_type == 'dev_agency' && (
        <div style={{ maxWidth: 640 }}>
          <Group>
            {!!!formData.listing && (
              <Switch
                value={formik.values.project_selection}
                onChange={(checked) => {
                  !projects?.length && checked && fetchProjects();
                  formik.setFieldValue('project_selection', checked);
                }}
                label={t('Listing is for project')}
                labelIcon="IconInstAvb"
                desc={t('Enable if this listing is for project')}
              />
            )}
            {formik.values.project_selection && !formData?.listing ? (
              <Select
                name="project"
                value={formik.values.project?.id}
                placeholder={t('Select Project')}
                options={projects}
                onChange={(value, option) => formik.setFieldValue('project', option)}
                getOptionValue={(e) => e.id}
                getOptionLabel={(e) => e.title}
                loading={projectsLoading}
                label={t('Project')}
                labelIcon="MdMail"
              />
            ) : (
              !!(formData?.listing && formData?.listing?.project?.title) && (
                <Group gap="32px" template="1fr">
                  <Group template="max-content auto" gap="16px">
                    <IconStyled>
                      <Icon icon="MdMail" />
                    </IconStyled>
                    <Group template="initial" gap="8px">
                      <Label>{t('Project')}</Label>
                      <div>
                        <Tag shape="round" bordered disabled>
                          {formData?.listing?.project?.title}
                        </Tag>
                      </div>
                    </Group>
                  </Group>
                </Group>
              )
            )}
          </Group>
        </div>
      )
    );
  };

  const getAvailableQuota = async (location) => {
    const response = await getQuotaDeductionApi({
      subject_id: !!formik.values?.posting_as?.id ? formik.values?.posting_as?.id : user?.id,
      location_id: location?.location_id,
    });
    if (response) {
      if (response.error) {
        setQuotaFetchError(true);
      } else {
        setAvailableQuota(response?.data);
      }
    }
  };

  return !!loading ? (
    <PostListingSkeleton />
  ) : (
    <>
      {!isMobile && (
        <div className="mb-32">
          <img
            src={`${getBaseURL()}/profolio-assets/images/header-add-property.png`}
            alt=""
            style={{ maxWidth: '100%', boxShadow: '0 4px 20px #9299B813' }}
          />
        </div>
      )}
      <form className="form-post-listing">
        <Group>
          <CardBlock icon="IconLocationPurpose" title={t('Location and Purpose')}>
            <Group id="location" gap="32px">
              <RadioButtons
                name="purpose"
                shape="round"
                key="purpose"
                label={t('Select Purpose')}
                labelIcon="MdOutlineCheckCircle"
                valueKey="id"
                buttonList={tenantData.purposeList}
                value={formik?.values['purpose']}
                handleChange={onChangePurpose}
                disabled={!!formData.listing}
                errorMsg={formik.errors['purpose'] && formik.touched['purpose'] && formik.errors['purpose']}
              />
              <div style={{ maxWidth: 640 }}>
                <RadioButtons
                  tabStyle={{ gap: isMobile && '8px' }}
                  name="property_type"
                  key="property_type"
                  shape="round"
                  valueKey="id"
                  label={t('Select Property Type')}
                  labelIcon="BiBuildingHouse"
                  isTabbed
                  value={formik?.values['property_type']}
                  onTabChange={(option) => {
                    formik.setFieldValue('property_type', option.buttonList[0].id);
                    onChangeType(option.buttonList[0].id);
                  }}
                  handleChange={(e) => {
                    formik.handleChange(e);
                    onChangeType(e.target.value);
                  }}
                  activeKey={findParentPropertyTypeId(formik?.values['property_type'])}
                  disabled={!!formData.listing}
                  errorMsg={
                    formik.errors['property_type'] && formik.touched['property_type'] && formik.errors['property_type']
                  }
                  options={getPropertyTypeList()}
                />
              </div>
              {renderForDeveloper()}
              <div style={{ maxWidth: 640 }}>
                <LocationSelect
                  name="location_select"
                  formik={formik}
                  setFieldValue={formik.setFieldValue}
                  setFieldTouched={formik.setFieldTouched}
                  value={formik.values?.['location_select']}
                  error={formik.errors?.['location_select']}
                  touched={formik.touched?.['location_select']}
                  onBlur={formik.handleBlur}
                  item={{ key: 'location_select' }}
                  onCityChange={onCityChange}
                  showPlot={!tenantData.skipFieldsForField?.['plot'].property_type[formik.values['property_type']]}
                  disabled={!!formData.listing}
                  forUpdate={!!formData.listing}
                  crossCity={crossCityData}
                  onPlotSelect={onPlotSelect}
                  renderCrossCityAlerts={renderCrossCityAlerts}
                  onLocationSelect={() => {}}
                  user={user}
                  propertyType={formik.values['property_type']}
                />
              </div>
            </Group>
          </CardBlock>
          <CardBlock icon="IconPriceArea" title={t('Price and Area')}>
            <Group id="specs" gap="32px" style={{ maxWidth: 640 }}>
              <TextInputWithUnit
                key="area"
                name="area"
                label={t('Area Size')}
                labelIcon="IconAreaSize"
                value={formik?.values['area']?.value}
                placeholder={t('Enter Unit')}
                useInternalState
                skeletonLoading={loading}
                unitValue={formik?.values['area']?.unit}
                errorMsg={formik.errors['area'] && formik.touched['area'] && formik.errors['area']}
                unitList={tenantData.areaUnitList}
                disabled={!!formik.values.location_select?.plot}
                selectProps={{ getOptionLabel: (e) => t(e.title_short) }}
                type="number"
                // onInputChange={value => {
                //   formik.values['area'] = { ...formik.values['area'], value };
                //   formik.setFieldValue('area', formik?.values['area']);
                // }}
                onUnitChange={(unit, option) => {
                  formik.values['area'] = { ...formik.values['area'], unit };
                  formik.setFieldValue('area', formik?.values['area']);
                }}
                onInputBlur={(event) => {
                  formik.values['area'] = { ...formik.values['area'], value: event.target.value };
                  formik.setFieldValue('area', formik?.values['area'], true);
                  formik.setFieldTouched('area', true);
                }}
              />
              {formik?.values['purpose'] == 1 && (
                <TextInputWithUnit
                  key="price"
                  name="price"
                  label={t('Price')}
                  labelIcon="RiPriceTag3Line"
                  placeholder={t('Enter Price')}
                  useInternalState
                  value={formik?.values['price']?.value}
                  unitValue={formik?.values['price']?.unit}
                  skeletonLoading={loading}
                  unitList={tenantData.currencyList}
                  type="number"
                  // onInputChange={value => {
                  //   formik.values['price'] = { ...formik.values['price'], value };
                  //   formik.setFieldValue('price', formik?.values['price']);
                  // }}
                  onUnitChange={(unit) => {
                    formik.values['price'] = { ...formik.values['price'], unit };
                    formik.setFieldValue('price', formik?.values['price']);
                  }}
                  errorMsg={
                    formik.values.price.value &&
                    formik.errors['price'] &&
                    formik.touched['price'] &&
                    formik.errors['price']
                  }
                  onInputBlur={(event) => {
                    formik.values['price'] = { ...formik.values['price'], value: event.target.value };
                    formik.setFieldValue('price', formik?.values['price'], true);
                    formik.setFieldTouched('price', true);
                  }}
                  bottomRightContent={() => (
                    <PriceCheck
                      error={priceCheckError}
                      loading={priceCheckLoading || priceCheckFetching}
                      price={formik.values.price?.value}
                    />
                  )}
                  bottomLeftContent={(val) =>
                    val ? (
                      <PriceCheckValue>
                        <Number type="price" value={val} typoOptions={{ disabled: true }} tooltip={false} />
                      </PriceCheckValue>
                    ) : (
                      <Typography.Text type="danger">
                        <small>{formik.errors['price'] && formik.touched['price'] && formik.errors['price']}</small>
                      </Typography.Text>
                    )
                  }
                />
              )}
              {formik?.values['purpose'] == 2 && (
                <TextInputWithUnit
                  key="monthly_rent"
                  name="monthly_rent"
                  label={t('Monthly Rent')}
                  labelIcon="RiPriceTag3Line"
                  placeholder={t('Enter Price')}
                  useInternalState
                  value={formik?.values['monthly_rent']?.value}
                  unitValue={formik?.values['monthly_rent']?.unit}
                  skeletonLoading={loading}
                  unitList={tenantData.currencyList}
                  type="number"
                  // onInputChange={value => {
                  //   formik.values['monthly_rent'] = { ...formik.values['monthly_rent'], value };
                  //   formik.setFieldValue('monthly_rent', formik?.values['monthly_rent']);
                  // }}
                  onUnitChange={(unit) => {
                    formik.values['monthly_rent'] = { ...formik.values['monthly_rent'], unit };
                    formik.setFieldValue('monthly_rent', formik?.values['monthly_rent']);
                  }}
                  errorMsg={
                    formik.values.monthly_rent.value &&
                    formik.errors['monthly_rent'] &&
                    formik.touched['monthly_rent'] &&
                    formik.errors['monthly_rent']
                  }
                  onInputBlur={(event) => {
                    formik.values['monthly_rent'] = { ...formik.values['monthly_rent'], value: event.target.value };
                    formik.setFieldValue('monthly_rent', formik?.values['monthly_rent'], true);
                    formik.setFieldTouched('monthly_rent', true);
                  }}
                  bottomRightContent={() => (
                    <PriceCheck
                      error={priceCheckError}
                      loading={priceCheckLoading || priceCheckFetching}
                      price={formik.values.price?.value}
                    />
                  )}
                  bottomLeftContent={(val) =>
                    val ? (
                      <PriceCheckValue>
                        <Number type="price" value={val} tooltip={false} />
                      </PriceCheckValue>
                    ) : (
                      <Typography.Text type="danger">
                        <small>
                          {formik.errors['monthly_rent'] &&
                            formik.touched['monthly_rent'] &&
                            formik.errors['monthly_rent']}
                        </small>
                      </Typography.Text>
                    )
                  }
                />
              )}
              {formik?.values['purpose'] == 1 && (
                <Switch
                  key="installment_available"
                  label={t('Installment available')}
                  labelIcon="IconInstAvb"
                  desc={t('Enable if listing is available on installments')}
                  value={formik?.values['installment_available']}
                  onChange={(checked) => {
                    formik?.setFieldValue('installment_available', checked);
                    if (!checked) {
                      formik?.setFieldValue('balloon_payments_enabled', false);
                      formik?.setFieldValue('amount_per_balloon_payment', undefined);
                      formik?.setFieldValue('num_balloon_payments', '');
                      formik?.setFieldValue('balloting_fee_enabled', false);
                      formik?.setFieldValue('balloting_fee', { value: undefined });
                      formik?.setFieldValue('possession_fee_enabled', false);
                      formik?.setFieldValue('possession_fee', { value: undefined });
                      formik?.setFieldValue('development_fee_enabled', false);
                      formik?.setFieldValue('development_fee', { value: undefined });
                    }
                  }}
                  onBlur={() => formik?.setFieldTouched('installment_available', true)}
                />
              )}
              {formik?.values['purpose'] == 1 && formik?.values['installment_available'] && (
                <>
                  <TextInputWithUnit
                    key="advance_amount"
                    name="advance_amount"
                    value={formik?.values['advance_amount']?.value}
                    label={t('Advance Amount')}
                    labelIcon="IconAdvAmount"
                    placeholder={t('Enter Amount')}
                    useInternalState
                    unitValue={formik?.values['advance_amount']?.unit}
                    skeletonLoading={loading}
                    type="number"
                    // onInputChange={value => {
                    //   formik.values['advance_amount'] = { ...formik.values['advance_amount'], value };
                    //   formik.setFieldValue('advance_amount', formik?.values['advance_amount']);
                    // }}
                    onInputBlur={(event) => {
                      formik.values['advance_amount'] = {
                        ...formik.values['advance_amount'],
                        value: event.target.value,
                      };
                      formik.setFieldValue('advance_amount', formik?.values['advance_amount'], true);
                      formik.setFieldTouched('advance_amount', true);
                    }}
                    onUnitChange={(unit) => {
                      formik.values['advance_amount'] = { ...formik.values['advance_amount'], unit };
                      formik.setFieldValue('advance_amount', formik?.values['advance_amount']);
                    }}
                    errorMsg={
                      formik.values.advance_amount.value &&
                      formik.errors['advance_amount'] &&
                      formik.touched['advance_amount'] &&
                      formik.errors['advance_amount']
                    }
                    unitList={tenantData.currencyList}
                    bottomLeftContent={(val) =>
                      val ? (
                        <PriceCheckValue>
                          <Number type="price" value={val} typoOptions={{ disabled: true }} tooltip={false} />
                        </PriceCheckValue>
                      ) : (
                        <Typography.Text type="danger">
                          <small>
                            {formik.errors['advance_amount'] &&
                              formik.touched['advance_amount'] &&
                              formik.errors['advance_amount']}
                          </small>
                        </Typography.Text>
                      )
                    }
                  />
                  <TextInput
                    key="no_of_installments"
                    name="no_of_installments"
                    label={t('No of Installments')}
                    labelIcon="RiCalendar2Fill"
                    placeholder={t('Enter Number')}
                    useInternalState
                    // handleChange={formik?.handleChange}
                    handleBlur={(event) => {
                      formik.setFieldTouched('no_of_installments', true);
                      formik.setFieldValue('no_of_installments', event.target.value, true);
                    }}
                    value={formik?.values['no_of_installments']}
                    skeletonLoading={loading}
                    errorMsg={
                      formik?.errors['no_of_installments'] &&
                      formik?.touched['no_of_installments'] &&
                      formik?.errors['no_of_installments']
                    }
                  />
                  <TextInputWithUnit
                    key="monthly_installment"
                    name="monthly_installment"
                    label={t('Monthly Installments')}
                    labelIcon="IconMonthlyInstal"
                    placeholder={t('Enter Amount')}
                    useInternalState
                    value={formik?.values['monthly_installment']?.value}
                    unitValue={formik?.values['monthly_installment']?.unit}
                    skeletonLoading={loading}
                    type="number"
                    // onInputChange={value => {
                    //   formik.values['monthly_installment'] = { ...formik.values['monthly_installment'], value };
                    //   formik.setFieldValue('monthly_installment', formik?.values['monthly_installment']);
                    // }}
                    onInputBlur={(event) => {
                      formik.values['monthly_installment'] = {
                        ...formik.values['monthly_installment'],
                        value: event.target.value,
                      };
                      formik.setFieldValue('monthly_installment', formik?.values['monthly_installment'], true);
                      formik.setFieldTouched('monthly_installment', true);
                    }}
                    onUnitChange={(unit) => {
                      formik.values['monthly_installment'] = { ...formik.values['monthly_installment'], unit };
                      formik.setFieldValue('monthly_installment', formik?.values['monthly_installment']);
                    }}
                    errorMsg={
                      formik.values.monthly_installment.value &&
                      formik.errors['monthly_installment'] &&
                      formik.touched['monthly_installment'] &&
                      formik.errors['monthly_installment']
                    }
                    unitList={tenantData.currencyList}
                    bottomLeftContent={(val) =>
                      val ? (
                        <PriceCheckValue>
                          <Number type="price" value={val} typoOptions={{ disabled: true }} tooltip={false} />
                        </PriceCheckValue>
                      ) : (
                        <Typography.Text type="danger">
                          <small>
                            {formik.errors['monthly_installment'] &&
                              formik.touched['monthly_installment'] &&
                              formik.errors['monthly_installment']}
                          </small>
                        </Typography.Text>
                      )
                    }
                  />
                  <Switch
                    key="balloon_payments_enabled"
                    label={t('Balloon Payment Available')}
                    labelIcon="TbCoins"
                    desc={t('Enable if Applicable')}
                    value={formik?.values['balloon_payments_enabled']}
                    onChange={(checked) => {
                      formik?.setFieldValue('balloon_payments_enabled', checked);
                      if (!checked) {
                        formik?.setFieldValue('amount_per_balloon_payment', undefined);
                        formik?.setFieldValue('num_balloon_payments', '');
                      }
                    }}
                    onBlur={() => formik?.setFieldTouched('balloon_payments_enabled', true)}
                  />
                  <Group template="repeat(2, minmax(0, 1fr))" gap="32px">
                    {formik?.values['balloon_payments_enabled'] && (
                      <>
                        <div style={{ display: 'flex', flexDirection: 'column', height: 'auto' }}>
                          <TextInput
                            key="amount_per_balloon_payment"
                            name="amount_per_balloon_payment"
                            value={formik?.values['amount_per_balloon_payment']}
                            label={t('Balloon Amount')}
                            labelIcon="RiPriceTag3Line"
                            placeholder={t('Enter Amount in PKR')}
                            useInternalState
                            skeletonLoading={loading}
                            type="number"
                            handleBlur={(event) => {
                              formik.setFieldTouched('amount_per_balloon_payment', true);
                              formik.setFieldValue('amount_per_balloon_payment', event.target.value, true);
                            }}
                            errorMsg={
                              formik.touched['amount_per_balloon_payment'] &&
                              formik.errors['amount_per_balloon_payment']
                            }
                          />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', height: 'auto' }}>
                          <TextInput
                            key="num_balloon_payments"
                            name="num_balloon_payments"
                            label={t('No. of Balloon Payments')}
                            labelIcon="PiChartBar"
                            placeholder={t('Enter Number')}
                            useInternalState
                            handleBlur={(event) => {
                              formik.setFieldTouched('num_balloon_payments', true);
                              formik.setFieldValue('num_balloon_payments', event.target.value, true);
                            }}
                            value={formik?.values['num_balloon_payments']}
                            skeletonLoading={loading}
                            errorMsg={
                              formik?.errors['num_balloon_payments'] &&
                              formik?.touched['num_balloon_payments'] &&
                              formik?.errors['num_balloon_payments']
                            }
                          />
                        </div>
                      </>
                    )}

                    <Switch
                      key="balloting_fee_enabled"
                      label={t('Balloting Fee')}
                      labelIcon="TbCoins"
                      desc={t('Enable If Applicable')}
                      value={formik?.values['balloting_fee_enabled']}
                      onChange={(checked) => {
                        formik?.setFieldValue('balloting_fee_enabled', checked);
                        if (!checked) {
                          formik?.setFieldValue('balloting_fee', { value: undefined });
                        }
                      }}
                      onBlur={() => formik?.setFieldTouched('balloting_fee_enabled', true)}
                    />
                    <TextInput
                      key="balloting_fee"
                      name="balloting_fee"
                      value={formik?.values['balloting_fee']?.value}
                      label={t('Amount')}
                      labelIcon="RiPriceTag3Line"
                      placeholder={t('Enter Amount in PKR')}
                      useInternalState
                      skeletonLoading={loading}
                      type="number"
                      disabled={!formik?.values['balloting_fee_enabled']}
                      handleBlur={(event) => {
                        if (formik?.values['balloting_fee_enabled']) {
                          formik.values['balloting_fee'] = {
                            ...formik.values['balloting_fee'],
                            value: event.target.value,
                          };
                          formik.setFieldValue('balloting_fee', formik?.values['balloting_fee'], true);
                          formik.setFieldTouched('balloting_fee', true);
                        }
                      }}
                      errorMsg={
                        formik.values.balloting_fee.value &&
                        formik.errors['balloting_fee'] &&
                        formik.touched['balloting_fee'] &&
                        formik.errors['balloting_fee']
                      }
                    />

                    <Switch
                      key="possession_fee_enabled"
                      label={t('Possession Fee')}
                      labelIcon="TbCoins"
                      desc={t('Enable If Applicable')}
                      value={formik?.values['possession_fee_enabled']}
                      onChange={(checked) => {
                        formik?.setFieldValue('possession_fee_enabled', checked);
                        if (!checked) {
                          formik?.setFieldValue('possession_fee', { value: undefined });
                        }
                      }}
                      onBlur={() => formik?.setFieldTouched('possession_fee_enabled', true)}
                    />
                    <TextInput
                      key="possession_fee"
                      name="possession_fee"
                      value={formik?.values['possession_fee']?.value}
                      label={t('Amount')}
                      labelIcon="RiPriceTag3Line"
                      placeholder={t('Enter Amount in PKR')}
                      useInternalState
                      skeletonLoading={loading}
                      type="number"
                      disabled={!formik?.values['possession_fee_enabled']}
                      handleBlur={(event) => {
                        if (formik?.values['possession_fee_enabled']) {
                          formik.values['possession_fee'] = {
                            ...formik.values['possession_fee'],
                            value: event.target.value,
                          };
                          formik.setFieldValue('possession_fee', formik?.values['possession_fee'], true);
                          formik.setFieldTouched('possession_fee', true);
                        }
                      }}
                      errorMsg={
                        formik.values.possession_fee.value &&
                        formik.errors['possession_fee'] &&
                        formik.touched['possession_fee'] &&
                        formik.errors['possession_fee']
                      }
                    />

                    <Switch
                      key="development_fee_enabled"
                      label={t('Development Fee')}
                      labelIcon="TbCoins"
                      desc={t('Enable If Applicable')}
                      value={formik?.values['development_fee_enabled']}
                      onChange={(checked) => {
                        formik?.setFieldValue('development_fee_enabled', checked);
                        if (!checked) {
                          formik?.setFieldValue('development_fee', { value: undefined });
                        }
                      }}
                      onBlur={() => formik?.setFieldTouched('development_fee_enabled', true)}
                    />
                    <TextInput
                      key="development_fee"
                      name="development_fee"
                      value={formik?.values['development_fee']?.value}
                      label={t('Amount')}
                      labelIcon="RiPriceTag3Line"
                      placeholder={t('Enter Amount in PKR')}
                      useInternalState
                      skeletonLoading={loading}
                      type="number"
                      disabled={!formik?.values['development_fee_enabled']}
                      handleBlur={(event) => {
                        if (formik?.values['development_fee_enabled']) {
                          formik.values['development_fee'] = {
                            ...formik.values['development_fee'],
                            value: event.target.value,
                          };
                          formik.setFieldValue('development_fee', formik?.values['development_fee'], true);
                          formik.setFieldTouched('development_fee', true);
                        }
                      }}
                      errorMsg={
                        formik.values.development_fee.value &&
                        formik.errors['development_fee'] &&
                        formik.touched['development_fee'] &&
                        formik.errors['development_fee']
                      }
                    />
                  </Group>
                </>
              )}

              {formik?.values['purpose'] == 1 &&
                !tenantData.skipFieldsForField?.['ready_for_possession'].property_type[
                formik.values['property_type']
                ] && (
                  <Switch
                    key="ready_for_possession"
                    label={t('Ready for Possession')}
                    labelIcon="IconPossession"
                    desc={t('Enable if listing is ready for possession')}
                    value={formik?.values['ready_for_possession']}
                    onChange={(checked) => formik?.setFieldValue('ready_for_possession', checked)}
                    onBlur={() => formik?.setFieldTouched('ready_for_possession', true)}
                  />
                )}
            </Group>
          </CardBlock>
          {!tenantData.skipFieldsForField?.['feature_and_amenities'].property_type[formik.values['property_type']] && (
            <CardBlock icon="IconFeaturesAmenities" title={t('Feature and Amenities')}>
              <Group id="amenities" gap="32px" style={{ maxWidth: 640 }}>
                {!tenantData.skipFieldsForField?.['bedrooms'].property_type[formik.values['property_type']] && (
                  <RadioButtons
                    name="bedrooms"
                    shape="round"
                    key="bedrooms"
                    label={t('Bedrooms')}
                    inputLeftIcon="user"
                    labelIcon="MdBed"
                    value={formik?.values['bedrooms']}
                    handleChange={formik?.handleChange}
                    buttonList={tenantData.bedroomsList}
                    errorMsg={formik.errors['bedrooms'] && formik.touched['bedrooms'] && formik.errors['bedrooms']}
                  />
                )}
                {!tenantData.skipFieldsForField?.['bathrooms'].property_type[formik.values['property_type']] && (
                  <RadioButtons
                    name="bathrooms"
                    shape="round"
                    key="bathrooms"
                    label={t('Bathrooms')}
                    inputLeftIcon="user"
                    labelIcon="BiBath"
                    value={formik?.values['bathrooms']}
                    handleChange={formik?.handleChange}
                    buttonList={tenantData.bathroomsList}
                    errorMsg={formik.errors['bathrooms'] && formik.touched['bathrooms'] && formik.errors['bathrooms']}
                  />
                )}
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
                />
              </Group>
            </CardBlock>
          )}
          <CardBlock icon="IconAdInformation" title={t('Ad Information')}>
            <Group id="description" gap="32px" style={{ maxWidth: 640 }}>
              <TextInput
                key="property_title"
                name="property_title"
                label={t('Title')}
                labelIcon="MdTitle"
                placeholder={t('Enter property title e.g. Beautiful House in DHA Phase 5')}
                useInternalState
                // handleChange={formik?.handleChange}
                handleBlur={(event) => {
                  formik.setFieldTouched('property_title', true);
                  formik.setFieldValue('property_title', event.target.value, true);
                }}
                value={formik?.values['property_title']}
                skeletonLoading={loading}
                errorMsg={
                  formik?.errors['property_title'] &&
                  formik?.touched['property_title'] &&
                  formik?.errors['property_title']
                }
              />
              <TextInput
                key="property_description"
                name="property_description"
                label={t('Description')}
                labelIcon="BiDetail"
                placeholder={t("Describe your property, it's features, area it is in etc.")}
                lineCount={5}
                useInternalState
                limit={2500}
                // handleChange={formik?.handleChange}
                handleBlur={(event) => {
                  formik.setFieldTouched('property_description', true);
                  formik.setFieldValue('property_description', event.target.value, true);
                }}
                value={formik?.values['property_description']}
                skeletonLoading={loading}
                errorMsg={
                  formik?.errors['property_description'] &&
                  formik?.touched['property_description'] &&
                  formik?.errors['property_description']
                }
              />
            </Group>
          </CardBlock>
          <CardBlock icon="IconAdInformation" title={t('Property Images and Videos')}>
            <Group id="images" gap="32px" style={{ maxWidth: 640 }}>
              <ImageSelect
                labelIcon="LuImage"
                label={t('Upload Images of your Property')}
                values={formik.values}
                setFieldValue={formik.setFieldValue}
                errorMsg={
                  formik.errors['property_images'] &&
                  formik.touched['property_images'] &&
                  formik.errors['property_images']
                }
                valueKey={'property_images'}
                filesAllowed={tenantData.allowedFilesType}
                onImageUpload={(response) => {
                  onImageUpload(response);
                }}
                showQualityTip={tenantConstants.SHOW_QUALITY_TIP}
                propertyTypeId={formik.values?.['property_type']}
              />
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
            </Group>
          </CardBlock>
          {/* <CardBlock icon="IconAdInformation" title="Documents">
          <div style={{ maxWidth: 640 }}>
            <DocumentSelect
              labelIcon="MdFileCopy"
              label="Upload Documents"
              values={formik.values}
              setFieldValue={formik.setFieldValue}
              errorMsg={formik.errors['documents'] && formik.touched['documents'] && formik.errors['documents']}
              valueKey="documents"
              attachmentType="document"
            />
          </div>
        </CardBlock> */}
          <CardBlock icon="IconContactInfo" title={t('Contact Information')}>
            <Group id="contactInfo" gap="32px" style={{ maxWidth: 640 }}>
              {!!newAgencyDetails?.length && !!newAgencyDetails?.find((e) => e.id == user?.id)?.is_agency_admin && (
                <Select
                  name="posting_as"
                  key="posting_as"
                  label={t('Posting As')}
                  labelIcon="MdPerson"
                  placeholder={t('Select User')}
                  value={formik?.values['posting_as']?.id}
                  onChange={onUserChange}
                  onBlur={() => formik?.setFieldTouched('posting_as', true)}
                  options={newAgencyDetails?.filter((users) => users?.status?.slug !== 'pending')}
                  getOptionLabel={(op) => {
                    return `${op.name} (${op.email})${op.id === user.id ? ' (Me)' : ''}`;
                  }}
                  getOptionValue={(op) => op.id}
                  disabled={!!formData.listing}
                />
              )}
              <TextInput
                key="email"
                name="email"
                label={t('Email')}
                labelIcon="MdMail"
                placeholder={t('Enter Email')}
                useInternalState
                disabled={!!user?.agency}
                // handleChange={formik?.handleChange}
                handleBlur={(event) => {
                  formik.setFieldTouched('email', true);
                  formik.setFieldValue('email', event.target.value, true);
                }}
                value={formik?.values['email']}
                skeletonLoading={loading}
                errorMsg={formik?.errors['email'] && formik?.touched['email'] && formik?.errors['email']}
              />
              <Group template="initial" gap="8px">
                <Fragment>
                  <Group template={'max-content auto'} gap="16px">
                    <PhoneInput
                      name={`mobile`}
                      placeholder={t('Enter Mobile Number')}
                      defaultCountry="PK"
                      value={formik?.values?.mobile}
                      disabled={!!user?.agency}
                      onChange={(value, index) => {
                        formik.setFieldValue(`mobile[${index}]`, value || '');
                      }}
                      errorMsg={formik.errors.mobile}
                      touched={formik.touched.mobile}
                      onBlur={(index) => formik.setFieldTouched(`mobile[${index}]`, true)}
                      label={t('Mobile')}
                      labelIcon={'MdSmartphone'}
                      mobileList={formik?.values?.mobile}
                      addDisable={!!user?.agency}
                      removeMobileField={(index) => {
                        if (!!formik?.touched?.mobile?.length) {
                          formik?.touched?.mobile?.splice(index, 1);
                          formik?.setFieldTouched('mobile', formik?.touched?.mobile);
                        }
                        formik?.values?.mobile?.splice(index, 1);
                        formik?.setFieldValue('mobile', formik?.values?.mobile);
                      }}
                      addMobileField={() => {
                        formik.setFieldValue('mobile', [...formik.values.mobile, '']);
                      }}
                      isMobile={isMobile}
                    />
                  </Group>
                </Fragment>
              </Group>
              <Group template="max-content auto" gap="16px">
                <PhoneInput
                  name="landline"
                  placeholder={t('Enter Landline Number')}
                  defaultCountry="PK"
                  labelIcon="MdPhone"
                  label={t('Landline')}
                  disabled={!!user?.agency}
                  value={formik.values['landline']}
                  onChange={(value) => {
                    formik.setFieldValue('landline', !!value ? value : '', true);
                  }}
                  errorMsg={formik.errors['landline'] && formik.touched['landline'] && formik.errors['landline']}
                  onBlur={() => formik.setFieldTouched('landline', true)}
                  isMobile={isMobile}
                />
              </Group>
            </Group>
          </CardBlock>
          <CardBlock icon="IconPlatformSelection" title={t('Platform Selection')}>
            <Group id="platformSelection" gap="8px" key="platform_selection" style={{ maxWidth: 640 }}>
              {getPlatformList()?.length > 0 &&
                getPlatformList().map((e) => (
                  <CheckboxPlatforms key={e?.key}>
                    <Checkbox
                      value={formik?.values?.platform_selection?.[e?.slug]?.checked}
                      onChange={(event) => {
                        formik.setFieldValue('platform_selection', {
                          ...formik?.values?.['platform_selection'],
                          [e.key]: {
                            ...formik.values['platform_selection'][e.key],
                            checked: event.target.checked,
                          },
                        });
                      }}
                      disabled={!!formik?.values?.platform_selection?.[e?.slug]?.disabled}
                    >
                      <Icon icon={e.logo} height={24} size={e?.size} />
                      {!formData.listing &&
                        availableQuota?.[e?.slug] &&
                        availableQuota?.[e?.slug]?.available >= availableQuota?.[e?.slug]?.required ? (
                        <Number
                          value={availableQuota?.[e?.slug]?.available}
                          compact={false}
                          unit={
                            e.key && !user?.is_shifted_to_olx_quota ? (
                              <span className="text-right" style={{ marginInlineStart: 8 }}>
                                {t('Quota Available')}
                              </span>
                            ) : (
                              <span className="text-right" style={{ marginLeft: 8 }}>
                                {t('Credits Available')}
                              </span>
                            )
                          }
                        />
                      ) : (
                        !formData?.listing &&
                        !!availableQuota?.[e?.slug] &&
                        e?.slug === 'olx' && (
                          <span className="text-right" style={{ marginLeft: 8 }}>
                            {!user?.is_shifted_to_olx_quota ? t('Quota not available') : t('Credits not available')}
                          </span>
                        )
                      )}
                    </Checkbox>
                  </CheckboxPlatforms>
                ))}
              {!!formik.errors['platform_selection'] && formik.touched['platform_selection'] && (
                <Typography.Text type="danger">
                  <small>{formik.errors['platform_selection']}</small>
                </Typography.Text>
              )}
            </Group>
            {renderCrossCityAlerts()}
          </CardBlock>
          <Alert message={formik.status} />
          <div style={{ textAlign: 'right' }}>
            <Button
              type="primary"
              size="large"
              onClick={formik.handleSubmit}
              style={{ paddingInline: 32, lineHeight: 2 }}
              loading={formik.isSubmitting || submitLoading}
              disabled={!!formik?.isSubmitting || submitLoading}
            >
              {formData.listing ? t('Update Ad') : t('Submit')}
            </Button>
          </div>
        </Group>
        <ConfirmationModal
          ref={factorModalRef}
          title={t('Zone Factor')}
          onSuccess={() => {
            postListing(formik.values, { setSubmitting: formik.setSubmitting, setStatus: formik.setStatus });
          }}
          onCancel={() => {
            formik.setSubmitting(false);
            setSubmitLoading(false);
          }}
        >
          {tenantData.platformList.map((e) => {
            return (
              !!formik.values.platform_selection[e.slug]?.checked && (
                <Fragment key={e.slug}>
                  <TextWithIcon title={e.title} icon={e.icon} />
                  <DataTable
                    tableClass={!!availableQuota?.[e.slug]?.isZoneArea ? 'zoneFactorTable' : 'mb-16'}
                    columns={quotaColumns}
                    data={[
                      {
                        quota_available: availableQuota?.[e.slug]?.available,
                        quota_used: availableQuota?.[e.slug]?.required,
                      },
                    ]}
                  />
                  {e?.slug === 'olx' && !!availableQuota?.[e.slug]?.isZoneArea && (
                    <Row className="mb-20 zoneFactorWidget">
                      <Col md={1} xs={2}>
                        <IconZoneFactor />
                      </Col>
                      <Col md={23} xs={22} className="fs12">
                        <strong>{t('Zone Factor Alert ')}</strong>
                        {/* <p className="color-gray-dark">{`You are posting the listing to a premium location, 
                    ${availableQuota?.[e?.slug]?.zoneFactor} extra ${
                        !user.is_shifted_to_olx_quota ? 'credit' : 'quota'
                      } will be deducted because of zone factor`}</p> */}
                        {availableQuota?.[e?.slug]?.message}
                      </Col>
                    </Row>
                  )}

                  {e?.slug === 'zameen' &&
                    !(availableQuota?.[e.slug]?.available < availableQuota?.[e.slug]?.required) && (
                      <Row className="mb-20 zoneFactorWidget">
                        <Col md={1} xs={2}>
                          <IconZoneFactor />
                        </Col>
                        <Col md={23} xs={22} className="fs12">
                          <strong>{t('Zone Factor Alert ')}</strong>
                          {availableQuota?.[e?.slug]?.message}
                          {/* <p className="color-gray-dark">{`You are posting the listing to a premium location, 
                    ${availableQuota?.[e?.slug]?.zoneFactor} extra 'quota' will be deducted because of zone factor`}</p> */}
                        </Col>
                      </Row>
                    )}
                </Fragment>
              )
            );
          })}
        </ConfirmationModal>
      </form>
    </>
  );
};

const CardBlock = ({ title, children, icon, loading }) => {
  const renderTitle = (icon = 'MdCircle', title = 'Block title goes here') => {
    return (
      <Col xs={24} lg={5} style={{ alignSelf: 'self-start' }}>
        <Row align="middle" gutter={[16, 0]}>
          <Col xs={5} lg={24}>
            {loading ? (
              <Skeleton type="avatar" size={52} className="mb-8" />
            ) : (
              <Icon icon={icon} width={52} height={52} />
            )}
          </Col>
          <Col xs={19} lg={24}>
            {loading ? <Skeleton type="title" width={100} /> : <BlockTitle>{title}</BlockTitle>}
          </Col>
        </Row>
      </Col>
    );
  };
  return (
    <CardListing>
      <Row align="middle" gutter={[32, 16]}>
        {renderTitle(icon, title)}
        <Col xs={24} lg={19}>
          {children}
        </Col>
      </Row>
    </CardListing>
  );
};

const getColorType = (classification, status) => {
  if (status === 'not_found') {
    return { type: 'warning', icon: 'RiErrorWarningLine', color: '#FA8B0C', iconFillColor: 'black' };
  } else if (status === 'fail') {
    switch (classification) {
      case 'too_low':
      case 'too_high':
        return { type: 'danger', icon: 'MdOutlineDangerous', color: '#FF69A5', iconFillColor: 'white' };
      case 'bit_low':
      case 'but_high':
        return { type: 'warning', icon: 'RiErrorWarningLine', color: '#FA8B0C', iconFillColor: 'black' };
      default:
        return { type: 'warning', icon: 'RiErrorWarningLine', color: '#FA8B0C', iconFillColor: 'black' };
    }
  } else if (status === 'pass') {
    return { type: 'success', icon: 'HiCheckCircle', color: '#009f2b', iconFillColor: 'white' };
  }
};

const getType = (error) => {
  const { t } = useTranslation();
  if (!error) {
    return {
      type: 'default',
      color: 'grey',
      icon: 'FiInfo',
      description: t(
        'Our system validates the price. Please enter a realistic price for your property that is according to the market rates for the selected location',
      ),
    };
  }
  if (error) {
    return { ...getColorType(error.pct_classification, error.status), description: error.message };
  }
};

const PriceCheck = (props) => {
  const { t } = useTranslation();
  const { error, loading } = props;
  const { type, description, icon, color, iconFillColor } = getType(error);

  const renderTag = () => (
    <PriceCheckWrapper>
      <Space align="center">
        {loading ? <Spin /> : <Icon icon={icon} color={color} />}
        {t('Price Check')}
      </Space>
    </PriceCheckWrapper>
  );

  return (
    <div className={type}>
      {loading ? (
        renderTag()
      ) : (
        <Popover
          placement="bottomRight"
          content={<div style={{ maxWidth: 200 }}>{description}</div>}
          action="hover"
          style={{ maxWidth: 240 }}
        >
          {renderTag()}
        </Popover>
      )}
    </div>
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

export default PostListing;
