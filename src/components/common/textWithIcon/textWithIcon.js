import tenantTheme from '@theme';
import PropTypes from 'prop-types';
import React from 'react';
import { Flex, Icon } from '..';
import { SkeletonBody } from '../../skeleton/Skeleton';
import { Text } from './styled';
import cx from 'clsx';
const TextWithIcon = (props) => {
  const {
    className,
    icon = null,
    iconProps = {
      size: '1.2em',
      color: tenantTheme['light-gray-color'],
    },
    title = null,
    gap = '8px',
    textSize,
    textColor,
    fontWeight,
    iconStyle,
    loading,
    loadingProps = {
      avatarSize: 'small',
      rectSize: 'small',
    },
    lead,
    value,
    subClass,
    iconSize,
    iconClassName,
    textStyle,
    valueStyle,
    ...rest
  } = props;
  return (
    <Flex className={className} align="center" gap={gap} {...rest}>
      {icon &&
        (loading ? (
          <SkeletonBody type="avatar" size={loadingProps.avatarSize || 'small'} />
        ) : iconProps.hasBackground ? (
          <Icon
            styled
            iconProps={{
              color: iconProps.color,
              style: { backgroundColor: iconProps.iconBackgroundColor, ...iconProps.style, ...iconStyle },
              ...iconProps,
            }}
            icon={icon}
          />
        ) : (
          <Icon
            icon={icon}
            size={iconProps.size}
            color={iconProps.color}
            style={iconProps.style}
            className={iconClassName}
          />
        ))}
      {loading ? (
        <SkeletonBody type="button" size={loadingProps.rectSize || 'small'} />
      ) : (
        <Text textSize={textSize} textColor={textColor} lead={lead} fontWeight={fontWeight} style={{ ...textStyle }}>
          {title}
          {value && <div className={cx('value', subClass)} style={valueStyle}>{value}</div>}{' '}
        </Text>
      )}
    </Flex>
  );
};

// TextWithIcon.propTypes = {
//   // className: PropTypes.string,
//   // icon: PropTypes.string,
//   // iconProps: PropTypes.object,
//   // title: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
//   // gap: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.oneOf(['small', 'middle', 'large'])]),
//   // textSize: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
//   // textColor: PropTypes.string,
//   // fontWeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
//   // loading: PropTypes.bool,
//   // loadingProps: PropTypes.object,
//   // rest: PropTypes.object,
//   lead: PropTypes.bool,
//   // value: PropTypes.node,
// };

export default TextWithIcon;
