import { CardBarChart2, OverviewSalesCard } from './styled';
import { Icon, Number } from '../common';

import { Cards as Card } from '../common/cards/frame/cards-frame';
import PropTypes from 'prop-types';
import React from 'react';
import { SkeletonBody } from '../skeleton/Skeleton';

function CreditInfoCard(props) {
  const { icon, title, value, compact = false, iconColor, bodyStyle, iconSize, loading } = props;
  return (
    <Card bodyStyle={bodyStyle}>
      <OverviewSalesCard iconColor={iconColor}>
        <div className="icon-box box-secondary">
          {loading ? <SkeletonBody type="avatar" size="large" /> : <Icon icon={icon} size={iconSize} />}
        </div>
        <div className="card-chunk">
          <CardBarChart2>
            {loading ? (
              <SkeletonBody type="button" size="large" />
            ) : (
              <>
                <span>{title}</span>
                <h2>
                  <Number value={value} compact={compact} style={{ color: '#222' }} />
                </h2>
              </>
            )}
          </CardBarChart2>
        </div>
      </OverviewSalesCard>
    </Card>
  );
}

CreditInfoCard.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string,
  // value: PropTypes.string,
  compact: PropTypes.bool,
  iconColor: PropTypes.string,
  iconSize: PropTypes.string,
  loading: PropTypes.bool,
};

export default CreditInfoCard;
