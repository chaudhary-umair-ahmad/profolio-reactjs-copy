import TenantComponents from '@components';
import tenantTheme from '@theme';
import { Pagination, Radio, Row, Space } from 'antd';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { strings } from '../../constants/strings';
import { useRouteNavigate } from '../../hooks';
import { Card, EmptyState, Group, Heading, Skeleton } from '../common';
import { RadioButtonStyled } from '../common/radio-button/styled';
import { Main } from '../container';

export const ListingContainerMobile = (props) => {
  const {
    listingsData,
    listingApi,
    tabList,
    activeTab,
    onChangeTab = () => {},
    pageSize,
    showPagination,
    renderFiltersAsTopRight,
    className,
    title,
    loading,
    setPageNumber,
  } = props;
  const { t, i18n } = useTranslation();
  const navigate = useRouteNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [previousReports, setpreviousReports] = useState(null);
  const handlePaginationChange = async (current, pageSize) => {
    setCurrentPage(current);
    setpreviousReports(listingsData);
    setPageNumber(current);
  };
  const renderPagination = () => {
    return showPagination && listingsData?.list && listingsData?.list?.length > 0 ? (
      <Pagination
        onChange={handlePaginationChange}
        showSizeChanger={false}
        pageSize={pageSize || 20}
        defaultCurrent={listingsData?.pagination?.current}
        current={listingsData?.pagination?.current}
        total={listingsData?.pagination?.totalCount}
      />
    ) : null;
  };
  const getReachData = (item) => {
    return [
      {
        title: 'Views',
        value: item?.views?.value,
        icon: 'IoMdEye',
        iconProps: {
          color: tenantTheme['secondary-color'],
        },
      },
      {
        title: 'Clicks',
        value: item?.clicks?.value,
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
        value: item?.calls?.value,
      },
      {
        title: 'WhatsApp',
        value: item?.whatsapp?.value,
      },
      {
        title: 'SMS',
        value: item?.sms?.value,
      },
      {
        title: 'Email',
        value: item?.emails?.value,
      },
    ];
  };

  const renderChild = () => {
    return (
      <>
        {title && (
          <Row align="bottom" justify="space-between">
            {loading ? (
              [1, 2, 3, 4, 5].map((_, i) => <Skeleton key={i} type="button" />)
            ) : (
              <Heading as="h6" className="fw-700 px-16">
                {title}
              </Heading>
            )}
          </Row>
        )}
      </>
    );
  };

  const renderCard = (item, disabled, i) => {
    const reachData = getReachData(item);
    const contactData = getContactData(item);
    return (
      <React.Fragment key={i}>
        <Card
          style={{
            ...(disabled && { pointerEvents: 'none', opacity: 0.4 }),
          }}
        >
          <TenantComponents.CardTrafficLeadsByDate
            reachData={reachData}
            contactData={contactData}
            item={item}
            index={i}
          />
        </Card>
      </React.Fragment>
    );
  };

  return (
    <>
      <Radio.Group value={activeTab} onChange={onChangeTab} className="px-16">
        {tabList?.map((e, i) => (
          <RadioButtonStyled key={i} value={e?.key}>
            <Space.Compact style={{ gap: 6 }}>{t(e?.tab)}</Space.Compact>
          </RadioButtonStyled>
        ))}
      </Radio.Group>
      <Main className={className}>
        {!listingsData?.loading && !!listingsData?.error ? (
          <EmptyState title={strings.error_} message={listingsData.error} buttonLoading={listingsData?.loading} />
        ) : (
          <>
            {renderChild()}
            <Group template="1fr" gap="8px">
              {!!listingsData?.loading && !listingsData?.error && !!listingsData?.list?.length
                ? previousReports?.list?.map((e, i) => renderCard(e, true, i))
                : listingsData?.list?.map((e, i) => renderCard(e, false, i))}
              <div className="px-8">{showPagination && renderPagination()}</div>
            </Group>
          </>
        )}
      </Main>
    </>
  );
};

ListingContainerMobile.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  loading: PropTypes.bool,
  listingsData: PropTypes.object,
  listingApi: PropTypes.func,
  pageSize: PropTypes.number,
  showPagination: PropTypes.bool,
};
