import cx from 'clsx';
import { t } from 'i18next';
import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLazyGetLeadListingsQuery } from '../../../apis/lms';
import tenantConstants from '@constants';
import { Drawer, Flex, notification, Popover, Skeleton } from '../../common';
import { ListingCardDetail } from '../styled';
import { ListingPurpose } from './listing-purpose';
import { viewPropertiesLeadEvent } from '../../../services/analyticsService';
export const MorePropertiesPopover = ({ count, title, leadId, isDashboard = false }) => {
  const allInterestDrawerRef = useRef();
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const user = useSelector((state) => state.app.loginUser.user);
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [leadListings, setLeadListings] = useState([]);

  const [getLeadListings, { isLoading: loading }] = useLazyGetLeadListingsQuery();

  const getLeadActiveListings = async (leadId) => {
    const params = {};
    if (tenantConstants?.ENABLE_PROJECT_PARAM_IN_LEAD_LISTINGS) {
      params.is_project_enabled = true;
    }
    const response = await getLeadListings({ leadId, params });
    if (response) {
      if (response.error) {
        setPopoverVisible(false);
        notification.error(response.error);
      } else {
        setLeadListings(response?.data);
      }
    }
  };

  const onClickMore = (e) => {
    viewPropertiesLeadEvent(user, isDashboard, leadId);
    getLeadActiveListings(leadId);
    isMobile ? allInterestDrawerRef?.current?.openDrawer() : setPopoverVisible(true);
    e.stopPropagation();
  };

  const renderAllInterestsSkeleton = () => {
    return (
      <Flex vertical gap="8px">
        {[1, 2].map((_, i) => (
          <Flex key={i} justify="space-between" align="center" gap={'10px'}>
            <Skeleton style={{ height: '120px', width: '105px' }} />
            <Flex vertical gap="4px" style={{ width: '210px' }}>
              <Skeleton style={{ height: '35px', width: '100%' }} />
              <Skeleton style={{ height: '35px', width: '100%' }} />
              <Skeleton style={{ height: '35px', width: '100%' }} />
            </Flex>
          </Flex>
        ))}
      </Flex>
    );
  };

  const renderAllInterestsContent = () => {
    return (
      <>
        <ListingCardDetail className={cx('scroll-y card-hover')} style={{ '--box-height': !isMobile && '300px' }}>
          {leadListings?.map((item, i) => (
            <ListingPurpose key={i} disableDetailDrawer hideHealthPopover showExternalLink {...item} />
          ))}
        </ListingCardDetail>
      </>
    );
  };
  return (
    <>
      <span onClick={onClickMore} className="text-primary fz-12" style={{ width: 'max-content' }}>
        {title}
      </span>
      {isMobile ? (
        <Drawer
          ref={allInterestDrawerRef}
          headerStyle={{ alignItems: 'start', '--ant-font-weight-strong': 700 }}
          placement={'bottom'}
          title={`${count} ${t('interested properties')}`}
          stopPropagation
          style={{ '--ant-padding-lg': '16px' }}
          footer={null}
        >
          {loading ? renderAllInterestsSkeleton() : renderAllInterestsContent()}
        </Drawer>
      ) : (
        <Popover
          content={loading ? renderAllInterestsSkeleton() : renderAllInterestsContent()}
          action="click"
          open={popoverVisible}
          onOpenChange={(visible) => setPopoverVisible(visible)}
          getPopupContainer={() => document.body}
          stopPropagation
          className="listing-popover"
        />
      )}
    </>
  );
};
