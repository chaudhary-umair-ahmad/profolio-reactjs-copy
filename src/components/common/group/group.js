import React from 'react';
import PropTypes from 'prop-types';
import GroupStyled from './styled';

const Group = (props) => {
  const { className, children, gap = '', template = '', style = {}, ...rest } = props;
  return (
    <GroupStyled className={className} style={{ '--gap': gap, '--template': template, ...style }} {...rest}>
      {children}
    </GroupStyled>
  );
};

Group.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  gap: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  template: PropTypes.string,
  style: PropTypes.object,
};

export default Group;
