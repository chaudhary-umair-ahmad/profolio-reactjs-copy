import tenantConstants from '@constants';
import tenantTheme from '@theme';
import { Divider, Row, Space } from 'antd';
import cx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Card, EmptyState, Group, LoaderWrapper, Number, TextWithIcon, Button, Flex } from '../../common';
import dotAnimation from '../../common/bayut.json';
import Statistic from '../../common/statistic';
import { ListingBreakdownWidgetSkeleton } from './listing-breakdown-skeleton';
import parentApi from '../../../store/parentApi';
import { useNavigate } from 'react-router-dom';
function ListingBreakdown(props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const {
    platform,
    brandColor,
    style,
    linear,
    icon,
    trends = true,
    cardBodyStyle,
    minHeight,
    user,
    showLink = true,
    fluidReportsLayout = false,
  } = props;

  const {
    data,
    isLoading: loading,
    isFetching,
    error,
    refetch: onErrorRetry,
  } = parentApi?.[`useGetListingsBreakdownWidgetDataFor${platform}Query`]?.(
    { ...(user?.id === -1 ? null : { [`q[user_id_eq]`]: user?.id?.toString() }) },
    {
      skip: !user?.id || !platform,
      refetchOnMountOrArgChange: true,
    },
  ) || {};
  const templateVar = Math.round((data?.[platform]?.purposes?.length + data?.[platform]?.products?.length) / 2);
  const renderListingCardTitle = () => {
    return (
      <TextWithIcon
        className={cx(isMobile ? 'fz-14' : 'fz-16')}
        title={t(data?.[platform]?.title)}
        icon={icon}
        fontWeight={700}
        loading={!data?.[platform] && loading}
        loadingProps={{ avatarSize: 24, rectSize: 'small' }}
        iconProps={{ iconBackgroundColor: '#fff', hasBackground: true }}
        style={isMobile ? { flexDirection: 'row' } : {}}
      />
    );
  };
  const renderCardExtraContent = () => {
    return (
      data?.[platform]?.link_data &&
      showLink && (
        <Button
          onClick={() => {
            navigate(data?.[platform]?.link_data.to);
          }}
          type="link"
          style={{ paddingRight: 0 }}
        >
          {t(data?.[platform]?.link_data.text)}
        </Button>
      )
    );
  };

  const renderTotalStatistic = () => (
    <Statistic
      title={t(data?.[platform]?.total_title)}
      icon={data?.[platform]?.total_title_icon}
      iconProps={{ color: tenantTheme['color-for-sale'], hasBackground: true }}
      formatter={<Number value={data?.[platform]?.total_value || 0} compact={false} />}
      value={data?.[platform]?.total_value || 0}
      titleFontSize={linear ? '13px' : '16px'}
      trends={trends}
    />
  );
  const renderPurposes = () => {
    const templateVar = Math.round((data?.[platform]?.purposes?.length + data?.[platform]?.products?.length) / 2 + 1);
    return (
      <Group
        template={
          isMobile
            ? 'repeat(3,1fr)'
            : `repeat(${templateVar}, ${fluidReportsLayout ? 'minmax(0, 1fr)' : '1fr'})`
        }
        gap={
          isMobile
            ? '24px 8px'
            : fluidReportsLayout
              ? 'clamp(4px, 1cqw, 14px) clamp(6px, 1.8cqw, 28px)'
              : '14px 28px'
        }
        style={{ height: '100%', alignItems: 'center' }}
      >
        <Statistic
          lottieOptions={{ width: 32, height: 32, animationData: dotAnimation }}
          title={t(data?.[platform]?.total_title)}
          formatter={
            <Number value={data?.[platform]?.total_value ? data?.[platform]?.total_value : 0} compact={false} />
          }
          value={data?.[platform]?.total_value ? data?.[platform]?.total_value : 0}
          leader
          className={cx(isMobile && 'span-all')}
          trends={trends}
          containerStyle={{
            ...(!isMobile && { gridRow: 'span 2', alignItems: 'center' }),
          }}
        />

        {data?.[platform]?.purposes?.map((item) => {
          return (
            <Statistic
              key={item?.id}
              icon={item?.icon}
              iconProps={{ ...item?.iconProps, hasBackground: true }}
              title={t(item?.title)}
              formatter={<Number value={item?.value ? item.value : 0} compact={false} />}
              value={item?.value ? item.value : 0}
              fontSize={fluidReportsLayout ? '1em' : '16px'}
              trends={trends}
            />
          );
        })}
        {data?.[platform]?.products?.map((item) => {
          return (
            <Statistic
              key={item?.id}
              icon={item?.icon}
              iconProps={{ ...item?.iconProps, hasBackground: true }}
              title={t(item?.title)}
              formatter={<Number value={item?.value ? item.value : 0} compact={false} />}
              value={item?.value ? item.value : 0}
              fontSize={fluidReportsLayout ? '1em' : '16px'}
              trends={trends}
            />
          );
        })}
      </Group>
    );
  };
  return (loading && isFetching) || !platform ? (
    <ListingBreakdownWidgetSkeleton isMobile={isMobile} style={style} />
  ) : error ? (
    <Card bodyStyle={{ padding: '16px 24px' }}>
      <EmptyState
        type="listings-count-dashboard"
        message={error}
        buttonLoading={loading}
        onClick={onErrorRetry}
        accentColor={brandColor}
      />
    </Card>
  ) : (
    <>
      <LoaderWrapper loading={!loading && isFetching}>
        <Card
          className="flex justify-content-center flex-grow"
          style={{
            '--primary-color': brandColor,
            minHeight: minHeight || 'calc(100% )',
            flexDirection: 'column',
            height: '100%',
            justifyContent: 'start',
            '--flex-direction': 'row',
            '--title-padding': '0px',
            // padding: '0 16px',
            ...style,
          }}
          headStyle={{
            borderBottom: 'none',
          }}
          bodyStyle={cardBodyStyle ? cardBodyStyle : { padding: isMobile ? '16px 12px' : '30px 24px' }}
          title={renderListingCardTitle()}
          extra={renderCardExtraContent()}
        >
          {linear ? (
            renderPurposes()
          ) : (
            <Flex align="center" gap={isMobile ? '20px' : '50px'}>
              <div>{renderTotalStatistic()}</div>
              <Divider type="vertical" style={{ height: 'auto', alignSelf: 'stretch', margin: 0 }} />
              <Flex vertical={!isMobile} gap={isMobile ? '24px' : '40px'} style={{ flex: 1 }}>
                <Group
                  template={isMobile ? 'initial' : `repeat(${templateVar}, 1fr)`}
                  gap={isMobile ? '12px 8px' : '30px 30px'}
                >
                  {data?.[platform]?.purposes?.map((item) => (
                    <Statistic
                      key={item?.id}
                      icon={item?.icon}
                      iconProps={{ ...item?.iconProps, hasBackground: true }}
                      title={t(item?.title)}
                      formatter={<Number value={item?.value || 0} compact={false} />}
                      value={item?.value || 0}
                      fontSize="13px"
                      trends={trends}
                    />
                  ))}
                </Group>
                <Group
                  template={isMobile ? 'initial' : `repeat(${templateVar}, 1fr)`}
                  gap={isMobile ? '12px 8px' : '30px 30px'}
                >
                  {data?.[platform]?.products?.map((item) => (
                    <Statistic
                      key={item?.id}
                      icon={item?.icon}
                      iconProps={{ ...item?.iconProps, hasBackground: true }}
                      title={t(item?.title)}
                      formatter={<Number value={item?.value || 0} compact={false} />}
                      value={item?.value || 0}
                      fontSize="13px"
                      trends={trends}
                    />
                  ))}
                </Group>
              </Flex>
            </Flex>
          )}
        </Card>
      </LoaderWrapper>
    </>
  );
}

ListingBreakdown.propTypes = {
  listingBreakdownData: PropTypes.object,
  loading: PropTypes.bool,
  brandColor: PropTypes.string,
  error: PropTypes.string,
  onErrorRetry: PropTypes.func,
  fluidReportsLayout: PropTypes.bool,
};

export default ListingBreakdown;
