import tenantData from '@data';
import tenantTheme from '@theme';
import tenantUtils from '@utils';
import { Divider, Pagination, Row, Space, Typography } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Group, Image, Number, ProductTag, TextWithIcon } from '../../../../components/common';
import { Thumbnail } from '../../../../components/styled';
import { getBaseURL } from '../../../../utility/env';
import CardTrafficLeadsByDate from './CardTrafficLeadsByDate';

const { Text } = Typography;

const CardListingPerformance = ({ tableData, disabled, setPage }) => {
  const { t } = useTranslation();

  const handlePaginationChange = async (current) => {
    setPage(current);
  };
  const renderPagination = () => {
    return tableData?.pagination && tableData?.list && tableData?.list?.length > 0 ? (
      <Pagination
        onChange={handlePaginationChange}
        showSizeChanger={false}
        pageSize={tableData?.pagination?.pageCount || 20}
        defaultCurrent={tableData?.pagination?.current}
        current={tableData?.pagination?.current}
        total={tableData?.pagination?.totalCount}
      />
    ) : null;
  };

  const getReachData = (item) => {
    return [
      {
        title: 'Views',
        value: item?.sum_search_count,
        icon: 'IoMdEye',
        iconProps: {
          color: tenantTheme['secondary-color'],
        },
      },
      {
        title: 'Clicks',
        value: item?.sum_view_count,
        icon: 'HiCursorClick',
        iconProps: {
          color: tenantTheme['color-clicks'],
        },
      },
    ];
  };
  const getContactData = (item) => {
    return [
      {
        title: 'Calls',
        value: item?.sum_phone_view_count,
      },
      {
        title: 'WhatsApp',
        value: item?.sum_whatsapp_view_count,
      },
      {
        title: 'SMS',
        value: item?.sum_sms_view_count,
      },
      {
        title: 'Email',
        value: item?.sum_email_lead_count,
      },
    ];
  };
  return (
    <div>
      <Group
        className="mb-8"
        gap="6px"
        style={{
          ...(disabled && { pointerEvents: 'none', opacity: 0.4 }),
        }}
      >
        {tableData?.list?.map((e, i) => {
          const item = { ...e };
          const reachData = getReachData(item?.platforms?.stats);
          const contactData = getContactData(item?.platforms?.stats);
          item.leads = { value: item?.platforms?.stats?.sum_lead_count };
          item.date = { value: item?.platforms?.data[0]?.posted_on };

          const { productsInfo = {} } = item?.property;
          const getTagProps = () => {
            if (productsInfo?.['signature-listing']?.is_applied) {
              return tenantData.getListingActions('signature-listing');
            }
            if (productsInfo?.['hot-listing']?.is_applied) {
              return tenantData.getListingActions('hot-listing');
            }
            return tenantData.getListingActions('basic-listing');
          };

          return (
            <Card key={i}>
              <Group className="mb-8" template="82px 1fr" gap=".571rem">
                <Thumbnail style={{ alignSelf: 'start' }}>
                  <Image
                    src={item?.property?.image?.thumbnail}
                    fallback={`${getBaseURL()}/profolio-assets/images/ph-listings.svg`}
                  />
                </Thumbnail>
                <Group className="fz-12 py-2" template="initial" gap="2px">
                  <Row className="fw-700" align="middle" justify="space-between" style={{ lineHeight: 1.2 }}>
                    <Number
                      className="text-primary"
                      compact={false}
                      type="price"
                      value={item?.property?.price?.value}
                    />
                    {productsInfo?.['basic-listing']?.is_applied && (
                      <ProductTag {...getTagProps()} iconProps={{ ...getTagProps().iconProps }} />
                    )}
                  </Row>
                  <div>{item?.property?.location?.breadcrumb}</div>
                  <span>
                    {item?.listing_type && (
                      <Text type="secondary">{`${tenantUtils.getLocalisedString(item?.listing_type, 'title')} ${t(
                        'for',
                      )} ${tenantUtils.getLocalisedString(item?.listing_purpose, 'title')}`}</Text>
                    )}
                  </span>
                  <Space size="large">
                    {item?.beds > 0 && (
                      <TextWithIcon
                        icon="IconBedroom"
                        iconProps={{ size: '1.2em', color: tenantTheme.gray500 }}
                        textColor={tenantTheme.gray700}
                        value={`${item?.beds} ${t('Beds')}`}
                      />
                    )}
                    <TextWithIcon
                      icon="IconAreaSize"
                      iconProps={{ size: '1.4em', color: tenantTheme.gray500 }}
                      textColor={tenantTheme.gray700}
                      value={`${item?.property?.area?.value} Sq. M.`}
                    />
                  </Space>
                </Group>
              </Group>
              <Divider style={{ margin: '0 -12px 8px', width: 'calc(100% + 24px)' }} />
              <CardTrafficLeadsByDate item={item} reachData={reachData} contactData={contactData} />
            </Card>
          );
        })}
      </Group>
      <div className="px-8">{tableData?.pagination && renderPagination()}</div>
    </div>
  );
};

export default CardListingPerformance;
