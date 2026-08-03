import tenantRoutes from '@routes';
import tenantTheme from '@theme';
import { Col, Divider, Pagination, Row } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { strings } from '../../constants/strings';
import { useGetLocation, useLongPress, useRouteNavigate } from '../../hooks';
import { convertQueryObjToString, mapQueryStringToFilterObject } from '../../utility/urlQuery';
import { Button, Card, EmptyState, Filters, Group, Heading, LinkWithIcon, Skeleton, TextWithIcon } from '../common';
import { ListingCard } from '../listing-card/ListingCard';

export const ListingCardContainer = (props) => {
  const {
    listingsData,
    loading,
    skeletonLoading,
    renderTableTopRight,
    pagination,
    showPagination,
    renderFiltersAsTopRight,
    showAllLink,
    selectedListings,
    setSelectedListings,
    emptyState,
    renderBanner = () => null,
    filtersList,
  } = props;
  const { t } = useTranslation();
  const { isMemberArea } = useSelector((state) => state.app.AppConfig);
  const navigate = useRouteNavigate();
  const location = useGetLocation();
  const filterRef = useRef();
  const stickyRef = useRef();
  const [currentPage, setCurrentPage] = useState(1);
  const [addOnSelectAll, setAddOnSelectAll] = useState(true);

  const onLongPress = (id) => {
    if (location.pathname === '/listings') {
      const alreadySelected = selectedListings?.find((it) => it?.id === id);
      const listing = listingsData?.list?.find((e) => e?.id === id);
      if (alreadySelected) {
        setAddOnSelectAll(true);
        setSelectedListings({ listings: listing, selected: !alreadySelected, multiple: false });
      } else {
        setSelectedListings({
          listings: { ...listing, listingOwner: listing?.user },
          selected: !alreadySelected,
          multiple: false,
        });
      }
    }
  };

  const longPressEvent = useLongPress(onLongPress);

  const onHandleChange = async (current, pageSize) => {
    setCurrentPage(current);
    let searchParam = location.search;
    const { queryObj } = mapQueryStringToFilterObject(location.search);
    queryObj.page = current;
    searchParam = convertQueryObjToString({ ...queryObj });
    navigate({
      pathname: location.pathname,
      search: searchParam,
    });
  };

  const renderPagination = () => {
    return pagination && listingsData?.list && listingsData?.list?.length > 0 ? (
      <Pagination
        className="pagination"
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
    window.scrollY >= stickyRef?.current?.offsetTop ? !isSticky && setIsSticky(true) : setIsSticky(false);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [stickyRef?.current]);

  useEffect(() => {
    let allSelected = true;
    selectedListings?.length &&
      listingsData?.list?.length &&
      listingsData?.list?.forEach((e) => {
        const index = selectedListings?.findIndex((it) => it?.id === e?.id);
        if (index === -1) {
          allSelected = false;
        }
      });
    selectedListings?.length ? setAddOnSelectAll(!allSelected) : setAddOnSelectAll(true);
  }, [listingsData?.list]);

  const stickyElmStyles = { top: 0, paddingBlock: 0 };

  const showFilters = () => {
    return (
      <div
        className={`stickyFilter ${isSticky ? 'sticky' : ''}`}
        style={isMemberArea ? { ...stickyElmStyles } : {}}
        ref={stickyRef}
      >
        {!isMemberArea && (
          <Filters
            list={filtersList || []}
            // dependentFields={filtersData?.dependentFields}
            loading={loading}
            ref={filterRef}
            applyOnClick
            showAllFilters
            showFiltersOnly
            isMobile
            tabFilterKey={listingsData?.tabFilterKey}
          >
            {({ renderTags, renderFiltersMobile, isData }) =>
              isData && (
                <>
                  <Row justify="space-between" align="middle">
                    <Heading className="mb-0" as="h5">
                      {t('All Listings')}
                    </Heading>
                    {renderFiltersMobile()}
                  </Row>
                  <Group className="filters-scrollable mb-8">{renderTags()}</Group>
                </>
              )
            }
          </Filters>
        )}
        {renderTableTopRight()}
      </div>
    );
  };

  const showAllListingLink = () => {
    return (
      <LinkWithIcon
        linkTitle={t('View All Listings')}
        link={tenantRoutes.app().listings.path}
        color={tenantTheme.gray700}
        iconColor="var(--primary-color)"
      />
    );
  };

  const renderSelectAllButton = () => {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          transparented
          block={false}
          style={{ backgroundColor: '#f4f5f7' }}
          onClick={() => {
            const newSelectedListings = [];
            if (addOnSelectAll) {
              listingsData?.list?.forEach((e) => {
                if (!selectedListings?.find((it) => it?.id == e?.id)) {
                  newSelectedListings?.push({ ...e, listingOwner: e?.user });
                }
              });
              setSelectedListings({ listings: newSelectedListings, selected: true, multiple: true });
            } else {
              const listings = listingsData?.list?.map((e) => ({ ...e, listingOwner: e?.user }));
              setSelectedListings({ listings, selected: false, multiple: true });
            }

            setAddOnSelectAll((prev) => !prev);
          }}
        >
          {addOnSelectAll ? 'Select All' : 'DeSelect All'}
        </Button>
      </div>
    );
  };

  return (
    <>
      {skeletonLoading ? (
        <ListingCardContainerSkeleton tags />
      ) : !listingsData?.loading && !!listingsData?.error ? (
        <EmptyState
          title={strings.error_}
          length
          message={listingsData.error}
          onClick={() => {
            onHandleChange(currentPage);
          }}
          buttonLoading={listingsData?.loading}
        />
      ) : (
        <>
          {!!showAllLink && (
            <Row className="px-16 mb-8" justify="space-between">
              <TextWithIcon title={t('Recent Listings')} textColor={tenantTheme['base-color']} fontWeight={700} />
              {showAllListingLink()}
            </Row>
          )}
          <Group gap="8px">
            {renderBanner()}
            {renderFiltersAsTopRight ? showFilters() : null}
            {/* {location.pathname === '/listings' && renderSelectAllButton()} */}
            {!listingsData?.list?.length && !listingsData?.loading && !listingsData?.error && (
              <EmptyState
                type="table"
                hideRetryButton
                message={emptyState.subtitle}
                title={emptyState.title}
                button={emptyState.button}
                illustration={emptyState.illustration}
              />
            )}
            {!!listingsData?.loading && !listingsData?.error && !listingsData?.list?.length && <ListingCardSkeleton />}
            {!!listingsData?.loading && !listingsData?.error && !!listingsData?.list?.length
              ? listingsData?.list?.map((listing) => (
                  // {...longPressEvent?.handlers} removed only form Ksa. Pending for  update
                  <div key={listing?.id} id={listing?.id}>
                    <ListingCard
                      item={listing}
                      disableDiv
                      selected={!!selectedListings?.find((e) => e?.id === listing?.id)}
                    />
                  </div>
                ))
              : listingsData?.list?.map((listing) => (
                  // {...longPressEvent?.handlers}removed only form Ksa. Pending for  update
                  <div key={listing.id} id={listing.id}>
                    <ListingCard
                      style={{ alignItems: 'start' }}
                      wrap={false}
                      align="start"
                      item={listing}
                      key={listing?.id}
                      selected={!!selectedListings?.find((e) => e?.id === listing?.id)}
                    />
                  </div>
                ))}
            <div className="px-8">{showPagination && renderPagination()}</div>
          </Group>
        </>
      )}
    </>
  );
};

const ListingCardSkeleton = () => (
  <Card>
    <Group template="106px 1fr" gap=".571rem">
      <Skeleton type="image" active={false} style={{ borderRadius: 6, width: '100%', height: '100%' }} />
      <Group template="initial" gap="4px">
        <Skeleton type="paragraph" />
      </Group>
    </Group>
    <Divider style={{ marginBlock: 8 }} />
    <Row align="middle" justify="space-between">
      <div>
        <Skeleton style={{ height: 14 }} />
        <div>
          <Skeleton style={{ width: 106, height: 20 }} />
        </div>
      </div>
      <Group template="repeat(5, 1fr)" gap="4px">
        {[1, 2, 3, 4, 5].map((_, i) => {
          return <Skeleton key={i} type="avatar" active={false} />;
        })}
      </Group>
    </Row>
  </Card>
);

const ListingCardContainerSkeleton = ({ tags }) => {
  return (
    <>
      {!!tags && (
        <div className="px-4 py-8">
          <Row justify="space-between">
            <Skeleton type="button" style={{ width: 160 }} />
          </Row>
          <Row>
            {[1, 2, 3, 4, 5].map((_, index) => (
              <Col key={index} style={{ width: '20%', marginTop: '16px' }}>
                <Skeleton type="button" />
              </Col>
            ))}
          </Row>
        </div>
      )}
      <Group gap="8px">
        {[1, 2, 3].map((_, i) => (
          <ListingCardSkeleton key={i} />
        ))}
      </Group>
    </>
  );
};
