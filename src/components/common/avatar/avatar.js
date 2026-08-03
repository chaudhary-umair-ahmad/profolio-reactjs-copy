import { Avatar as AntdAvatar, Badge } from 'antd';
import { IconStyled } from '../icon/IconStyled';
import Icon from '../icon/icon';
import React from 'react';

const Avatar = ({
  src,
  iconSize = 16,
  iconContainerSize = '40px',
  showProgress,
  showBadge,
  badgeColor,
  badgeCount,
  badgeShape,
  badgeOffset,
  iconShapeRadius,
  ...rest
}) => {
  return showBadge ? (
    <Badge
      color={badgeColor}
      count={badgeCount}
      offset={badgeOffset}
      shape={badgeShape}
      size="small"
      overflowCount={100}
    >
      <AntdAvatar src={src} {...rest} />
    </Badge>
  ) : src ? (
    <AntdAvatar src={src} {...rest} />
  ) : (
    <IconStyled
      style={{ '--icon-styled-width': iconContainerSize, '--icon-radius': iconShapeRadius, justifySelf: 'center' }}
    >
      <Icon size={iconSize} icon="FiUser" />
    </IconStyled>
  );
};

export default Avatar;
