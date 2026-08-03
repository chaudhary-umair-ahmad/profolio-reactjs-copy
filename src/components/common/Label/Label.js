import React from 'react';
import PropTypes from 'prop-types';
import { LabelStyled } from './styled';

const Label = props => {
  const { className, children, color, fontWeight, ...rest } = props;

  return (
    <LabelStyled
      className={className}
      style={{ '--label-color': color, '--label-font-weight': fontWeight, ...rest.style }}
      {...rest}
    >
      {children}
    </LabelStyled>
  );
};

Label.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  color: PropTypes.string,
};

Label.displayName = 'Label';
export default Label;
