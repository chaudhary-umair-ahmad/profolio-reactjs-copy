import TenantComponents from '@components';
import tenantData from '@data';
import tenantTheme from '@theme';
import tenantUtils from '@utils';
import { Badge, Row, Space, Typography } from 'antd';
import { t } from 'i18next';
import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import PlatformListing from '../../../../components/table/table-components/platform-listings';
import { getBaseURL } from '../../../../utility/env';
import { HealthContainer } from './styled';
import PlatformActions from './listing-platform-actions/platformActions';
import { TextWithIcon, Divider, Flex, Group, Image, Number, ProductTag, Tag } from '../../../../components/common';
import ListingDrawer from '../../../../components/listing-drawer/listingDrawer';
import { ListingCardStyled, Thumbnail } from '../../../../components/styled';

const { Text } = Typography;

const ListingCard = ({ item, disableDiv, selected, wrap, align }) => {
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const listingDrawerRef = useRef();
  const isDailyRentalListing = item?.purpose?.slug == 'daily-rental';
  const rtl = useSelector((state) => state.app.AppConfig.rtl);

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
            <Thumbnail>
              <Image
                onClick={handleClick}
                src={item?.image?.thumbnail}
                fallback={`${getBaseURL()}/profolio-assets/images/ph-listings.svg`}
              />
            </Thumbnail>
          </Badge>
          <Group template="initial" gap="4px">
            <Row align={align || 'middle'} wrap={wrap} style={{ flexWrap: 'wrap', gap: isMobile && '6px' }}>
              <Space className="mb-2" style={{ justifyContent: isMobile && 'space-between' }}>
                <div className="fz-14 fw-700" style={{ lineHeight: 1.2 }}>
                  <Number className="text-primary" compact={false} type="price" {...item?.property?.price} />
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
              <span>
                {item?.listing_type?.title && item?.listing_purpose?.title && (
                  <Tag
                    color={tenantTheme['primary-light-4']}
                    style={{ '--tag-color': tenantTheme['primary-color'], fontWeight: '700' }}
                  >
                    {`${tenantUtils.getLocalisedString(item?.listing_type, 'title')} ${t(`for ${item?.listing_purpose?.title}`)}`}
                  </Tag>
                )}
              </span>
              <HealthContainer style={{ alignItems: 'start' }}>
                <>
                  {item?.health && <TenantComponents.Health {...item?.health} listingsData={item?.property} isMobile />}
                </>
              </HealthContainer>
            </Row>
            <div>
              <Space size="large">
                {item?.beds > 0 && (
                  <TextWithIcon
                    icon="IconBedroom"
                    iconProps={{ size: '1.2em', color: tenantTheme.gray500 }}
                    value={`${item?.beds} ${t('Rooms')}`}
                  />
                )}
                {/* {item?.baths > 0 && (
                  <TextWithIcon
                    icon="IconBathroom"
                    iconProps={{ size: '1.2em', color: tenantTheme.gray500 }}
                    value={`${item?.baths} ${t('Baths')}`}
                  />
                )} */}
                <TextWithIcon
                  icon="IconAreaSize"
                  iconProps={{ size: '1.4em', color: tenantTheme.gray500 }}
                  value={`${item?.area_unit?.value} ${t('Sq. M.')}`}
                />
              </Space>
              <div>
                <TextWithIcon
                  align="center"
                  icon="MdLocationOn"
                  gap="6px"
                  iconProps={{ size: '12px', color: tenantTheme.gray500 }}
                  value={item?.location?.breadcrumb
                    ?.filter((e) => e?.level > 1)
                    ?.map((e) => tenantUtils.getLocalisedString(e, 'title'))
                    ?.join(', ')}
                  textStyle={{ lineHeight: 1 }}
                ></TextWithIcon>
              </div>
            </div>
            <span className="fz-10">
              <Text className="text-muted" style={{ fontSize: 10 }}>
                {t('ID')}
              </Text>{' '}
              <Text className="text-primary" style={{ fontSize: 10 }}>
                {item?.id}
              </Text>
            </span>
          </Group>

          {<ListingDrawer ref={listingDrawerRef} />}
        </Group>
        {isMobile && <Divider style={{ marginBlock: '16px' }} />}

        {item?.platforms?.bayut && <PlatformListing slug={'bayut'} {...item?.platforms} />}
        {item?.platforms?.dubizzle && <PlatformListing slug={'dubizzle'} {...item?.platforms} />}

        <Flex justify="space-between" gap="8px">
          <PlatformActions {...item?.platforms} />
          <TenantComponents.ListingsRowActions {...item?.platforms} />
        </Flex>
      </ListingCardStyled>
    </div>
  );
};

export default ListingCard;
