import TenantComponents from '@components';
import tenantConstants from '@constants';
import tenantData from '@data';
import tenantTheme from '@theme';
import tenantUtils from '@utils';
import { Badge, Divider, Space, Typography, Tooltip } from 'antd';
import { t } from 'i18next';
import React, { useRef, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getTimeDateString } from '../../../utility/date';
import { getBaseURL } from '../../../utility/env';
import { capitalizeFirstLetter } from '../../../utility/utility';
import { Flex, Icon, Image, LinkWithIcon, Number as NumberDisplay, Popover, ProductTag, Tag, TextWithIcon } from '../../common';
import DiscountTag from '../../discount-tag/DiscountTag';
import Group from '../../common/group/group';
import ListingDrawer from '../../listing-drawer/listingDrawer';
import { Thumbnail } from '../../styled';
import { IconSwitch } from '../../svg';
import dayjs from 'dayjs';
import {
  normalizeBookedDateRanges,
  hasBookedRangeIncludingToday,
  getActiveBookingEndDateString,
} from '../../../helpers/bookedDateRanges';
const { Text } = Typography;

const AREA_UNIT_SQ_M_EN = 'Sq. M.';
const AREA_UNIT_SQ_M_AR = 'م²';

export const ListingPurpose = (props) => {
  const {
    productsInfo = {},
    hideHealthPopover,
    disableDetailDrawer = false,
    isOffPlan,
    projectStatus,
    saleType,
    showExternalLink = false,
    booked,
    bookedDates,
    discount_percentage,
    discount_applied,
    price,
    actual_price,
  } = props;
  const isProject = !!props?.project_info?.id;
  // Purpose-agnostic: the discount tag renders for any listing the backend flags as discounted
  // (sale or rent), keyed on the same fields — matching the listing card and the post-listing form.
  const showDiscountTag =
    tenantConstants.SHOW_LISTING_DISCOUNT_TAG &&
    discount_applied === true &&
    discount_percentage != null &&
    discount_percentage !== '';

  const discountTagActualPriceDisplay = actual_price?.value ?? actual_price ?? price?.value;

  const listingDrawerRef = useRef();
  const { i18n } = useTranslation();
  const listingAreaUnitShort = useMemo(() => {
    const lang = (i18n.language || '').toLowerCase();
    return lang.startsWith('ar') ? AREA_UNIT_SQ_M_AR : AREA_UNIT_SQ_M_EN;
  }, [i18n.language]);
  const rtl = useSelector((state) => state.app.AppConfig.rtl);
  const statusBasedTag = tenantUtils?.getStatusBasedTagProps && tenantUtils.getStatusBasedTagProps(props?.status);
  const normalizedBookedDates = useMemo(() => normalizeBookedDateRanges(bookedDates), [bookedDates]);
  const bookingEndDate = useMemo(() => {
    const activeEnd = getActiveBookingEndDateString(normalizedBookedDates);
    if (activeEnd) return activeEnd;
    if (!normalizedBookedDates.length) return null;
    const ends = normalizedBookedDates.map((r) => dayjs(r.end_date)).filter((d) => d.isValid());
    return ends.length ? ends.reduce((a, b) => (a.isAfter(b) ? a : b)).format('YYYY-MM-DD') : null;
  }, [normalizedBookedDates]);
  const hasActiveBookingRange = useMemo(
    () => hasBookedRangeIncludingToday(normalizedBookedDates),
    [normalizedBookedDates],
  );
  const showBookedChip = Boolean(booked) || hasActiveBookingRange || normalizedBookedDates.length > 0;
  const handleClick = (e) => {
    e.stopPropagation();
    !disableDetailDrawer && listingDrawerRef?.current && listingDrawerRef.current.open(props?.id);
  };
  const rawListingPurposeTitle =
    tenantUtils.getLocalisedString(props?.purpose, 'title') || props?.purpose?.title;
  const lang = (i18n.language || '').toLowerCase();
  const isEn = lang === 'en' || lang.startsWith('en-');
  const listingPurposeTitle =
    isEn && String(rawListingPurposeTitle || '').trim().toLowerCase() === 'daily-rental'
      ? 'Daily Rental'
      : rawListingPurposeTitle;

  const locationBreadcrumb = isProject
    ? props?.location?.breadcrumbs
        ?.filter((e) => e?.level > 1)
        ?.map((e) => tenantUtils.getLocalisedString(e, 'title'))
        ?.join(', ')
    : props?.location?.breadcrumb;

  if (isProject) {
    return (
      <Group
        template="106px 1fr"
        gap=".571rem"
        onClick={(e) => e.stopPropagation()}
        style={{ marginBottom: '14px' }}
      >
        <Flex align="start" gap=".571rem">
          <Badge
            count={props?.imageCount}
            size="default"
            overflowCount={90}
            offset={!rtl && [-105, 0]}
            style={{ backgroundColor: '#00a651' }}
            shape="square"
            onClick={(e) => e.stopPropagation()}
          >
            <Thumbnail>
              {showBookedChip && (
                <Tooltip
                  title={
                    <TextWithIcon icon="InfoIcon" value={`${t('Booked Until')} ${getTimeDateString(bookingEndDate)}`} />
                  }
                >
                  <div
                    style={{
                      marginBottom: '4px',
                    }}
                  >
                    <ProductTag icon="BookedBadge" name={t('Booked')} tagBackgroundColor="#00A174" />
                  </div>
                </Tooltip>
              )}

              <Image
                onClick={handleClick}
                style={{ cursor: 'pointer' }}
                src={props?.images?.[0]?.sizes?.thumbnail}
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
                  <DiscountTag discount_percentage={discount_percentage} actualPriceDisplay={discountTagActualPriceDisplay} />
                </div>
              )}
            </Thumbnail>
          </Badge>
        </Flex>

        <Group className="fz-12 py-2" template="initial" gap="4px">
          <Space className="fz-14 fw-700" style={{ lineHeight: 1.2 }}>
            <span className="text-primary">
              {tenantUtils.getLocalisedString(props, 'title')}
            </span>
          </Space>
          <div>
            <TextWithIcon
              icon="Location"
              iconProps={{ size: '1.4em', color: tenantTheme.gray500 }}
              textColor={tenantTheme.gray700}
              value={locationBreadcrumb}
              style={{ maxWidth: '30ch' }}
            />
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              justifyContent: 'space-between',
            }}
          >
            {props?.total_units && (
              <TextWithIcon
                icon="AreaUnitIcon"
                iconProps={{ size: '1.4em', color: tenantTheme.gray500 }}
                textColor={tenantTheme.gray700}
                value={`${props.total_units} ${t('Units')}`}
              />
            )}
            {props?.under_construction ? (
              <ProductTag name={t('Under Construction')} tagBackgroundColor="rgba(131, 60, 138, 1)" />
            ) : (
              <ProductTag name={t('Ready')} tagBackgroundColor="#00a651" />
            )}
          </div>
        </Group>
        <ListingDrawer ref={listingDrawerRef} />
      </Group>
    );
  }

  return (
    <Group
      template="106px 1fr"
      gap=".571rem"
      onClick={(e) => e.stopPropagation()}
    >
      <Flex align="start" gap=".571rem">
        <Badge
          count={props?.imageCount}
          size="default"
          overflowCount={90}
          offset={!rtl && [-105, 0]}
          style={{ backgroundColor: '#00a651' }}
          shape="square"
          onClick={(e) => e.stopPropagation()}
        >
          <Thumbnail style={{ position: 'relative' }}>
            {showBookedChip && (
              <Tooltip
                title={
                  <TextWithIcon icon="InfoIcon" value={`${t('Booked Until')} ${getTimeDateString(bookingEndDate)}`} />
                }
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 6,
                    insetInlineStart: 10,
                    zIndex: 2,
                  }}
                >
                  <ProductTag icon="BookedBadge" name={t('Booked')} tagBackgroundColor="#00A174" />
                </div>
              </Tooltip>
            )}

            <Image
              onClick={handleClick}
              style={{ cursor: 'pointer' }}
              src={typeof props?.image === 'string' ? props.image : props?.image?.thumbnail}
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
                <DiscountTag discount_percentage={discount_percentage} actualPriceDisplay={discountTagActualPriceDisplay} />
              </div>
            )}
          </Thumbnail>
        </Badge>
      </Flex>

      <Group className="fz-12 py-2" template="initial" gap="4px">
        <Space className="fz-14 fw-700" style={{ lineHeight: 1.2 }}>
          <NumberDisplay className="text-primary" compact={false} type="price" {...price} />
          {props?.isDailyRental && (
            <span className="fw-500" style={{ color: tenantTheme['primary-color'] }}>
              {t('Night')}
            </span>
          )}
          {props?.isBadge && (
            <>
              <ProductTag
                {...tenantData.getTagProps(productsInfo)}
                iconProps={{ ...tenantData.getTagProps(productsInfo)?.iconProps, size: '1.2em' }}
              />
            </>
          )}
          {statusBasedTag && (
            <ProductTag
              {...statusBasedTag}
              iconProps={{ ...statusBasedTag?.iconProps, size: '10px', color: '#222' }}
              tagStyle={{ opacity: '0.5' }}
            />
          )}
          {showExternalLink && props?.url && (
            <LinkWithIcon as="a" icon={<IconSwitch />} href={props?.url} className="btnLink px-8" target="_blank" rel="noopener noreferrer" />
          )}
          {!hideHealthPopover && props.health && <TenantComponents.Health {...props.health} listingsData={props} />}
        </Space>
        <span>
          {props?.type?.title && listingPurposeTitle && (
            <Tag
              color={tenantTheme['primary-light-4']}
              style={{ '--tag-color': tenantTheme['primary-color'], fontWeight: '700' }}
            >
              {' '}
              {isOffPlan
                ? `${tenantUtils.getLocalisedString(props?.type, 'title')} | ${t(projectStatus)}  ${projectStatus != 'Ready' ? ' | ' + tenantUtils.getLocalisedString(saleType, 'label') : ''}`
                : `${tenantUtils.getLocalisedString(props?.type, 'title')} ${t('for')} ${listingPurposeTitle}${
                    tenantConstants.SHOW_COMPLETION_STATUS_FOR_SELL &&
                    props?.purpose?.slug === 'sale' &&
                    !!props?.completion_status
                      ? ` | ${t(projectStatus)}`
                      : ' '
                  }`}
            </Tag>
          )}
        </span>
        <Space wrap={true} gap="10px">
          {props?.details?.listingSpecs
            ?.filter((data) => {
              const v = data?.value;
              if (v == null || v === '') return false;
              if (typeof v === 'number') return v > 0;
              return true;
            })
            ?.map((e, index) => (
              <TextWithIcon
                key={index}
                icon={e?.icon}
                iconProps={e?.iconProps}
                textColor={e?.textColor}
                value={e?.value}
              />
            ))}
          <TextWithIcon
            icon="IconAreaSize"
            iconProps={{ size: '1.4em', color: tenantTheme.gray500 }}
            textColor={tenantTheme.gray700}
            value={`${props?.area?.value} ${listingAreaUnitShort}`}
          />
        </Space>
        <div>
          <div style={{ maxWidth: '30ch' }}>{locationBreadcrumb}</div>
        </div>
        <span className="fz-10">
          <Text className="text-muted fz-10">{tenantConstants.SHOW_REGA_DETAIL ? t('Bayut ID') : t('ID')}</Text>{' '}
          <Text className="text-primary fz-10">{props?.id}</Text>
          {tenantConstants.SHOW_REGA_DETAIL && (
            <>
              {props?.details?.regaId ? (
                <>
                  <Divider type="vertical" />
                  <Flex wrap={false} gap="2px" style={{ display: 'inline-flex' }}>
                    <Text className="text-muted fz-10">{t('REGA ID:')} </Text>
                    <Text className="text-primary inline-flex align-items-center fz-10" style={{ gap: 2 }}>
                      {props?.details?.regaId}
                      {props?.details?.regaExpiryDate && (
                        <Popover
                          content={
                            <>
                              {t('Expiring on')}: <strong>{getTimeDateString(props?.details?.regaExpiryDate)}</strong>
                            </>
                          }
                          action="hover"
                          getPopupContainer={() => document.body}
                        >
                          <>
                            <Icon icon="AiOutlineInfoCircle" color={tenantTheme.gray700} />
                          </>
                        </Popover>
                      )}
                    </Text>
                  </Flex>
                </>
              ) : props?.details?.permit_number ? (
                <>
                  <Divider type="vertical" style={{ marginInline: 4 }} />
                  <Text className="text-muted" style={{ fontSize: 10 }}>
                    {t('Permit No:')}{' '}
                  </Text>
                  <Text className="text-primary" style={{ fontSize: 10 }}>
                    {props?.details?.permit_number}
                  </Text>
                </>
              ) : (
                <>
                  <Divider type="vertical" />
                  <Tag shape="round" style={{ alignSelf: 'center', fontSize: 12, lineHeight: 'normal' }}>
                    {t('Unlicensed')}
                  </Tag>
                </>
              )}
            </>
          )}
        </span>
      </Group>
      <ListingDrawer ref={listingDrawerRef} />
    </Group>
  );
};
