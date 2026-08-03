import tenantTheme from '@theme';
import { Space, Typography } from 'antd';
import PropTypes from 'prop-types';
import React, { lazy } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Flex from '../flex';
import Icon from '../icon/icon';
import { StatisticStyled } from './styled';
const Lottie = lazy(() => import('../../common/lottie/lottie'));

const { Text } = Typography;

const Statistic = (props) => {
  const {
    rootClassName,
    lead,
    icon,
    iconProps,
    loading,
    percentage,
    trends = true,
    growth,
    since_when,
    onClick,
    inlineTrends = false,
    iconContainerRadius,
    containerStyle,
    ...rest
  } = props;
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const { t } = useTranslation();

  const renderTrend = () => {
    return (
      <small>
        {percentage === 0 ? (
          <Text className="px-2 text-muted" type="secondary">
            {('')}
          </Text>
        ) : percentage === null || !percentage ? ( //TODO: null was intended. So need to check why percentage is undefined
          <Text className="px-2 text-muted">{('')}</Text>
        ) : (
          <>
            <Flex className="fw-400" align="center" gap="2px" wrap>
              <Icon
                size="1em"
                icon={growth ? 'TiArrowSortedUp' : 'TiArrowSortedDown'}
                color={growth ? tenantTheme['success-color'] : tenantTheme['danger-color']}
              />
              <Text className="px-2" type={growth ? 'success' : 'danger'}>
                {Math.abs(percentage)?.toFixed(0)}%
              </Text>
            </Flex>
            {since_when && (
              <Text className="text-muted" style={{ lineHeight: 1.2 }}>
                {since_when}
              </Text>
            )}
          </>
        )}
      </small>
    );
  };

  return (
    <Space
      className={rootClassName + (onClick ? ' pointer' : '')}
      align="start"
      direction={rest.direction}
      onClick={onClick}
      {...rest.spaceProps}
      style={{ ...containerStyle }}
    >
      {rest.lottieOptions?.animationData && <Lottie {...rest.lottieOptions} />}
      {!rest.lottieOptions && icon && (
        <Icon
          icon={icon}
          size={iconProps.size}
          styled={iconProps.hasBackground}
          iconProps={{
            style: {
              marginBlockStart: lead && rest.direction !== 'vertical' && '.4em',
              ...iconProps.style,
              '--icon-radius': iconContainerRadius,
            },
            ...iconProps,
          }}
          {...rest.iconProps}
        />
      )}
      <div>
        <StatisticStyled
          lead={lead}
          loading={loading}
          precision={0}
          inline={rest.inline}
          isMobile={isMobile}
          suffix={inlineTrends && trends && renderTrend()}
          {...rest}
        />
        {!inlineTrends && trends && renderTrend()}
      </div>
    </Space>
  );
};

export default Statistic;

Statistic.propTypes = {
  icon: PropTypes.string,
  iconProps: PropTypes.object,
  rest: PropTypes.object,
  loading: PropTypes.bool,
  lead: PropTypes.bool,
  direction: PropTypes.oneOf(['vertical', 'horizontal']),
};
