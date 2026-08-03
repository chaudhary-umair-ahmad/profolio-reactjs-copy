import tenantTheme from '@theme';
import PropTypes from 'prop-types';
import React from 'react';
import { Icon } from '..';
import { LinkStyled } from './styled';
import { useSelector } from 'react-redux';

function LinkWithIcon(props) {
  const {
    link,
    linkTitle,
    style,
    color,
    iconColor = tenantTheme['primary-color'],
    showIconBeforeText,
    icon,
    className,
    fontWeight,
    iconRight = false,
    noUnderline = false,
    $sidebarPill,
    $headerClassifiedPill,
    ...rest
  } = props;
  const rtl = useSelector((state) => state.app.AppConfig.rtl);

  const isClassifiedPill = $sidebarPill || $headerClassifiedPill;
  const mergedStyle = isClassifiedPill
    ? { ...(color != null ? { color } : {}), fontWeight: fontWeight ?? 500, ...style }
    : { color, fontWeight: fontWeight || 400, ...style };

  return (
    <LinkStyled
      to={link}
      style={mergedStyle}
      className={className}
      $noUnderline={noUnderline || isClassifiedPill}
      $sidebarPill={$sidebarPill}
      $headerClassifiedPill={$headerClassifiedPill}
      {...rest}
    >
      {icon ? (
        <>
         
          {iconRight ? (
            <>
            {linkTitle}
            {icon}
            </>
          ):(
            <>
            {icon}
            {linkTitle}
            </>
          )}
        </>
      ) : (
        <>
          {showIconBeforeText && <Icon icon={rtl ? 'FiArrowUpLeft' : 'FiArrowUpRight'} color={iconColor} />}
          {linkTitle}
          {!showIconBeforeText && <Icon icon={rtl ? 'FiArrowUpLeft' : 'FiArrowUpRight'} color={iconColor} />}
        </>
      )}
    </LinkStyled>
  );
}

LinkWithIcon.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.node,
  link: PropTypes.string,
  linkTitle: PropTypes.string,
  style: PropTypes.object,
  color: PropTypes.string,
  iconColor: PropTypes.string,
  showIconBeforeText: PropTypes.bool,
  noUnderline: PropTypes.bool,
  $sidebarPill: PropTypes.bool,
  $headerClassifiedPill: PropTypes.bool,
};

export default LinkWithIcon;
