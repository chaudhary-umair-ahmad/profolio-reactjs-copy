import tenantTheme from '@theme';
import tenantUtils from '@utils';
import { Badge, Divider, Row, Space, Typography } from 'antd';
import React, { useMemo, useRef } from 'react';
import TenantComponents from '@components';
import { Flex, Group, Icon, Image, Number, Popover, Tag, TextWithIcon } from '../../../../components/common';
import { ListingCardStyled, TenantList, Thumbnail } from '../../../../components/styled';
import { getTimeDateString } from '../../../../utility/date';
import { getBaseURL } from '../../../../utility/env';
import ListingDrawer from '../../../../components/listing-drawer/listingDrawer';

const { Text } = Typography;

const ListingCard = ({ item, disableDiv, selected, array }) => {
  const listingDrawerRef = useRef();
  const locationTitle = () =>
    useMemo(
      () =>
        item?.platforms?.location?.breadcrumb
          ?.filter((e) => e?.level > 1)
          ?.map((e) => tenantUtils.getLocalisedString(e, 'title'))
          ?.join(', '),
      [item],
    );

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
        <Group template="110px 1fr" gap=".571rem">
          <Badge
            count={item?.images_count}
            size="default"
            style={{ backgroundColor: '#00a651' }}
            overflowCount={90}
            offset={[-105, 0]}
            shape="square"
          >
            <Thumbnail>
              <Image
                src={item?.images?.[0]?.thumbnail}
                onClick={handleClick}
                wrapperStyle={{ borderRadius: 6, overflow: 'hidden' }}
                style={{ objectFit: 'cover', width: '100%', aspectRatio: '1' }}
                fallback={`${getBaseURL()}/profolio-assets/images/ph-listings.svg`}
              />
            </Thumbnail>
          </Badge>
          <Group template="initial" gap="4px">
            <Space className="mb-2">
              <Row align="middle" justify="space-between">
                <span className="fz-10">
                  <Text className="text-muted">ID:</Text> <Text className="text-primary">{item?.id}</Text>
                </span>
              </Row>
              {item?.health && <TenantComponents.Health {...item?.health} listingsData={item?.property} isMobile />}
            </Space>

            <div>
              <div className="fz-14 fw-700" style={{ lineHeight: 1.2 }}>
                <Number className="text-primary" compact={false} type="price" {...item?.property?.price} />
              </div>
              <div>{locationTitle()}</div>
            </div>
            <div>
              <div>
                <Tag
                  color={tenantTheme['primary-light-4']}
                  style={{ '--tag-color': tenantTheme['primary-color'], fontWeight: '700' }}
                >
                  {item?.platforms?.type?.title} {' for ' + item?.platforms?.purpose?.title}
                </Tag>
              </div>

              <Space size="large">
                {item?.beds > 0 && (
                  <TextWithIcon
                    icon="IconBedroom"
                    iconProps={{ size: '1.2em', color: tenantTheme.gray500 }}
                    value={item?.beds}
                  />
                )}
                {item?.baths > 0 && (
                  <TextWithIcon
                    icon="IconBathroom"
                    iconProps={{ size: '1.2em', color: tenantTheme.gray500 }}
                    value={item?.baths}
                  />
                )}
                <TextWithIcon
                  icon="IconAreaSize"
                  iconProps={{ size: '1.4em', color: tenantTheme.gray500 }}
                  value={`${item?.area?.value} ${item?.area?.unit}`}
                />
              </Space>
            </div>
          </Group>
          {<ListingDrawer ref={listingDrawerRef} />}
        </Group>
        {item?.platforms?.data?.map((platform) => (
          <React.Fragment key={platform?.slug}>
            <Divider style={{ marginBlock: 8 }} />
            <Flex gap="2px" vertical>
              <TenantList template="36% auto" gap="8px 4px" key={platform?.id}>
                <Flex align="center" gap="8px">
                  <Icon icon={platform.icon} size="1.6em" disabled={!platform.posted} />
                  <Tag color={platform?.status?.color} shape="round" size="12px">
                    {platform?.status?.label}
                    {platform?.status?.comments && (
                      <Popover placement="right" title="Comments" content={platform?.status?.comments} action="hover">
                        <Icon icon="AiOutlineInfoCircle" style={{ marginInlineStart: 5 }} color="#a3a3a3" />
                      </Popover>
                    )}
                  </Tag>
                </Flex>
                <Flex align="center" justify="end" style={{ textAlign: 'right' }}>
                  <TenantComponents.PlatformActions
                    data={item?.platforms.data.filter((e) => e.slug === platform.slug)}
                    location={item?.platforms?.location}
                    property_id={item?.platforms?.property_id}
                    purpose={item?.platforms.purpose}
                    type={item?.platforms?.type}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}
                    isMobile
                  />
                  <TenantComponents.ListingsRowActions
                    data={item?.platforms.data.filter((e) => e.slug == platform.slug)}
                    location={item?.platforms?.location}
                    property_id={item?.platforms?.property_id}
                    purpose={item?.platforms.purpose}
                    type={item?.platforms?.type}
                    isMobile
                  />
                </Flex>
              </TenantList>
              {platform?.posted_on && (
                <Row className="fz-10" justify="space-between" align="bottom">
                  <div>{!!array(platform).length && array(platform)?.reduce((prev, curr) => [prev, ' • ', curr])}</div>
                  <TextWithIcon
                    icon="PiClockCounterClockwiseBold"
                    iconProps={{ size: '1.2em', color: tenantTheme.gray500 }}
                    value={`Posted on ${getTimeDateString(platform.posted_on)}`}
                  />
                </Row>
              )}
            </Flex>
          </React.Fragment>
        ))}
      </ListingCardStyled>
    </div>
  );
};

export default ListingCard;
