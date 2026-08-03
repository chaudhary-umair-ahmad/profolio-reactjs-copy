import tenantTheme from '@theme';
import { Space } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import { formatNumberString } from '../../../utility/utility';
import { SkeletonBody } from '../../skeleton/Skeleton';
import Icon from '../icon/icon';
import { IconStyled } from '../icon/IconStyled';
import { Text } from '../textWithIcon/styled';
import TextWithIcon from '../textWithIcon/textWithIcon';
import { ExList2, Value } from './style';

function StatsWithPercentage(props) {
  const { title, icon, iconProps, value, percentage, growth, unit, since_when, lead, loading, ...rest } = props;

  const renderTrend = () => {
    return (
      percentage && (
        <small>
          <span style={{ minHeight: 19 }} className={growth === false ? 'growth-downward' : ''}>
            {percentage === null ? (
              <p>–</p>
            ) : percentage === 0 ? (
              <p></p>
            ) : (
              percentage && (
                <>
                  <Icon
                    size="1em"
                    icon={growth ? 'HiArrowUp' : 'HiArrowDown'}
                    color={growth ? tenantTheme['success-color'] : tenantTheme['danger-color']}
                  />
                  {Math.abs(percentage)?.toFixed(0)}%
                </>
              )
            )}
          </span>
          {since_when && <p>{since_when}</p>}
        </small>
      )
    );
  };

  return (
    <ExList2 {...rest}>
      {lead ? (
        <Space align="start" size={12}>
          <IconStyled
            color={iconProps.color}
            iconContainerSize={iconProps.iconContainerSize}
            style={{ marginBlockStart: 8 }}
          >
            <Icon icon={icon} size="1.6em" />
          </IconStyled>
          <div>
            <Text lead={lead}>{title}</Text>
            <div>
              {loading ? (
                <SkeletonBody size="small" active={false} />
              ) : (
                <Value lead={lead}>
                  {formatNumberString(value)}
                  {unit && unit}
                </Value>
              )}
              {renderTrend()}
            </div>
          </div>
        </Space>
      ) : (
        <>
          <TextWithIcon
            icon={icon}
            title={title}
            iconProps={{ ...iconProps, color: tenantTheme.gray500 }}
            loading={loading}
          />
          <div>
            {loading ? (
              <SkeletonBody size="small" active={false} />
            ) : (
              <Value lead={lead}>
                {formatNumberString(value)}
                {unit && unit}
              </Value>
            )}
            {renderTrend()}
          </div>
        </>
      )}
    </ExList2>
  );
}

StatsWithPercentage.propTypes = {
  title: PropTypes.string,
  icon: PropTypes.string,
  iconProps: PropTypes.object,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  percentage: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  growth: PropTypes.bool,
  since_when: PropTypes.string,
  lead: PropTypes.bool,
  loading: PropTypes.bool,
};

StatsWithPercentage.defaultProps = {
  iconProps: {
    color: tenantTheme['extra-light-color'],
    size: '1.2em',
    growth: false,
  },
};

export default StatsWithPercentage;
