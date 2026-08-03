import tenantTheme from '@theme';
import { Pagination, Table } from 'antd';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetLocation, useRouteNavigate } from '../../../hooks';
import { convertQueryObjToString, mapQueryStringToFilterObject } from '../../../utility/urlQuery';
import { EmptyListing, NetworkError } from '../../svg';
import EmptyState from '../EmptyState/EmptyState';
import Card from '../cards/Card';
import { TableList, TablePagination } from './style';
import cx from 'clsx';

const DataTable = (props) => {
  const {
    className,
    columns,
    data = [],
    pagination,
    showPagination,
    fetchData,
    noUrlPush,
    paginationOnBottom = false,
    loading,
    skeletonLoading,
    pageSize,
    onErrorRetry = () => {},
    tableClass,
    error,
    rowSelection,
    tabList,
    onChangeTab = () => {},
    activeTab,
    emptyState,
    disableTabsOnLoading = false,
    tableStyle,
    ...rest
  } = props;

  const navigate = useRouteNavigate();
  const { t, i18n } = useTranslation();
  const location = useGetLocation();
  // Translation Mapping for the titles
  const translateTitlesRecursive = (item) => {
    // if (item.title) {
    //   item.title = t(item.title);
    // } else if (item.label) {
    //   item.label = t(item.label);
    // }
    if (item.children && Array.isArray(item.children)) {
      item.children == item.children.map(translateTitlesRecursive);
    }
    return item;
  };

  const translatedColumns = useMemo(
    () => (columns ? columns.map((item) => translateTitlesRecursive(item)) : []),
    [columns, i18n.language],
  );

  const onShowSizeChange = (current, pageSize) => {
    fetchData({ current, pageSize });
  };

  const onHandleChange = (current, pageSize) => {
    if (noUrlPush) {
      fetchData({ page: current });
    } else {
      let searchParam = location.search;
      const { queryObj } = mapQueryStringToFilterObject(location.search);
      queryObj.page = current;
      // if (!!sorts) {
      //   Object.keys(queryObj).forEach(item => {
      //     if (item.includes('sort')) {
      //       delete queryObj[item];
      //     }
      //     queryObj['sorts[]'] = sorts;
      //   });
      // }
      searchParam = convertQueryObjToString({ ...queryObj });
      navigate({
        pathname: location.pathname,
        search: searchParam,
      });
    }
  };

  const renderPagination = () => {
    return (
      <TablePagination>
        {pagination && data.length ? (
          <Pagination
            onChange={onHandleChange}
            showSizeChanger={false}
            // onShowSizeChange={onShowSizeChange}
            pageSize={pagination?.pageCount || pageSize || 20}
            defaultCurrent={pagination?.current}
            current={pagination?.current}
            total={pagination?.totalCount}
          />
        ) : null}
      </TablePagination>
    );
  };

  const tablePagination = (pageSize) => {
    if (!pagination && showPagination && data.length) {
      return pageSize
        ? {
            pageSize: pageSize,
          }
        : true;
    }
    return false;
  };

  const renderEmptyState = () => {
    if (loading) return null;

    if (emptyState) {
      return (
        <EmptyState
          type="table"
          hideRetryButton
          message={emptyState.subtitle}
          title={emptyState.title}
          button={emptyState.button}
          illustration={<EmptyListing color={tenantTheme['primary-light-2']} />}
        />
      );
    }
    return <EmptyState type="table" hideRetryButton />;
  };

  return (
    <div>
      <TableList className={tableClass || 'mb-16'}>
        <div className="table-responsive">
          <Card
            tabList={tabList}
            onTabChange={onChangeTab}
            activeTabKey={activeTab}
            tabProps={{ size: 'middle', disabled: disableTabsOnLoading ? loading : false }}
            defaultActiveTabKey={Number(tabList?.[0]?.key)}
            style={tableStyle}
            {...rest}
          >
            {error ? (
              <EmptyState
                illustration={<NetworkError />}
                title={t('Error')}
                message={error}
                onClick={() => {
                  onErrorRetry();
                }}
                buttonLoading={loading}
              />
            ) : (
              <Table
                className={className}
                pagination={tablePagination(pageSize)}
                dataSource={data}
                columns={columns}
                loading={skeletonLoading || loading}
                rowClassName={cx(data.length ? 'tableHoverGradient' : '', (record) =>
                  record.hidden ? 'hidden-row' : record?.selected && 'no-highlight-row',
                )}
                locale={{
                  emptyText: renderEmptyState(),
                }}
                rowSelection={rowSelection}
                {...rest}
                scroll={{
                  x: 'max-content',
                }}
              />
            )}
          </Card>
        </div>
      </TableList>
      {paginationOnBottom && !error && data.length && pagination?.totalPages > 1 ? renderPagination() : null}
    </div>
  );
};

DataTable.propTypes = {
  className: PropTypes.string,
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  pagination: PropTypes.object,
  fetchData: PropTypes.func,
  noUrlPush: PropTypes.bool,
  paginationOnBottom: PropTypes.bool,
  loading: PropTypes.bool,
  skeletonLoading: PropTypes.bool,
};

export default DataTable;
