import React from 'react';
import PropTypes from 'prop-types';
import { SegmentedStyled } from './styled';

const Segmented = (props) => {
  const { children, className, style, accentColor, ...rest } = props;
  return (
    <SegmentedStyled className={className} style={{ ...style }} {...rest}>
      {children}
    </SegmentedStyled>
  );
};

Segmented.propTypes = {
  children: PropTypes.node,
};

export default Segmented;
