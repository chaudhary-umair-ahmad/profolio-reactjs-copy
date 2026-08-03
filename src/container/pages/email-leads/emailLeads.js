import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ListingContainer } from '../../../components/listing-container/ListingContainer';
import { useGetLocation, usePageTitle } from '../../../hooks';
import { setEmailLeadsData } from '../../../redux/leadsSummary/actionCreator';
import { mapQueryStringToFilterObject } from '../../../utility/urlQuery';
import { EmailLeadsMobile } from './emailLeadsMobile';

const InboxContainer = ({ match }) => {
  const { t } = useTranslation();
  usePageTitle(t('Inbox - Profolio'));
  const dispatch = useDispatch();
  const user = useSelector((state) => state.app.loginUser.user);
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const { mailLeadsData } = useSelector((state) => state.LeadsSummary);
  const location = useGetLocation();
  const { queryObj } = mapQueryStringToFilterObject(location.search);
  const fetchEmailLeadsData = (page) => {
    user && dispatch(setEmailLeadsData(user, page));
  };

  useEffect(() => {
    fetchEmailLeadsData(queryObj?.page);
  }, [location.search]);

  return isMobile ? (
    <EmailLeadsMobile
      leadsData={mailLeadsData}
      loading={mailLeadsData?.loading}
      error={mailLeadsData?.error}
      pagination={mailLeadsData?.pagination}
      onRetry={fetchEmailLeadsData}
      listingApi={(params) => fetchEmailLeadsData(params)}
      pageSize={mailLeadsData?.pagination?.pageCount}
      showPagination={true}
    />
  ) : (
    <>
      <ListingContainer
        listingsData={mailLeadsData}
        loading={mailLeadsData?.loading}
        error={mailLeadsData?.error}
        onRetry={fetchEmailLeadsData}
        listingApi={(params) => fetchEmailLeadsData(params)}
        pageSize={mailLeadsData?.pagination?.pageCount}
        pagination={mailLeadsData?.pagination}
        showPagination
        enableFilters={false}
      />
    </>
  );
};
export default InboxContainer;
