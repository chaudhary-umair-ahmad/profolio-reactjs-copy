import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Divider, Tag, Typography } from 'antd';
import tenantConstants from '@constants';
import tenantTheme from '@theme';
import tenantUtils from '@utils';
import { Group, Image, Number, Icon, Popover } from '../../../../components/common';
import { getTimeDateString } from '../../../../utility/date';
import { getBaseURL } from '../../../../utility/env';
import { Thumbnail } from '../../../../components/styled';

const { Text } = Typography;

const ListingCard = ({ listing, isInDropdown = false, isSelected = false, onSelect }) => {
  const { t } = useTranslation();

  const listingLocationBreadcrumb =
    listing?.location?.breadcrumb
      ?.filter((e) => e?.level > 1)
      ?.map((e) => tenantUtils.getLocalisedString(e, 'title'))
      ?.join(', ') || listing?.location?.title;

  return (
    <Card
      key={listing.id}
      hoverable={false}
      onClick={() => isInDropdown && onSelect && onSelect(listing)}
      onMouseEnter={(e) => {
        if (isInDropdown && !isSelected) {
          e.currentTarget.style.backgroundColor = tenantTheme['primary-light-4'];
        }
      }}
      onMouseLeave={(e) => {
        if (isInDropdown && !isSelected) {
          e.currentTarget.style.backgroundColor = '';
        }
      }}
      style={{
        marginBottom: isInDropdown ? 8 : 0,
        cursor: isInDropdown ? 'pointer' : 'default',
        border: isInDropdown ? 'none' : undefined,
        backgroundColor: isInDropdown && isSelected ? tenantTheme['primary-light-4'] : undefined,
        boxShadow: 'none',
      }}
      bodyStyle={{ padding: isInDropdown ? 8 : 12 }}
    >
      <Group template="65.4px 1fr" gap=".571rem">
        <Thumbnail
          style={{
            width: '65.4px',
            height: '58px',
            borderRadius: '4.46px',
          }}
        >
          <Image
            src={listing?.image?.thumbnail}
            fallback={`${getBaseURL()}/profolio-assets/images/ph-listings.svg`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '4.46px',
            }}
          />
        </Thumbnail>
        <Group template="initial" gap="0px">
          <div
            className="fz-13 fw-700"
            style={{ lineHeight: 1.2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <Number
              className="text-primary"
              compact={false}
              type="price"
              value={listing?.price}
              currency={tenantConstants.CURRENCY}
            />
            {listing?.listing_type?.title && listing?.listing_purpose?.title && (
              <Tag
                style={{
                  padding: '4px 6px',
                  backgroundColor: '#F2FAFA',
                  color: '#006169',
                  fontSize: '10px',
                  fontWeight: 600,
                  border: 'none',
                  borderRadius: '6px',
                  margin: 0,
                  lineHeight: 1,
                }}
              >
                {`${tenantUtils.getLocalisedString(listing?.listing_type, 'title')} ${t('for ' + listing?.listing_purpose?.title)}`}
              </Tag>
            )}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              overflow: 'hidden',
            }}
          >
            <Icon icon="MdLocationOn" size="1.2em" color={tenantTheme.gray500} style={{ flexShrink: 0 }} />
            <span
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 1,
                WebkitBoxOrient: 'vertical',
                fontSize: '12px',
                fontWeight: 400,
                color: '#222222',
              }}
            >
              {listingLocationBreadcrumb}
            </span>
          </div>
          <span className="fz-11">
            <Text className="text-muted" style={{ fontSize: 11 }}>
              {t('Bayut ID:')}
            </Text>{' '}
            <Text className="text-primary" style={{ fontSize: 11 }}>
              {listing?.id}
            </Text>
            {listing?.ad_license && (
              <>
                <Divider type="vertical" style={{ marginInline: 4 }} />
                <Text className="text-muted" style={{ fontSize: 11 }}>
                  {t('REGA ID:')}{' '}
                </Text>
                <Text className="text-primary inline-flex align-items-center" style={{ fontSize: 11, gap: 4 }}>
                  {listing?.ad_license}
                  {(listing?.platforms?.ksa?.rega_expiry_date || listing?.rega_details?.license_info?.end_date) && (
                    <Popover
                      content={
                        <>
                          {t('Expiring on')}:{' '}
                          <strong>
                            {getTimeDateString(
                              listing?.platforms?.ksa?.rega_expiry_date ||
                                listing?.rega_details?.license_info?.end_date,
                            )}
                          </strong>
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
              </>
            )}
          </span>
        </Group>
      </Group>
    </Card>
  );
};

export default ListingCard;
