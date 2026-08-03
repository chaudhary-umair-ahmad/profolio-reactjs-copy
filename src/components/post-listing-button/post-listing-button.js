import tenantRoutes from '@routes';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useRouteNavigate } from '../../hooks';
import { Button } from '../common/button/button';

const PostListingButton = () => {
  const { t } = useTranslation();
  const navigate = useRouteNavigate();

  return (
    <Button
      type="primary"
      icon="MdOutlineAddLocationAlt"
      onClick={() => {
        navigate(tenantRoutes.app().post_listing.path);
      }}
    >
      {t('Post Listing')}
    </Button>
  );
};

export default PostListingButton;
