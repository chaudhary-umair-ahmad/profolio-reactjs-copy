import tenantConstants from '@constants';
import tenantData from '@data';
import tenantTheme from '@theme';
import tenantUtils from '@utils';
import { Space, Typography } from 'antd';
import React, { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdArrowOutward } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { useLazyGetListingDetailQuery } from '../../apis/postlisting';
import { getBaseURL } from '../../utility/env';
import { getFeatureAmenityIconName } from '../../helpers/featureAmenitySlugToIcon';
import { hasFurnishedOnListing, isListingFurnishedYes } from '../../helpers/furnishedPrefill';
import { hasRegaDetailsContent } from '../../utility/utility';
import { Button, Card, Drawer, Flex, Group, Icon, Image, ImageGallery, Number, Tag, TextWithIcon } from '../common';
import Alert from '../common/alert/alert';
import QR_Code from '../common/qr-code/qr-code';
import ListDetail from '../list-detail/list-detail';
import ListingDrawerSkeleton from './listingDrawerSkeleton';
const { Text, Title, Paragraph } = Typography;

const groupsFromDynamicFeatures = (features) => {
  if (!Array.isArray(features) || features.length === 0) return [];
  const bySection = new Map();
  features.forEach((f) => {
    const section = f?.dynamic_section || {};
    const key = section.id ?? section.slug ?? 'features';
    if (!bySection.has(key)) {
      bySection.set(key, {
        group_id: key,
        title: section.name,
        title_l1: section.name_l1,
        features: [],
      });
    }
    bySection.get(key).features.push({
      id: f.id,
      feature_id: f.id,
      slug: f.slug,
      title: f.label,
      title_l1: f.label_l1,
      value: f.value,
      feature_value: f.value,
      format: f.format_type != null ? String(f.format_type).trim().toLowerCase() : undefined,
    });
  });
  return Array.from(bySection.values());
};

const ListingDrawer = forwardRef((props, ref) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isExpandedL1, setIsExpandedL1] = useState(false);
  const [listing, setListing] = useState(null);
  const listingDetailDrawerRef = useRef();
  const { rtl } = useSelector((state) => state.app.AppConfig);
  const { user } = useSelector((state) => state.app.loginUser);
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);

  const isOffPlan = listing?.is_offplan_listing;

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleDescriptionL1 = () => {
    setIsExpandedL1(!isExpandedL1);
  };

  const [getListingDetail] = useLazyGetListingDetailQuery();

  const fetchListingDetail = async (id) => {
    if (id) {
      const response = await getListingDetail({ listingId: id, userId: user?.id });
      if (response) {
        if (!response.error) {
          setListing(response?.data?.listing);
          setLoading(false);
        }
      }
    }
  };

  useImperativeHandle(ref, () => ({
    open(id) {
      fetchListingDetail(id);
      listingDetailDrawerRef?.current && listingDetailDrawerRef?.current?.openDrawer();
    },
  }));

  const closeDrawer = () => {
    listingDetailDrawerRef?.current?.closeDrawer();
  };

  const description = listing?.description;
  const isLongDescription = description && description.length > 300;

  const descriptionL1 = listing?.description_l1;
  const isLongDescriptionL1 = descriptionL1 && descriptionL1.length > 300;

  const breadcrumb = useMemo(() => {
    return listing?.location?.breadcrumb
      ?.filter((e) => e?.level > 1)
      ?.map((e) => tenantUtils.getLocalisedString(e, 'title'))
      ?.join(', ');
  }, [listing]);

  const offPlanBreadcrumb = useMemo(() => {
    return listing?.location?.breadcrumb
      ?.filter((e) => e?.level < 3)
      ?.map((e) => tenantUtils.getLocalisedString(e, 'title'))
      ?.join(', ');
  }, [listing]);

  const getCityFromBreadcrumb = (breadcrumb) => {
    const cityItem = breadcrumb?.find((item) => item.level === 2);
    return cityItem ? tenantUtils.getLocalisedString(cityItem, 'title') : '-';
  };

  const getLocationFromBreadcrumb = (breadcrumb) => {
    const locationItem = breadcrumb?.[0];
    return locationItem ? tenantUtils.getLocalisedString(locationItem, 'title') : '-';
  };

  const getIconName = (feature) =>
    tenantConstants?.SHOW_AMENITIES_ICON
      ? getFeatureAmenityIconName(tenantData.amenities, feature?.feature_id ?? feature?.id, feature?.slug)
      : '';

  const amenityFeatureGroups = useMemo(() => {
    const legacy = listing?.listing_features;
    if (Array.isArray(legacy) && legacy.length > 0) return legacy;
    return groupsFromDynamicFeatures(listing?.dynamic_data?.dynamic_fields?.features);
  }, [listing]);

  const propertySpecs = useMemo(
    () => [
      { label: t('Property Type'), value: tenantUtils.getLocalisedString(listing?.listing_type, 'title') },
      listing?.hasOwnProperty('residence_type') && {
        label: t('Residence Type'),
        value: tenantUtils.getLocalisedString(listing?.residence_type, 'name'),
      },
      { label: t('City'), value: getCityFromBreadcrumb(listing?.location?.breadcrumb) },
      { label: t('Location'), value: getLocationFromBreadcrumb(listing?.location?.breadcrumb) },
      { label: t('Purpose'), value: tenantUtils.getLocalisedString(listing?.listing_purpose, 'title') },
      tenantConstants.SHOW_REGA_DETAIL
        ? hasFurnishedOnListing(listing) && {
            label: t('Furnished'),
            value: isListingFurnishedYes(listing) ? t('Yes') : t('No'),
          }
        : listing?.hasOwnProperty('is_furnished') && {
            label: t('Furnished'),
            value: listing?.is_furnished ? t('Yes') : t('No'),
          },
      { label: tenantConstants.SHOW_REGA_DETAIL ? t('Bayut ID') : t('Listing ID'), value: listing?.id },
    ],
    [t, listing],
  );

  return (
    <>
      <Drawer
        title={
          <div>
            <Title level={5} style={{ fontWeight: '700' }}>
              {tenantUtils.getLocalisedString(listing, 'title')}
            </Title>
            <Paragraph className="fz-12 fw-700 mb-0" style={{ color: tenantTheme['base-color'] }}>
              {!loading && (
                <Text type="secondary fw-400" style={{ marginInlineEnd: '4px' }}>
                  {t('Posted By')}
                  {': '}
                </Text>
              )}
              {tenantUtils.getLocalisedString(listing?.posted_by, 'name')}
            </Paragraph>
          </div>
        }
        placement={isMobile ? 'bottom' : rtl ? 'left' : 'right'}
        ref={listingDetailDrawerRef}
        onCloseDrawer={() => {}}
        closable={false}
        width="40vw"
        height={isMobile ? '100vh' : ''}
        footer={null}
        bodyStyle={null}
        stopPropagation
      >
        {!!loading ? (
          <ListingDrawerSkeleton />
        ) : (
          <div>
            {listing?.disposition?.slug === 'rejected' && (
              <Alert
                message={t(listing?.disposition?.name)}
                description={listing?.rejection_reason
                  ?.map((reason) => tenantUtils.getLocalisedString(reason, 'reason'))
                  .join(', ')}
                type="error"
                icon={<Icon icon="IoWarning"/>}
                showIcon
                outlined={false}
                className="mb-8"
                color={tenantTheme['danger-color']}
              />
            )}
            <ImageGallery
              loading={loading}
              images={listing?.images}
              modalTitle={tenantUtils.getLocalisedString(listing, 'title')}
              className={isMobile ? 'mb-16' : 'mb-24'}
              imagecount={4}
            />
            <Group gap={isMobile ? '25px' : '35px'}>
              <div>
                <Text type="secondary">{tenantConstants.CURRENCY_SYMBOL()} </Text>
                <Text className=" fw-700 color-primary">
                  <Number
                    className="fz-20"
                    value={listing?.listingPrice?.value ? listing?.listingPrice?.value : 0}
                    compact={false}
                    style={{ color: tenantTheme['primary-color'] }}
                  />{' '}
                  {listing?.rent_frequency && tenantUtils.getLocalisedString(listing, 'rent_frequency')}
                </Text>
                <Title level={5} className="mb-16 mt-0">
                  {isOffPlan ? listing?.location?.breadcrumb?.[0]?.title : breadcrumb}
                </Title>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  {isOffPlan && (
                    <>
                      <TextWithIcon
                        icon="FaLocationDot"
                        iconProps={{ size: '1.1em', color: tenantTheme['primary-color'] }}
                        value={offPlanBreadcrumb}
                      />
                      <TextWithIcon
                        icon="PiBuildingsFill"
                        iconProps={{ size: '1.2em', color: tenantTheme['primary-color'] }}
                        value={`Unit No ${listing?.rega_details?.location?.additional_number}`}
                      />
                    </>
                  )}
                </div>
                <Space size="large" align="center" style={{ marginTop: '8px' }}>
                  {listing?.beds > 0 && (
                    <TextWithIcon
                      icon="IconBedroom"
                      iconProps={{ size: '1.2em', color: tenantTheme['primary-color'] }}
                      value={`${listing?.beds} ${t('Beds')}`}
                    />
                  )}
                  {listing?.baths > 0 && (
                    <TextWithIcon
                      icon="IconBathroom"
                      iconProps={{ size: '1.2em', color: tenantTheme['primary-color'] }}
                      value={`${listing?.baths} ${t('Baths')}`}
                    />
                  )}
                  {listing?.area_unit?.value && (
                    <TextWithIcon
                      icon="IconAreaSize"
                      iconProps={{ size: '1.4em', color: tenantTheme['primary-color'] }}
                      value={
                        `${listing?.area_unit?.value}` +
                        ' ' +
                        tenantUtils.getLocalisedString(listing?.area_unit, 'label')
                      }
                    />
                  )}
                </Space>
              </div>
              <div>
                <div className="mb-12" style={{ textAlign: 'left' }}>
                  {listing?.title && (
                    <Title strong level={5} style={{ fontSize: '14px' }}>
                      {listing?.title}
                    </Title>
                  )}
                  {description && (
                    <Paragraph
                      className="color-gray-dark mb-8 fz-12"
                      ellipsis={isLongDescription && !isExpanded ? { rows: 3, expandable: false } : false}
                    >
                      {description}
                    </Paragraph>
                  )}
                  {isLongDescription && (
                    <Button
                      className="p-0"
                      type="link"
                      icon={isExpanded ? 'IoIosArrowUp' : 'IoIosArrowDown'}
                      onClick={toggleDescription}
                    >
                      {isExpanded ? 'Show Less' : 'Read More'}
                    </Button>
                  )}
                </div>
                <div className="dir-rtl">
                  {listing?.title_l1 && (
                    <Title strong level={5} style={{ fontSize: '14px' }}>
                      {listing?.title_l1}
                    </Title>
                  )}
                  {descriptionL1 && (
                    <Paragraph
                      className="color-gray-dark mb-8 fz-12"
                      ellipsis={{ rows: isExpandedL1 ? 0 : 3, expandable: false }}
                    >
                      {descriptionL1}
                    </Paragraph>
                  )}
                  {isLongDescriptionL1 && (
                    <Button
                      className="p-0"
                      type="link"
                      icon={isExpandedL1 ? 'IoIosArrowUp' : 'IoIosArrowDown'}
                      onClick={toggleDescriptionL1}
                    >
                      {isExpandedL1 ? 'اقرأ أقل' : 'اقرأ أكثر'}
                    </Button>
                  )}
                </div>
              </div>
              {isOffPlan && (
                <div>
                  <Title level={5} style={{ fontWeight: '700' }}>
                    {t('Project Information')}
                  </Title>
                  <Card
                    className="rega-card-container"
                    bodyStyle={{
                      padding: '16px',
                      background: 'linear-gradient(180deg, #F5FAFA 17.2%, #FFFFFF 117.52%)',
                    }}
                    style={{ borderColor: tenantTheme['primary-light-2'], overflow: 'hidden', borderWidth: 1 }}
                  >
                    <Group template="repeat(2,1fr)" gap="20px">
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Text className="color-gray-dark fs12 mb-4">{t('Project Name')}</Text>
                        <Text strong>{tenantUtils.getLocalisedString(listing?.project, 'title')}</Text>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Text className="color-gray-dark fs12 mb-4">{t('Developer')}</Text>
                        <Text strong>{tenantUtils.getLocalisedString(listing?.project?.developer, 'name')}</Text>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Text className="color-gray-dark fs12 mb-4">{t('Completion Date')}</Text>
                        <Text strong>{listing?.project?.progress?.date}</Text>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Text className="color-gray-dark fs12 mb-4">{t('Completion Percentage')}</Text>
                        <Text strong>{`${listing?.project?.progress?.completion_percentage}%`}</Text>
                      </div>
                    </Group>
                  </Card>
                </div>
              )}

              <ListDetail data={propertySpecs} title={t('Property Information')} />

              {tenantConstants.SHOW_REGA_DETAIL && !listing?.isDailyRental && hasRegaDetailsContent(listing?.rega_details) && (
                <div>
                  <Title level={5} style={{ fontWeight: '700' }}>
                    {t('REGA Information')}
                  </Title>
                  <Card style={{ backgroundColor: tenantTheme['primary-light-4'], borderWidth: 0 }}>
                    <Flex justify="space-between" align={isMobile && 'center'}>
                      <div className={!isMobile ? 'py-24' : null}>
                        {listing?.rega_details?.license_info?.ad_license_number && (
                          <TextWithIcon
                            textSize={isMobile && '12px'}
                            icon={'PiSealCheckFill'}
                            iconProps={{ color: tenantTheme['primary-color'] }}
                            value={
                              <span className="color-gray-dark">
                                {t('REGA Ad License ID')} {':'}{' '}
                                <span style={{ color: tenantTheme['base-color'] }}>
                                  {listing?.rega_details?.license_info?.ad_license_number}
                                </span>
                              </span>
                            }
                          />
                        )}
                        {listing?.rega_details?.license_info?.fal_license_number && (
                          <TextWithIcon
                            icon={'FaAddressCard'}
                            iconProps={{ color: tenantTheme['primary-color'] }}
                            value={
                              <span className="color-gray-dark">
                                {t('FAL License no')} {':'}{' '}
                                <span style={{ color: tenantTheme['base-color'] }}>
                                  {listing?.rega_details?.license_info?.fal_license_number}
                                </span>
                              </span>
                            }
                          />
                        )}
                      </div>
                      <Flex gap="10px" justify="center" align="center">
                        <a
                          style={{ width: '10ch' }}
                          className="color-primary fz-12 fw-700"
                          href={listing?.rega_details?.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {t('View Details on REGA')}
                          <MdArrowOutward style={{ marginInlineStart: '4px' }} size={14} />
                        </a>
                        {listing?.rega_details?.url && (
                          <QR_Code size={50} value={listing?.rega_details?.url} viewBox={`0 0 256 256`} />
                        )}
                      </Flex>
                    </Flex>
                  </Card>
                </div>
              )}

              {tenantConstants.SHOW_REGA_DETAIL && listing?.isDailyRental && listing?.permit_number && (
                <div>
                  <Title level={5} style={{ fontWeight: '700' }}>
                    {t('Ministry of Tourism Information')}
                  </Title>
                  <Card style={{ backgroundColor: tenantTheme['primary-light-4'], borderWidth: 0 }}>
                    <Flex justify="space-between" align={isMobile && 'center'}>
                      <div className={!isMobile && 'py-24'}>
                        {listing?.permit_number && (
                          <TextWithIcon
                            textSize={isMobile && '12px'}
                            icon={'LuFileBadge'}
                            iconProps={{ color: tenantTheme['primary-color'] }}
                            value={
                              <span className="color-gray-dark">
                                {t('Permit Number')} {':'}{' '}
                                <span style={{ color: tenantTheme['base-color'] }}>{listing?.permit_number}</span>
                              </span>
                            }
                          />
                        )}
                      </div>
                      <Flex gap="10px" justify="flex-end" align="center">
                        <Image
                          src={`${getBaseURL()}/profolio-assets/images/ministry-of-tourism-update.png`}
                          style={{ width: '100px' }}
                        />
                      </Flex>
                    </Flex>
                  </Card>
                </div>
              )}

              <div className="fs12">
                <Title level={5} style={{ fontWeight: '700' }}>
                  {t('Feature and Amenities')}
                </Title>

                {(!amenityFeatureGroups || amenityFeatureGroups.length < 1) && (
                  <div className="">
                    <Paragraph ellipsis={{ rows: isExpanded ? 0 : 3, expandable: false }}>
                      {t('No features and amenities have been added')}
                    </Paragraph>
                  </div>
                )}
                <Flex vertical={true} wrap>
                  {amenityFeatureGroups?.map((group) => (
                    <div key={group.group_id} className="mb-16">
                      <Text className="mb-8 fz-14" style={{ display: 'block' }}>
                        {tenantUtils.getLocalisedString(group, 'title')}
                      </Text>
                      <div className="flex" style={{ gap: '8px', flexFlow: 'wrap' }}>
                        {group.features.map((feature) => {
                          const featureValue = feature?.value ?? feature?.feature_value;
                          const fmt = String(feature?.format ?? '')
                            .trim()
                            .toLowerCase();
                          const showValue =
                            fmt === 'number' && featureValue != null && featureValue !== '';
                          return (
                            <Tag
                              key={feature.id}
                              shape="round"
                              bordered
                              spaceTop="1px"
                              icon={<Icon icon={getIconName(feature)} style={{}} />}
                              style={{
                                overflow: 'hidden',
                                display: 'inline-flex',
                                '--space-top': '1px',
                                backgroundColor: tenantTheme.gray200,
                              }}
                            >
                              <div style={{ overflow: 'hidden', maxWidth: '100%', textOverflow: 'ellipsis' }}>
                                {tenantUtils.getLocalisedString(feature, 'title')}
                                {showValue && `: ${featureValue}`}
                              </div>
                            </Tag>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </Flex>
              </div>
            </Group>
          </div>
        )}
      </Drawer>
    </>
  );
});

export default ListingDrawer;