import tenantTheme from '@theme';
import { Tooltip } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';
import { Button, Icon } from '..';
import { HasVerifiedCheck } from './styled';
import { mlUpgradesEvent } from '../../../services/analyticsService';

const RenderUpgradeIcons = (props) => {
  const {
    selectedProduct,
    deductionType,
    actionStyles,
    listing,
    loading,
    index,
    onIconClick,
    disabled,
    toolTipTitle,
    hasVerifiedService,
    applyMediaQueries,
  } = props;
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const user = useSelector((state) => state.app.loginUser.user);

  return (
    <>
      <Tooltip placement="top" title={toolTipTitle}>
        <HasVerifiedCheck
          applyMediaQueries={applyMediaQueries}
          style={{ gridColumn: isMobile && listing.listingPlatformActions?.length === 1 && '-2 / -1' }}
        >
          <Button
            // style={{ '--ant-control-height': '30px' }}
            key={listing?.slug + index}
            shape="circle"
            icon={!!hasVerifiedService ? 'HiCheck' : selectedProduct.icon}
            iconSize={selectedProduct?.iconProps?.size}
            {...actionStyles}
            {...(!selectedProduct?.applied &&
              !!selectedProduct?.canApply && {
                onClick: () => {
                  mlUpgradesEvent(user, listing, selectedProduct);
                  onIconClick(deductionType, listing, selectedProduct);
                },
              })}
            loading={loading}
            disabled={disabled}
          />
          {selectedProduct?.applied && (
            <Icon
              className="icon icon-check icon-applied"
              icon="HiCheck"
              size={isMobile ? '1.2em' : '1em'}
              viewBox="-3 -3 26 26"
            />
          )}
          {selectedProduct?.pending && (
            <Icon
              className="icon icon-check "
              icon="RequestedStateIcon"
              iconProps={{ color: tenantTheme['warning-color'] }}
              size={isMobile ? '1.2em' : '1em'}
            />
          )}
        </HasVerifiedCheck>
      </Tooltip>
    </>
  );
};
export default RenderUpgradeIcons;
