import TenantComponents from '@components';
import tenantConstants from '@constants';
import tenantData from '@data';
import tenantTheme from '@theme';
import tenantUtils from '@utils';
import { Badge, Divider, Row, Space, Typography, Tooltip } from 'antd';
import { t } from 'i18next';
import React, { useRef, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useUpdateAutoRenewMutation } from '../../../../apis/listings';
import {
  DrawerModal,
  Flex,
  Group,
  Image,
  Label,
  Number,
  ProductTag,
  Skeleton,
  Switch,
  Tag,
  TextWithIcon,
  notification,
} from '../../../../components/common';
import Statistic from '../../../../components/common/statistic';
import ListingDrawer from '../../../../components/listing-drawer/listingDrawer';
import { ListingCardStyled, SwitchWrapped, TenantList, Thumbnail } from '../../../../components/styled';
import { getTimeDateString } from '../../../../utility/date';
import { getBaseURL } from '../../../../utility/env';
import { HealthContainer, Stats } from '../../../common/components/listing/styled';
import dayjs from 'dayjs';
import { AdLicenseStatus } from '../../../../components/table/table-components/ad-license-status';
import DiscountTag from '../../../../components/discount-tag/DiscountTag';
import { useTranslation } from 'react-i18next';
const { Text } = Typography;

const getStatsData = (data = {}) => {
  const { views, clicks, leads } = data;
  return [
    { title: 'Views', value: views, icon: 'IoMdEye', iconProps: { color: tenantTheme['secondary-color'] } },
    { title: 'Clicks', value: clicks, icon: 'HiCursorClick', iconProps: { color: tenantTheme['color-clicks'] } },
    {
      title: 'Leads',
      value: leads,
      icon: 'MdPhone',
      iconProps: { color: tenantTheme['color-leads'], hasBackground: true, size: '1em', iconContainerSize: '24px' },
    },
  ];
};

const ListingCard = ({ item, disableDiv, selected, wrap, align }) => {
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const [loading, setLoading] = useState(false);
  const listingDrawerRef = useRef();
  const [autoRenewModalVisible, setAutoRenewModalVisible] = useState(false);
  const isDailyRentalListing = item?.purpose?.slug == 'daily-rental';
    const { i18n } = useTranslation();
  const currentLang = i18n.language;
  const rtl = useSelector((state) => state.app.AppConfig.rtl);
  const [updateAutoRenew] = useUpdateAutoRenewMutation();
  const bookedDates = item?.additional_details?.booked_dates;
  const dateLabelMapping = tenantUtils.getDateFieldsByStatus(
    item?.status?.slug,
    item?.platforms?.auto_renewable_item?.isApplied,
  );
  const dateLabels = Object.keys(dateLabelMapping);
  const today = dayjs().startOf('day');
  const bookingEndDate = useMemo(() => {
    if (!bookedDates) return null;
    const endDate = bookedDates.map((range) => {
      const start = dayjs(range.start_date);
      const end = dayjs(range.end_date);
      return today.isAfter(start) || today.isSame(start, 'day') ? end : null;
    });
    return endDate;
  }, [bookedDates, today]);
  const [visible, setVisible] = useState(false);
  const updateExpiryRenewal = async (autoRenewId, listingId, productId, setLoading) => {
    const response = await updateAutoRenew({ autoRenewId, listingId, productId });
    if (response) {
      setLoading(false);
      if (response?.error) {
        notification.error(response?.error);
      } else {
        notification.success(t('Updated Successfully'));
        setAutoRenewModalVisible(false);
      }
    }
  };

  const onChange = () => {
    setAutoRenewModalVisible(true);
  };

  const getTagProps = () => {
    const { productsInfo = {} } = item?.property;

    if (productsInfo?.['signature-listing']?.is_applied) {
      return tenantData.getListingActions('signature-listing');
    }
    if (productsInfo?.['hot-listing']?.is_applied) {
      return tenantData.getListingActions('hot-listing');
    }
    return tenantData.getListingActions('basic-listing');
  };

  const handleClick = () => {
    listingDrawerRef?.current && listingDrawerRef.current.open(item?.id);
  };

  const property = item?.property;
  const showDiscountTag =
    tenantConstants.SHOW_LISTING_DISCOUNT_TAG &&
    property?.discount_applied === true &&
    property?.discount_percentage != null &&
    property?.discount_percentage !== '';
  const discountTagActualPriceDisplay =
    property?.actual_price?.value ?? property?.actual_price ?? property?.price?.value;

  const renderStats = (item) => {
    return item?.status?.slug === 'active' || item?.status?.slug === 'removed' ? (
      <>
        <Stats className="mb-8" template="repeat(3, 1fr)" gap="8px">
          {getStatsData(item?.platforms?.data[0]).map((e, i) => {
            return e.value === 'loading' ? (
              <Skeleton key={i} />
            ) : (
              <Statistic
                icon={e?.icon}
                iconProps={{ ...e?.iconProps, hasBackground: true, size: '1em', iconContainerSize: '24px' }}
                spaceProps={{ align: 'center' }}
                title={t(e?.title)}
                formatter={<Number value={e?.value ? e.value : 0} compact={false} />}
                value={e?.value ? e.value : 0}
                trends={false}
                key={i}
              />
            );
          })}
        </Stats>
      </>
    ) : null;
  };

  return (
    <div>
      <ListingCardStyled
        style={{
          ...(disableDiv && { pointerEvents: 'none', opacity: 0.4 }),
          ...(selected && { backgroundColor: '#e7f3ef' }),
        }}
      >
        <Group template="106px 1fr" gap=".571rem" className="mb-8">
          <Badge
            count={item?.images_count}
            size="default"
            overflowCount={90}
            offset={!rtl && [-105, 0]}
            style={{ backgroundColor: '#00a651' }}
            shape="square"
          >
            <Thumbnail style={{ position: 'relative' }}>
              {item?.booked && (
                <div
                  style={{
                    position: 'absolute',
                    top: 6,
                    insetInlineStart: 10,
                    zIndex: 2,
                  }}
                >
                  <ProductTag
                    icon="BookedBadge"
                    name={t('Booked')}
                    tagBackgroundColor="#00A174"
                    onClick={() => setVisible(true)}
                  />
                </div>
              )}
              <Image
                onClick={handleClick}
                src={item?.image?.thumbnail}
                fallback={`${getBaseURL()}/profolio-assets/images/ph-listings.svg`}
              />
              {showDiscountTag && (
                <div
                  style={{
                    position: 'absolute',
                    top: 6,
                    right: 6,
                    zIndex: 2,
                    lineHeight: 0,
                  }}
                >
                  <DiscountTag
                    discount_percentage={property?.discount_percentage}
                    actualPriceDisplay={discountTagActualPriceDisplay}
                  />
                </div>
              )}
            </Thumbnail>
          </Badge>
          <Group template="initial" gap="4px">
            <Row align={align || 'middle'} justify="space-between" wrap={wrap} style={{ gap: isMobile && '6px' }}>
              <Space className="mb-2 w-100" style={{ justifyContent: isMobile && 'space-between' }}>
                <div className="fz-14 fw-700" style={{ lineHeight: 1.2 }}>
                  {!!item?.jarvis_stages ? (
                    <Number className="text-primary" compact={false} type="price" currency={"SAR"} value={item?.property_price} />
                  ) : (
                    <Number className="text-primary" compact={false} type="price" {...item?.property?.price} />
                  )}
                  {isDailyRentalListing && (
                    <span
                      className="fw-500"
                      style={{ marginInlineStart: '4px', fontSize: '11px', color: tenantTheme['primary-color'] }}
                    >
                      {t('Night')}
                    </span>
                  )}
                </div>
                {item?.property?.productsInfo?.['basic-listing']?.is_applied && (
                  <ProductTag {...getTagProps()} iconProps={{ ...getTagProps().iconProps }} />
                )}
              </Space>
              <HealthContainer style={{ alignItems: 'start' }}>
                {item?.platforms?.data?.map((platform) => (
                  <React.Fragment key={platform?.slug}>
                    {item?.health && (
                      <TenantComponents.Health {...item?.health} listingsData={item?.property} isMobile />
                    )}
                    <TenantComponents.ListingsRowActions
                      data={item?.platforms.data.filter((e) => e.slug == platform.slug)}
                      location={item?.platforms?.location}
                      property_id={item?.platforms?.property_id}
                      purpose={item?.platforms.purpose}
                      type={item?.platforms?.type}
                      isMobile
                    />
                  </React.Fragment>
                ))}
              </HealthContainer>
            </Row>
            {item?.listing_type?.title && item?.listing_purpose?.title && (
              <span>
                <Tag
                  color={tenantTheme['primary-light-4']}
                  style={{ '--tag-color': tenantTheme['primary-color'], fontWeight: '700' }}
                >
                  {`${tenantUtils.getLocalisedString(item?.listing_type, 'title')} ${t(`for ${item?.listing_purpose?.title}`)}${
                    tenantConstants.SHOW_COMPLETION_STATUS_FOR_SELL &&
                    item?.property?.purpose?.slug === 'sale' &&
                    !!item?.property?.completion_status
                      ? ` | ${t(item?.property?.projectStatus)}`
                      : ''
                  }`}
                </Tag>
              </span>
            )}
            {!!item?.type?.combined_title && (
              <span>
                <Tag
                  color={tenantTheme['primary-light-4']}
                  style={{ '--tag-color': tenantTheme['primary-color'], fontWeight: '700' }}
                >
                  {`${currentLang === 'en' ? item?.type?.combined_title : item?.type?.combined_title_l1}`}
                </Tag>
              </span>
            )}
            <div>
              <Space size="large">
                {item?.beds > 0 && (
                  <TextWithIcon
                    icon="IconBedroom"
                    iconProps={{ size: '1.2em', color: tenantTheme.gray500 }}
                    value={`${item?.beds} ${t('Rooms')}`}
                  />
                )}
                {item?.baths > 0 && (
                  <TextWithIcon
                    icon="IconBathroom"
                    iconProps={{ size: '1.2em', color: tenantTheme.gray500 }}
                    value={`${item?.baths} ${t('Baths')}`}
                  />
                )}
                {item?.area?.value && (
                  <TextWithIcon
                    icon="IconAreaSize"
                    iconProps={{ size: '1.4em', color: tenantTheme.gray500 }}
                    value={`${item?.area?.value} ${t('Sq. M.')}`}
                  />
                )}
                {item?.location?.title && (
                  <TextWithIcon
                    icon="IconAreaSize"
                    iconProps={{ size: '1.4em', color: tenantTheme.gray500 }}
                    value={`${currentLang === 'en' ? item?.location?.title : item?.location?.title_l1}`}
                  />
                )}
              </Space>
              <div>
                <div>
                  {item?.platforms?.location?.breadcrumb
                    ?.filter((e) => e?.level > 1)
                    ?.map((e) => tenantUtils.getLocalisedString(e, 'title'))
                    ?.join(', ')}
                </div>
              </div>
            </div>
            <span className="fz-10">
              <Text className="text-muted" style={{ fontSize: 10 }}>
                {t('Bayut ID:')}
              </Text>{' '}
              <Text className="text-primary" style={{ fontSize: 10 }}>
                {item?.id}
              </Text>
              {item?.ad_license ? (
                <>
                  <Divider type="vertical" style={{ marginInline: 4 }} />
                  <Text className="text-muted" style={{ fontSize: 10 }}>
                    {t('REGA ID:')}{' '}
                  </Text>
                  <Text className="text-primary" style={{ fontSize: 10 }}>
                    {item?.ad_license}
                  </Text>
                </>
              ) : item?.permit_number ? (
                <>
                  <Divider type="vertical" style={{ marginInline: 4 }} />
                  <Text className="text-muted" style={{ fontSize: 10 }}>
                    {t('Permit No:')}{' '}
                  </Text>
                  <Text className="text-primary" style={{ fontSize: 10 }}>
                    {item?.permit_number}
                  </Text>
                </>
              ) : (
                <>
                  {!!item?.jarvis_stages ? (
                    <>
                      <Divider type="vertical" style={{ marginInline: 4 }} />
                      {AdLicenseStatus(item, { alignSelf: 'center', fontSize: 10 })}
                    </>
                  ) : (
                    <>
                      <Divider type="vertical" style={{ marginInline: 4 }} />
                      <Tag shape="round" style={{ alignSelf: 'center', fontSize: 10 }}>
                        {t('Unlicensed')}
                      </Tag>
                    </>
                  )}
                </>
              )}
            </span>
            {!!item?.jarvis_stages ? (
              <Row justify="space-between" style={{ alignItems: 'baseline' }}>
                {t('Posted on')} {getTimeDateString(item?.created_at)}
              </Row>
            ) : (
              <>
                {dateLabels[0] && (
                  <Row justify="space-between" style={{ alignItems: 'baseline' }}>
                    {t(dateLabels[0])}{' '}
                    {getTimeDateString(item?.platforms?.data?.[0]?.[dateLabelMapping[dateLabels[0]]]) || '-'}
                  </Row>
                )}
              </>
            )}
          </Group>
          {<ListingDrawer ref={listingDrawerRef} />}
        </Group>
        {renderStats(item)}

        {item?.platforms?.data?.map((platform) => (
          <div key={platform?.slug}>
            <TenantList template="40% auto" gap="8px 4px" key={platform?.id}>
              <div>
                <div>
                  {dateLabels[1] && (
                    <Flex className="fz-10" wrap gap="3px" align="center">
                      {t(dateLabels[1])}
                      {
                        <Text strong style={{ fontSize: '12px' }}>
                          {getTimeDateString(item?.platforms?.data?.[0]?.[dateLabelMapping[dateLabels[1]]]) || '-'}
                        </Text>
                      }
                    </Flex>
                  )}
                </div>
                {!tenantConstants?.HIDE_AUTO_RENEWAL && (
                  <>
                    <SwitchWrapped className="fz-10" align="center">
                      <Switch
                        switchOnly
                        name="auto-renew"
                        size="small"
                        value={item?.platforms?.auto_renewable_item?.isApplied}
                        onChange={onChange}
                        loading={loading}
                      />
                      <Label
                        htmlFor="auto-renew"
                        className={isMobile ? 'fz-10' : 'fz-12'}
                        color={tenantTheme['primary-color']}
                      >
                        {t('AUTO-RENEW')}
                      </Label>
                    </SwitchWrapped>
                    <DrawerModal
                      title={`${item?.platforms?.auto_renewable_item?.isApplied ? t('Disable') : t('Enable')} ${t('Auto Renew')}`}
                      visible={autoRenewModalVisible}
                      onOk={() => {
                        setLoading(true);
                        updateExpiryRenewal(
                          item?.platforms?.auto_renewable_item?.id,
                          item?.property?.id,
                          tenantData.getListingActions('basic-listing')?.id,
                          setLoading,
                        );
                      }}
                      height={'auto'}
                      onCancel={() => {
                        setAutoRenewModalVisible(false);
                      }}
                      loading={loading}
                    >
                      {!item?.platforms?.auto_renewable_item?.isApplied
                        ? t(
                            "By turning the 'Auto-Renew' feature ON. The system will automatically renew the listing when it reaches its expiry, if you have enough credits available",
                          )
                        : t('Are you sure you want to disable auto renew for this listing')}
                    </DrawerModal>
                  </>
                )}
              </div>
              <div style={{ justifySelf: 'end', textAlign: 'right' }}>
                <TenantComponents.PlatformActions
                  data={item?.platforms.data.filter((e) => e.slug === platform.slug)}
                  location={item?.platforms?.location}
                  property_id={item?.platforms?.property_id}
                  purpose={item?.platforms.purpose}
                  type={item?.platforms?.type}
                />
              </div>
            </TenantList>
          </div>
        ))}
      </ListingCardStyled>
      <DrawerModal
        title={t('Booked')}
        visible={visible}
        footer={null}
        height={'auto'}
        onCancel={() => {
          setVisible(false);
        }}
      >
        <TextWithIcon icon="InfoIcon" value={`${t('Booked Until')} ${getTimeDateString(bookingEndDate)}`} />
      </DrawerModal>
    </div>
  );
};

export default ListingCard;
