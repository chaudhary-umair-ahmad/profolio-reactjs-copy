import tenantTheme from '@theme';
import React from 'react';
import Icon from './icon/icon';

const ListItem = (props) => {
  const { className, children, ...style } = props;
  return (
    <li className={className} {...style}>
      <Icon icon="MdCheck" color={tenantTheme['primary-color']} /> {children}
    </li>
  );
};

export default ListItem;
