import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import { DataTable, Filters, Group } from '../../../../components/common';
import { useTableData } from '../../../../hooks';
import { Main } from '../../../../container/styled';
import { Row } from 'antd';
import { TitleStyled } from '../../../../components/styled';
import cx from 'clsx';

export const MyListingContainer = (props) => {
  const {
    className,
    listingsData,
    loading,
    tableTabs,
    onRetry,
    showPagination,
    listingContainerStyle,
    error,
    onChangeTab,
    activeTab,
    emptyState,
    filtersList,
    skeletonLoading,
    title,
    renderBanner = () => null,
    ...rest
  } = props;
  const [data, columns] = useTableData(listingsData?.list, listingsData?.table || [], []);
  const { isMemberArea } = useSelector((state) => state?.app?.AppConfig);

  const renderFilters = () => {
    return (
      filtersList?.length && (
        <Filters
          list={filtersList || []}
          loading={loading}
          skeletonLoading={skeletonLoading}
          tabFilterKey={listingsData?.tabFilterKey}
          filterStyles={{ alignItems: 'end' }}
        ></Filters>
      )
    );
  };

  return (
    <Main className={className} style={{ ...listingContainerStyle }} isMemberArea={isMemberArea}>
      <>
        <Group gap="8px">
          {isMemberArea && renderBanner()}
          {isMemberArea && title && (
            <Row align="middle" justify="space-between" className={cx('mb-8', className)}>
              <div className="py-8">
                <TitleStyled className="mb-0" strong>
                  {title}
                </TitleStyled>
              </div>
            </Row>
          )}
          {!isMemberArea && renderFilters()}
          <DataTable
            columns={columns}
            showHeader={false}
            data={data}
            tabList={tableTabs}
            activeTab={activeTab}
            onChangeTab={onChangeTab}
            pagination={listingsData?.pagination}
            paginationOnBottom={true}
            loading={loading}
            error={error}
            onErrorRetry={onRetry}
            skeletonLoading={skeletonLoading}
            pageSize={10}
            showPagination={showPagination}
            emptyState={emptyState}
            disableTabsOnLoading={true}
            {...rest}
          />
        </Group>
      </>
    </Main>
  );
};

MyListingContainer.propTypes = {
  className: PropTypes.string,
  listingsData: PropTypes.object,
  loading: PropTypes.bool,
  actionBtn: PropTypes.node,
  paginationOnBottom: PropTypes.bool,
  pageSize: PropTypes.number,
  skeletonLoading: PropTypes.bool,
  onRetry: PropTypes.func,
  showPagination: PropTypes.bool,
  listingContainerStyle: PropTypes.object,
};
