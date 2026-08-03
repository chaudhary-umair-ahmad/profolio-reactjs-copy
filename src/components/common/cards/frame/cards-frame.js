import { Dropdown, Heading, Icon } from '../../';

import { CardFrame } from './style';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';

const Cards = (props) => {
  const {
    className,
    title,
    children,
    more,
    moreText,
    size,
    headless = true,
    caption,
    isbutton,
    bodyStyle,
    headStyle,
    border = false,
    bodypadding,
    style,
    ...rest
  } = props;
  return (
    <>
      {!headless ? (
        <CardFrame
          className={className}
          size={size}
          title={title}
          styles={{
            body: bodyStyle,
            header: headStyle,
          }}
          bordered={border}
          bodypadding={bodypadding && bodypadding}
          extra={
            <>
              {more && (
                <Dropdown content={more} placement="bottomCenter">
                  <NavLink to="#">{!moreText ? <Icon icon="FiCalendar" size={14} /> : 'More'}</NavLink>
                </Dropdown>
              )}

              {isbutton && isbutton}
            </>
          }
          style={{ ...style }}
          {...rest}
        >
          {children}
        </CardFrame>
      ) : (
        <CardFrame
          className={className}
          bodypadding={bodypadding && bodypadding}
          styles={{
            body: bodyStyle,
          }}
          size={size}
          style={{ ...style }}
          bordered={border}
          {...rest}
        >
          {title && <Heading as="h4">{title}</Heading>}
          {caption && <p>{caption}</p>}
          {children}
        </CardFrame>
      )}
    </>
  );
};

Cards.propTypes = {
  className: PropTypes.string,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.node]),
  size: PropTypes.string,
  more: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.node]),
  bodyStyle: PropTypes.object,
  headStyle: PropTypes.object,
  isbutton: PropTypes.node,
  headless: PropTypes.bool,
  border: PropTypes.bool,
  caption: PropTypes.string,
  bodypadding: PropTypes.string,
  moreText: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.node]),
  style: PropTypes.object,
};

export { Cards };
