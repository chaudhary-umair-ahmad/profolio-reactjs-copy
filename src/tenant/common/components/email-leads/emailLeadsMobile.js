import cx from 'clsx';
import tenantTheme from '@theme';
import tenantConstants from '@constants';
import tenantUtils from '@utils';
import { Pagination, Row, Space, Typography } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, EmptyState, Flex, Group, Heading, Image, Skeleton, TextWithIcon } from '../../../../components/common';
import { CardCompact } from '../../../../components/common/cards/styled';
import RenderTextLtr from '../../../../components/render-text/render-text';
import { Thumbnail } from '../../../../components/styled';
import { ExpandableMessage } from '../../../../components/table/table-components/expandable-message';
import { getBaseURL } from '../../../../utility/env';
import { getTimeDateString } from '../../../../utility/date';
import { useSelector } from 'react-redux';
import PlatfromSwitch from '../../../../components/platform-switch/platform-switch';

const { Text } = Typography;

export const EmailLeadsMobile = (props) => {
  const { t } = useTranslation();
  const { leadsData, loading, pagination, showPagination, onRetry, listingApi } = props;
  const [currentPage, setCurrentPage] = useState(1);
  const user = useSelector((state) => state.app.loginUser.user);
  const isMultiPlatform = useMemo(() => user?.platforms?.length > 1, [user?.id]);

  const onHandleChange = async (current, pageSize) => {
    listingApi(current);
    setCurrentPage(current);
  };

  const renderPagination = () => {
    return pagination && leadsData?.list && leadsData?.list?.length > 0 ? (
      <Pagination
        onChange={onHandleChange}
        showSizeChanger={false}
        pageSize={pagination?.pageCount || 20}
        defaultCurrent={pagination?.current}
        current={pagination?.current}
        total={pagination?.totalCount}
      />
    ) : null;
  };
  const [isSticky, setIsSticky] = useState(false);

  const handleScroll = () => {
    window.scrollY > 8 ? !isSticky && setIsSticky(true) : setIsSticky(false);
  };

  const renderSwitch = () => {
    return (
      <Row
        className={cx('mb-8', 'px-16 fz-14')}
        align="middle"
        wrap={false}
        justify="space-between"
        style={{ gap: '40px' }}
      >
        <Heading as={'h5'}>{t('Inbox')}</Heading>

        <PlatfromSwitch
          size={'small'}
          section={'inbox'}
          platformSwitchStyle={{
            marginBlock: '8px',
            width: '100%',
            minWidth: '300px',
          }}
        />
      </Row>
    );
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const ListingCard = (props) => {
    return (
      <CardCompact as={Group} template="64px 1fr" gap=".571rem">
        <Thumbnail style={{ alignSelf: 'start', borderRadius: 3 }}>
          <Image src={props?.listingData?.image?.thumbnail} fallback={`${getBaseURL()}/images/ph-listings.svg`} />
        </Thumbnail>
        <Group className="fz-10 py-2" template="initial" gap="0px">
          <div>
            <Text className="text-muted">{t('Bayut ID:')}</Text>{' '}
            <Text className="text-primary">{props?.listingData?.id}</Text>
          </div>
          <div className="fz-12 fw-700 mb-4" style={{ justifySelf: 'start', lineHeight: 1.2 }}>
            {props?.listingData?.details?.listing_type && (
              <Text type="secondary">{`${tenantUtils.getLocalisedString(props?.listingData?.type, 'title')} ${t(
                'For',
              )} ${tenantUtils.getLocalisedString(props?.listingData?.purpose, 'title')}`}</Text>
            )}
          </div>
          <Space size="large">
            {props?.listingData?.details?.listingSpecs
              ?.filter((data) => data?.value > 0)
              ?.map((e, i) => (
                <TextWithIcon
                  key={i}
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
              value={`${props?.listingData?.area?.value} ${t('Sq. M.')}`}
              gap="4px"
            />
          </Space>
        </Group>
      </CardCompact>
    );
  };

  return (
    <div>
      {isMultiPlatform && !tenantConstants.MULTIPLATFROM_VIEW && renderSwitch()}
      {loading ? (
        <Group className="py-8" gap="8px">
          {[1, 2, 3].map((e) => (
            <Card key={e}>
              <Skeleton className="mb-8" type="paragraph" />
              <CardCompact as={Group} template="64px auto" gap=".571rem">
                <Skeleton type="image" active={false} style={{ aspectRatio: 1, maxWidth: '100%', maxHeight: 64 }} />
                <div>
                  <Skeleton type="button" style={{ height: 16, width: 120 }} />
                  <Skeleton type="button" style={{ height: 16, width: 180 }} />
                  <Flex gap="24px" style={{ marginBlockStart: 2 }}>
                    <Skeleton type="button" style={{ height: 16, width: 40 }} />
                    <Skeleton type="button" style={{ height: 16, width: 40 }} />
                  </Flex>
                </div>
              </CardCompact>
            </Card>
          ))}
        </Group>
      ) : !leadsData?.loading && !!leadsData?.error ? (
        <EmptyState title="" message={leadsData?.error} onClick={onRetry} buttonLoading={leadsData?.loading} />
      ) : leadsData?.list?.length ? (
        <Group gap="8px" className="py-8">
          {leadsData?.list?.map((item) => (
            <Card key={item?.id}>
              <Flex align="baseline" justify="space-between">
                <Heading className="mb-0" as="h6">
                  {item?.details?.name}
                </Heading>
                <small>
                  <Text className="text-muted">{getTimeDateString(item?.date?.value, item?.date?.format)}</Text>
                </small>
              </Flex>
              <Flex className="mb-8" as="small" align="center">
                <Text type="secondary">{item?.details?.email}</Text>
                <span className="px-4" style={{ color: tenantTheme['primary-light-3'] }}>
                  &bull;
                </span>
                <Text type="secondary">{<RenderTextLtr text={item?.details?.phone} />}</Text>
              </Flex>
              <div className="mb-4 fz-12">
                <ExpandableMessage message={item?.emailBody?.message} />
              </div>
              <ListingCard listingData={item?.enquiry_about} />
            </Card>
          ))}
          <div className="px-8">{showPagination && renderPagination()}</div>
        </Group>
      ) : (
        <EmptyState type={'table'} hideRetryButton />
      )}
    </div>
  );
};
