import tenantApi from '@api';
import { Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { EmptyState, JSONForm, Spinner } from '../../../components/common';
import { useGetParams } from '../../../hooks';
import TenantComponents from '@components';
import { Main } from '../../styled';
import { pageViewPostListingsDetailEvent } from '../../../services/analyticsService';
import { useLazyGetListingDetailQuery } from '../../../apis/postlisting';

function PostListing(props) {
  const [formData, setFormData] = useState({});
  const [fetchloading, setFetchLoading] = useState(false);
  const [retryLoading, setRetryLoading] = useState(false);
  const [error, setError] = useState('');
  const params = useGetParams();
  const listingId = params?.id;
  const { user } = useSelector((state) => state.app.loginUser);

  const PostListingPage = TenantComponents.PostListingPage;
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);

  const [getListingDetail] = useLazyGetListingDetailQuery();

  useEffect(() => {
    pageViewPostListingsDetailEvent(user, !listingId);
  }, []);

  useEffect(() => {
    listingId && fetchData();
  }, [listingId]);

  const fetchData = async () => {
    setFetchLoading(true);
    const listingDataResponse = await getListingDetail({ listingId, user: null });
    if (listingDataResponse) {
      setFetchLoading(false);
      if (listingDataResponse?.error) {
        setError(listingDataResponse?.error);
      } else {
        if (listingDataResponse?.data) {
          setFormData({ ...listingDataResponse?.data });
        }
      }
    }
  };

  const fetchAfterError = () => {
    setRetryLoading(true);
    !!error && fetchData();
    setRetryLoading(false);
  };

  return (
    <Main style={{ paddingBlock: isMobile ? 4 : 16 }}>
      {!!user?.loading ? (
        <Spinner type="full" />
      ) : !!user?.error || !!error ? (
        <EmptyState
          title={'Error'}
          message={!!error ? error : user?.error}
          buttonLoading={fetchloading || retryLoading}
          onClick={() => {
            fetchAfterError();
          }}
        />
      ) : (
        <>
          <Row align="center">
            <Col md={20} xxl={18}>
              {PostListingPage ? (
                <PostListingPage
                  loading={fetchloading}
                  formData={formData}
                  isMobile={isMobile}
                  forUpdate={!!listingId}
                  handleMagicAdPost={props?.handleMagicAdPost}
                />
              ) : (
                <JSONForm
                  fields={formData?.formFields}
                  fieldsSections={formData?.fieldsSections}
                  onSubmit={onSubmit}
                  dependentFields={formData.dependentFields}
                />
              )}
            </Col>
          </Row>
        </>
      )}
    </Main>
  );
}

export default PostListing;
