import tenantConstants from '@constants';
import cx from 'clsx';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import BreakdownByAreaWidget from './BreakdownByAreaWidget';
import ListingBreakdown from './listing-breakdown/listing-breakdown';
import { ContainerWidgets } from './styled';

function ReportsListingsSection({ rootClassName, user, data, fetchWidgetData, section }) {
  const loggedInUser = useSelector((state) => state.app.loginUser.user);
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const platforms = useMemo(
    () => (user ? user?.platforms : loggedInUser?.platforms),
    [user?.platforms?.length, loggedInUser?.platforms?.length],
  );
  const isMultiPlatform = useMemo(() => platforms?.length > 1, [platforms?.length]);
  const selectedPlatform = useSelector((state) => state.app.sectionPlatform?.[section]);
  const isClickToggleSidebarEnabled = tenantConstants.PUSH_CONTENT_ON_SIDEBAR_EXPAND && !isMobile;

  const renderComponents = (platform) => {
    return (
      <ContainerWidgets
        className={cx(isClickToggleSidebarEnabled && 'reports-listings-section', rootClassName)}
        template={isMobile ? '1fr' : isClickToggleSidebarEnabled ? 'minmax(0, 40%) minmax(0, 1fr)' : '32% minmax(0, 1fr)'}
        gap={isMobile ? '16px' : isClickToggleSidebarEnabled ? 'clamp(8px, 1.5cqw, 16px)' : '16px'}
        key={platform?.key}
      >
        <div style={isClickToggleSidebarEnabled ? { minWidth: 0 } : undefined}>
          <ListingBreakdown
            brandColor={platform?.brandColor}
            linear
            trends={false}
            minHeight="calc(100% - 42px)"
            user={user ? user : loggedInUser}
            platform={platform?.slug}
            icon={isMultiPlatform && tenantConstants.MULTIPLATFROM_VIEW ? platform?.icon : null}
            showLink={false}
            fluidReportsLayout={isClickToggleSidebarEnabled}
            cardBodyStyle={
              isClickToggleSidebarEnabled
                ? {
                    height: '100%',
                    padding: isMobile
                      ? '16px 12px'
                      : 'clamp(12px, 2.2cqw, 30px) clamp(10px, 2.5cqw, 24px)',
                  }
                : { height: '100%' }
            }
          />
        </div>

        <div style={isClickToggleSidebarEnabled ? { minWidth: 0 } : undefined}>
          <BreakdownByAreaWidget
            icon={isMultiPlatform && tenantConstants.MULTIPLATFROM_VIEW && platform?.icon}
            user={user ? user : loggedInUser}
            platform={platform?.slug}
            fluidReportsLayout={isClickToggleSidebarEnabled}
          />
        </div>
      </ContainerWidgets>
    );
  };
  return (
    <>
      {isMultiPlatform && tenantConstants.MULTIPLATFROM_VIEW
        ? platforms?.map((platform) => renderComponents(platform))
        : renderComponents(selectedPlatform)}
    </>
  );
}

export default ReportsListingsSection;
