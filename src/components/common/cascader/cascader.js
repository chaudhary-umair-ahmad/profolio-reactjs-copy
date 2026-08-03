import React, { useState } from 'react';

import { CascaderStyle } from './style';
import Group from '../group/group';
import { Icon } from '..';
import Label from '../Label/Label';
import PropTypes from 'prop-types';
import { Row } from 'antd';

const Cascader = (props) => {
  const {
    data = [],
    defaultValue = [],
    trigger = 'click',
    onChange,
    isShowSearch = true,
    loading,
    placeholder = 'Please select',
    onClear,
    box_title: boxTitle,
    label,
    labelProps,
  } = props;
  const options = data;
  const [state, setState] = useState({
    options,
  });

  const filter = (inputValue, path) => {
    return path.some((option) => option.label?.toLowerCase().indexOf(inputValue?.toLowerCase()) > -1);
  };

  function dropdownRender(menus) {
    return (
      <div>
        <div style={{ paddingInlineStart: 12 }}>{boxTitle}</div>
        {menus}
      </div>
    );
  }

  return (
    <Group gap="8px">
      <Label htmlFor="name" {...labelProps}>
        {label}
      </Label>
      <CascaderStyle
        options={options}
        expandTrigger={trigger}
        defaultValue={defaultValue}
        onChange={onChange}
        showSearch={isShowSearch && { filter }}
        placeholder={placeholder}
        changeOnSelect={!!loading}
        onClear={onClear}
        allowClear={false}
        value={null}
        dropdownRender={boxTitle && dropdownRender}
        suffixIcon={<Icon icon="MdKeyboardArrowDown" />}
        style={{ width: '100%' }}
        {...props}
      />
    </Group>
  );
};

Cascader.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  defaultValue: PropTypes.arrayOf(PropTypes.string),
  trigger: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  isShowSearch: PropTypes.bool,
  loading: PropTypes.bool,
  onClear: PropTypes.func,
  box_title: PropTypes.string,
  label: PropTypes.string,
  labelProps: PropTypes.object,
};

export { Cascader };
