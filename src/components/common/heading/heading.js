import React from 'react';
import PropTypes from 'prop-types';
import * as headings from './styled';

const Heading = (props) => {
  const { as = "h1", children, className, id, style } = props;
  const StyledHeading = as ? headings[as.toUpperCase()] : headings.H1;

  return (
    <StyledHeading className={className} id={id} style={{ ...style }}>
      {children}
    </StyledHeading>
  );
};

Heading.propTypes = {
  as: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']),
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.node]),
  className: PropTypes.string,
  id: PropTypes.string,
  style: PropTypes.object,
};

export default Heading;
