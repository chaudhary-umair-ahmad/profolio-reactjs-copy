import React from 'react';
import PropTypes from 'prop-types';
import { CardStyled } from './styled';

const Card = (props) => {
  const { children, bodyStyle, headStyle, ...rest } = props;
  return (
    <CardStyled
      styles={{
        body: bodyStyle,
        header: headStyle,
      }}
      tabProps={{ size: 'middle', ...rest.tabProps }}
      {...rest}
    >
      {children}
    </CardStyled>
  );
};

Card.propTypes = {
  children: PropTypes.node,
};

export default Card;
