import { Content, PopoverStyled, Title } from './style';

import Icon from '../icon/icon';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';

const Popover = (props) => {
  const {
    content,
    placement,
    title,
    action = 'hover',
    children,
    visible,
    onVisibleChange,
    showOnClick,
    ...rest
  } = props;
  const content1 = <Content>{content}</Content>;

  return (
    <PopoverStyled
      placement={placement}
      title={title && <Title>{title}</Title>}
      content={content1}
      trigger={action}
      open={visible}
      onOpenChange={onVisibleChange}
      overlayClassName="popover-content"
      getTooltipContainer={(triggerNode) => triggerNode.parentNode}
      getPopupContainer={(triggerNode) => triggerNode.parentNode}
      {...rest}
    >
      {children}
    </PopoverStyled>
  );
};

const content = (
  <>
    <Link to="#">
      <Icon size={16} icon="MdCheck" />
      <span>Btn Dropdown one</span>
    </Link>
    <Link to="#">
      <Icon size={16} icon="MdCheck" />
      <span>Btn Dropdown two</span>
    </Link>
    <Link to="#">
      <Icon size={16} icon="MdCheck" />
      <span>Btn Dropdown three</span>
    </Link>
  </>
);

Popover.propTypes = {
  placement: PropTypes.string,
  title: PropTypes.string,
  action: PropTypes.string,
  content: PropTypes.node,
  children: PropTypes.node,
};

export { Popover };
