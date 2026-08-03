import React from 'react';
import TenantComponents from '@components';
import PostListing from './post-listing';

const PostListingLandingPage = () => {
  return TenantComponents.PostListingWithPropertyType ? (
    <TenantComponents.PostListingWithPropertyType />
  ) : (
    <PostListing />
  );
};

export default PostListingLandingPage;
