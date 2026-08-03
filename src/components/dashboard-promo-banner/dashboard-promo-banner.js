import tenantTheme from '@theme';
import PropTypes from 'prop-types';
import React from 'react';
import { isHttpUrl } from '../../utility/utility';

const BANNER_SLOT_DESKTOP = { width: 1390, height: 212 };
const BANNER_SLOT_MWEB = { width: 360, height: 182 };

const getCenterFlex = (maxHeight) => ({
  display: 'flex',
  width: '100%',
  minWidth: 0,
  minHeight: 0,
  maxHeight,
  alignItems: 'center',
  justifyContent: 'center',
});

const imageLinkStyle = {
  display: 'inline-block',
  lineHeight: 0,
  verticalAlign: 'middle',
  color: 'inherit',
};

function DashboardPromoBanner({ imageUrl, title, href, isMobile, onBannerClick }) {
  if (!imageUrl) return null;

  const slot = isMobile ? BANNER_SLOT_MWEB : BANNER_SLOT_DESKTOP;
  const borderRadius = tenantTheme['border-radius-lg'] || 8;

  const wrapperStyle = {
    width: '100%',
    minWidth: 0,
    maxWidth: slot.width,
    minHeight: 0,
    maxHeight: slot.height,
    margin: '0 auto',
    overflow: 'hidden',
    borderRadius,
    lineHeight: 0,
  };

  const centerFlex = getCenterFlex(slot.height);

  const img = (
    <img
      src={imageUrl}
      alt={title || ''}
      style={{
        minWidth: 0,
        minHeight: 0,
        maxWidth: '100%',
        maxHeight: slot.height,
        width: 'auto',
        height: 'auto',
        objectFit: 'contain',
        display: 'block',
      }}
    />
  );

  const content = href && isHttpUrl(href) ? (
    <div style={centerFlex}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={imageLinkStyle}
        onClick={onBannerClick}
      >
        {img}
      </a>
    </div>
  ) : (
    <div style={centerFlex}>{img}</div>
  );

  return (
    <div style={wrapperStyle}>
      {content}
    </div>
  );
}

DashboardPromoBanner.propTypes = {
  imageUrl: PropTypes.string,
  title: PropTypes.string,
  href: PropTypes.string,
  isMobile: PropTypes.bool,
  onBannerClick: PropTypes.func,
};

export default DashboardPromoBanner;
