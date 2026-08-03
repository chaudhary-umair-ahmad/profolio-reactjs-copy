import { Row } from 'antd';
import cx from 'clsx';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useTableData } from '../../hooks';
import { DataTable, Filters, Flex, Group } from '../common';
import { Main } from '../container';
import { TitleStyled } from '../styled';

export const ListingContainer = (props) => {
  const {
    className,
    listingsData,
    listingApi,
    loading,
    enableFilters = true,
    title,
    actionBtn,
    renderTableTopRight,
    paginationOnBottom = true,
    pageSize,
    onRetry,
    showPagination,
    listingContainerStyle,
    renderFiltersAsTopRight,
    noUrlPush,
    error,
    rowSelection,
    onChangeTab,
    activeTab,
    emptyState,
    isMain = true,
    renderBanner = () => null,
    intialFilterCount,
    filtersList,
    disableTabsOnLoading,
    titleFontSize,
    skeletonLoading,
    renderTableExtra = () => null,
    renderFiltersExtra = () => null,
    extraRowProps,
    ...rest
  } = props;
  const [data, columns] = useTableData(listingsData?.list, listingsData?.table || [], [], extraRowProps);
  const { isMemberArea } = useSelector((state) => state?.app?.AppConfig);

  const fetchListingData = useCallback(
    (params) => {
      listingApi(params);
    },
    [listingApi],
  );

  const renderFilters = () => {
    return (
      <Flex compact align="center" gap="12px" width="auto" className="main-filter-container">
        {enableFilters && (
          <Filters
            list={filtersList || []}
            loading={loading}
            skeletonLoading={skeletonLoading}
            tabFilterKey={listingsData?.tabFilterKey}
            intialFilterCount={intialFilterCount}
            filterStyles={{ alignItems: 'end' }}
          >
            {({ renderTags, renderFiltersDesktop, isData }) =>
              isData && (
                <div>
                  {renderFiltersDesktop()}
                  {renderTags()}
                </div>
              )
            }
          </Filters>
        )}
        {renderFiltersExtra && renderFiltersExtra()}
      </Flex>
    );
  };

  const renderChild = () => {
    return (
      <>
        {title && (
          <Row align="middle" justify="space-between" className={cx('mb-8', className)}>
            <div className="py-8">
              <TitleStyled className="mb-0" style={{ '--font-size': titleFontSize, fontWeight: '600', color: '#222222' }}>
                {title}
              </TitleStyled>
            </div>
            {actionBtn && actionBtn}
          </Row>
        )}
        <Group gap="8px">
          {!renderFiltersAsTopRight && !isMemberArea && renderFilters()}
          <DataTable
            columns={columns}
            data={data}
            tabList={!renderFiltersAsTopRight && renderTableTopRight}
            activeTab={activeTab}
            onChangeTab={onChangeTab}
            pagination={listingsData?.pagination}
            paginationOnBottom={paginationOnBottom}
            fetchData={fetchListingData}
            loading={loading}
            error={error}
            onErrorRetry={onRetry}
            skeletonLoading={skeletonLoading}
            pageSize={pageSize}
            showPagination={showPagination}
            noUrlPush={noUrlPush}
            rowSelection={rowSelection}
            emptyState={emptyState}
            disableTabsOnLoading={disableTabsOnLoading}
            {...rest}
          />
        </Group>
      </>
    );
  };

  return isMain ? (
    <Main className={className} style={{ ...listingContainerStyle }} isMemberArea={isMemberArea}>
      {renderBanner()}
      {renderTableExtra()}
      {renderChild()}
    </Main>
  ) : (
    renderChild()
  );
};

ListingContainer.propTypes = {
  // className: PropTypes.string,
  // listingsData: PropTypes.object,
  listingApi: PropTypes.func,
  loading: PropTypes.bool,
  enableFilters: PropTypes.bool,
  title: PropTypes.string,
  actionBtn: PropTypes.node,
  // renderTableTopRight: PropTypes.func,
  paginationOnBottom: PropTypes.bool,
  pageSize: PropTypes.number,
  skeletonLoading: PropTypes.bool,
  onRetry: PropTypes.func,
  showPagination: PropTypes.bool,
  listingContainerStyle: PropTypes.object,
};
