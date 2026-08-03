import React from 'react';
import { useSelector } from 'react-redux';
import { Tag } from '../common';

const TruBrokerTag = ({ tagText, size, tagFontSize, padding, borderRadius, style }) => {
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);

  const styles = {
    background: 'linear-gradient(237.73deg, #053940 19.63%, #00745F 48.96%, #033F46 72.03%)',
    display: 'inline-block',
    alignItems: 'center',
    borderRadius: borderRadius || isMobile ? '4px' : '6px',
    padding: padding || isMobile ? '4px 6px' : '5px 8px',
    width: 'max-content',
    '--tag-font-size': tagFontSize || isMobile ? '11px' : '12px',
    ...style,
  };

  return (
    <Tag style={styles} color="#00745F" textColor="#fff" gradient size={size}>
      {tagText}
    </Tag>
  );
};

export default TruBrokerTag;
