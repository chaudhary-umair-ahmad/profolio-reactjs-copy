import tenantTheme from '@theme';
import { Menu } from 'antd';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Icon } from '..';
import Group from '../group/group';
import Label from '../Label/Label';
import { DropdownStyled } from './dropdown-style';

const Dropdown = ({
  content,
  placement = 'bottomRight',
  title,
  labelProps,
  action = ['click'],
  children,
  style = {},
  iconSize,
  rootClassName,
  className = '',
  options = [],
  getOptionLabel = (e) => e?.name || e?.title,
  getOptionValue = (e) => e?.id,
  getOptionLink = (e) => e?.href,
  getOptionIcon,
  renderChildren,
  useAsLink,
  onChange = () => {},
  placeholder,
  defaultValue,
  suffixIcon = 'MdKeyboardArrowDown',
  prefixIcon,
  box_title,
  linkTo,
  dropdownItemStyle = {},
  ...rest
}) => {
  const [value, setValue] = useState(options.filter((item) => item?.id == defaultValue)[0]?.name);

  const renderChild = () => {
    return children || <span>{placeholder}</span>;
  };

  const renderLabel = (item, onClick) => (
    <Group template="max-content auto" gap={rest.labelGap || '8px'} style={{ alignItems: 'center' }} onClick={onClick}>
      {getOptionIcon ? (
        typeof getOptionIcon(item) != 'string' ? (
          getOptionIcon(item)
        ) : (
          <Icon icon={getOptionIcon(item)} size="1.6em" />
        )
      ) : (
        item?.icon && <Icon icon={item.icon} size="1.6em" />
      )}
      {getOptionLabel(item)}
    </Group>
  );

  const renderDropdownItem = (item, i) => {
    return renderChildren ? (
      renderChildren()
    ) : (
      <Menu.Item style={dropdownItemStyle} onClick={() => onChange(item)} key={i}>
        {useAsLink ? (
          <a target="_blank" rel="noopener noreferrer" href={linkTo || getOptionLink(item)}>
            {renderLabel(item)}
          </a>
        ) : (
          renderLabel(item, item?.onClick)
        )}
      </Menu.Item>
    );
  };

  return (
    <Group gap="8px">
      {title && (
        <Label htmlFor="name" {...labelProps}>
          {title}
        </Label>
      )}
      <DropdownStyled
        className={rootClassName}
        overlayClassName={className}
        style={style}
        placement={placement}
        trigger={action}
        value={value}
        overlay={
          options && !!options.length ? (
            <Menu>
              {box_title && <Menu.Item>{box_title}</Menu.Item>}
              {content || options.map(renderDropdownItem)}
            </Menu>
          ) : (
            <Menu>{renderDropdownItem()}</Menu>
          )
        }
        // menu={{
        //   items: [
        //     ...(box_title
        //       ? [
        //           {
        //             key: -1,
        //             label: <Menu.Item>{box_title}</Menu.Item>,
        //             disabled: true,
        //           },
        //         ]
        //       : []),
        //     ...(options && !!options.length
        //       ? content || options.map((e, i) => ({ key: i, label: renderDropdownItem(e) }))
        //       : [{ key: 0, label: renderDropdownItem() }]),
        //   ],
        // }}
        {...rest}
      >
        <div
          style={{
            display: 'inline-flex',
            // alignItems: 'center',
            gap: 4,
            padding: 10,
            ...style,
          }}
        >
          {prefixIcon && (
            <Icon
              icon={prefixIcon}
              size={iconSize || rest?.prefixIconProps?.size}
              color={rest?.prefixIconProps?.color || tenantTheme['extra-light-color']}
              {...rest?.prefixIconProps}
            />
          )}
          {renderChild()}
          {suffixIcon && (
            <Icon
              icon={suffixIcon}
              size={iconSize || rest?.suffixIconProps?.size}
              color={rest?.suffixIconProps?.color || tenantTheme['extra-light-color']}
              {...rest?.suffixIconProps}
            />
          )}
        </div>
      </DropdownStyled>
    </Group>
  );
};

Dropdown.propTypes = {
  placement: PropTypes.string,
  title: PropTypes.string,
  labelProps: PropTypes.object,
  action: PropTypes.array,
  content: PropTypes.node,
  children: PropTypes.node,
  style: PropTypes.object,
  className: PropTypes.string,
  rootClassName: PropTypes.string,
  options: PropTypes.array,
  getOptionLabel: PropTypes.func,
  getOptionValue: PropTypes.func,
  getOptionIcon: PropTypes.func,
  renderChildren: PropTypes.func,
  useAsLink: PropTypes.bool,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  defaultValue: PropTypes.string,
  suffixIcon: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  prefixIcon: PropTypes.string,
  box_title: PropTypes.string,
  linkTo: PropTypes.string,
};

export { Dropdown };
