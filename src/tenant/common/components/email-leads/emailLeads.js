import tenantConstants from '@constants';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { ListingContainer } from '../../../../components/listing-container/ListingContainer';
import { usePageTitle } from '../../../../hooks';
import { EmailLeadsMobile } from './emailLeadsMobile';
import { useGetEmailLeadsQuery } from '../../../../apis/lms';
import PlatfromSwitch from '../../../../components/platform-switch/platform-switch';
import { Flex, Heading } from '../../../../components/common';

const InboxContainer = () => {
  const { t } = useTranslation();
  usePageTitle(t('Inbox - Profolio'));
  const user = useSelector((state) => state.app.loginUser.user);
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const selectedPlatform = useSelector((state) => state.app.sectionPlatform?.inbox);
  const isMultiPlatform = useMemo(() => user?.platforms?.length > 1, [user?.id]);
  const [page, setPage] = useState(1);
  const {
    data: mailLeadsData,
    error,
    isLoading: loading,
    isFetching,
    refetch,
  } = useGetEmailLeadsQuery(
    { platform: selectedPlatform?.id, page: page },
    { skip: !selectedPlatform?.slug, refetchOnMountOrArgChange: true },
  );

  const renderSwitch = () => {
    return (
      <Flex justify={'space-between'} className="mb-12">
        <Heading as={'h2'}>{t('Inbox')}</Heading>
        {isMultiPlatform && !tenantConstants.MULTIPLATFROM_VIEW && <PlatfromSwitch section={'inbox'} />}
      </Flex>
    );
  };
  const refetchLeads = (params) => {
    setPage(params?.page ? params?.page : params);
  };
  return (
    <>
      {isMobile ? (
        <EmailLeadsMobile
          leadsData={mailLeadsData}
          loading={loading || isFetching}
          error={error}
          pagination={mailLeadsData?.pagination}
          onRetry={refetch}
          listingApi={refetchLeads}
          pageSize={mailLeadsData?.pagination?.pageCount}
          showPagination={true}
        />
      ) : (
        <>
          <ListingContainer
            listingsData={mailLeadsData}
            loading={loading || isFetching}
            error={error}
            onRetry={refetch}
            listingApi={refetchLeads}
            pageSize={mailLeadsData?.pagination?.pageCount}
            pagination={mailLeadsData?.pagination}
            showPagination
            enableFilters={false}
            renderTableExtra={renderSwitch}
            noUrlPush
          />
        </>
      )}
    </>
  );
};
export default InboxContainer;
