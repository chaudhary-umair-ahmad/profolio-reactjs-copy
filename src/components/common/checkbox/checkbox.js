/* eslint-disable react/forbid-prop-types */
import PropTypes from 'prop-types';
import React from 'react';
import { CheckboxStyle, RowStyle } from './style';
import Label from '../Label/Label';

const CheckboxGroup = CheckboxStyle.Group;

const Checkbox = props => {
  const {
    className,
    // checked,
    multiple,
    onChange,
    onMultiChange,
    defaultChecked,
    disabled,
    children,
    options,
    // checkedList,
    onCheckAllChange,
    value,
    showAsListItem,
    description,
    labelRight,
    horizontal,
    checkboxReverse,
    labelSpace,
    label,
    style,
  } = props;

  const getCheckbox = () => (
    <CheckboxStyle
      checked={value}
      onChange={onChange}
      defaultChecked={defaultChecked}
      disabled={disabled}
      style={{ ...style }}
    >
      {children}
    </CheckboxStyle>
  );

  return !multiple ? (
    horizontal ? (
      <RowStyle
        align="middle"
        justify="space-between"
        className={`${checkboxReverse && 'reverse'} ${labelSpace && 'label-space'} pointer`}
        onClick={e => {
          onChange({ target: { checked: !value } });
        }}
      >
        <Label>{label}</Label>
        <div style={{ flex: 'none' }}>{getCheckbox()}</div>
      </RowStyle>
    ) : (
      <div className={className}>
        {label}
        {getCheckbox()}
        {labelRight && <span>{labelRight}</span>}
        {description && <span>{description}</span>}
      </div>
    )
  ) : (
    <div>
      <div>
        <CheckboxStyle onChange={onCheckAllChange}>Check all</CheckboxStyle>
      </div>
      <br />
      <CheckboxGroup options={options.map(e => e.name)} value={value} onChange={onMultiChange} />
    </div>
  );
};

Checkbox.propTypes = {
  options: PropTypes.arrayOf(PropTypes.object),
  defaultSelect: PropTypes.array,
  multiple: PropTypes.bool,
  onChange: PropTypes.func,
  onChangeTriger: PropTypes.func,
  defaultChecked: PropTypes.bool,
  disabled: PropTypes.bool,
  checked: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.node]),
};

export { Checkbox, CheckboxGroup };
