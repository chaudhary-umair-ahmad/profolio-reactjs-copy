import { Row, Skeleton, Spin } from 'antd';
import React, { useCallback, useState } from 'react';

import PropTypes from 'prop-types';
import { ErrorMessage } from '..';
import { useServerPropsForLists } from '../../../hooks';
import Label from '../Label/Label';
import Group from '../group/group';
import { IconStyled } from '../icon/IconStyled';
import Icon from '../icon/icon';
import { SelectStyled } from './styled';
import Switch from '../switch/switch';
import tenantTheme from '@theme';
function SelectInput(props) {
  const {
    label,
    labelProps,
    labelClass,
    placeholder,
    labelIcon,
    name,
    skeletonLoading = false,
    value,
    options: selectOptions = [],
    getOptionLabel = (item) => item?.name || item?.title,
    getOptionValue = (item) => item?.id,
    suffixIcon = 'MdKeyboardArrowDown',
    prefixIcon = null,
    openIcon = 'MdKeyboardArrowUp',
    showSearch = false,
    serverProps = null,
    horizontal = false,
    className = 'width-100 border-r',
    onChange,
    errorMsg,
    valueAsObj,
    inputLoading,
    selectGrow,
    toggle,
    zIndex,
    getPopupContainer = true,
    renderPopover,
    renderSideButton,
    noLeftRadius = false,
    noRightRadius = false,
    groupStyle,
    ...rest
  } = props;
  const [suffix, setSuffix] = useState(suffixIcon);
  const [prefix, setPrefix] = useState(prefixIcon);
  const [isToggle, setIsToggle] = useState(false);
  const { options, setOptions, apiLoading, apiError } = useServerPropsForLists(serverProps, selectOptions);

  const getOptions = useCallback(() => {
    let option = !!toggle && isToggle ? options.filter((e) => e[toggle?.key] == true) : options;
    return option && !!option.length
      ? option?.map((item, index) => ({
          ...item,
          key: index,
          value: getOptionValue(item),
          label: getOptionLabel(item),
        }))
      : [];
  }, [options, toggle, isToggle]);

  const onToggleClick = (value) => {
    setIsToggle(value);
  };

  const renderSelect = () => {
    return (
      <>
        <SelectStyled
          accentColor={rest.accentColor}
          showSearch={showSearch}
          maxTagCount="responsive"
          prefix={prefixIcon && <Icon icon={prefixIcon} />}
          suffixIcon={
            inputLoading ? (
              <Spin />
            ) : (
              !!suffix && <Icon icon={suffix} style={rest.accentColor && { color: rest.accentColor }} />
            )
          }
          openIcon={openIcon}
          placeholder={placeholder}
          // value={value ? parseInt(value) : null}
          value={value}
          name={name}
          onDropdownVisibleChange={() => {
            setSuffix(suffix == suffixIcon ? openIcon : suffixIcon);
            setPrefix(prefix == prefixIcon ? openIcon : suffixIcon);
          }}
          options={getOptions()}
          onChange={(value, option) => {
            onChange(value, option);
          }}
          filterOption={(value, option) => {
            return getOptionLabel(option).toLowerCase().startsWith(value.toLowerCase());
          }}
          status={errorMsg ? 'error' : undefined}
          isHorizontal={horizontal}
          dropdownStyle={{
            '--select-dropdown-accent-color': rest.accentColor,
          }}
          noLeftRadius={noLeftRadius}
          noRightRadius={noRightRadius}
          dropdownRender={(menu) =>
            toggle ? (
              <>
                <div className="pi-12">
                  <Switch size="small" onChange={onToggleClick} label={toggle?.label} className="selectSearch" />
                </div>
                {menu}
              </>
            ) : (
              menu
            )
          }
          {...(getPopupContainer ? { getPopupContainer: (triggerNode) => triggerNode.parentElement } : {})}
          {...rest}
        />
        <ErrorMessage message={errorMsg} />
      </>
    );
  };

  const renderLabel = () => {
    return skeletonLoading ? (
      <Skeleton.Button active size="small" style={{ height: 22 }} />
    ) : (
      <>
        {label && (
          <Label htmlFor={name} {...labelProps}>
            {label}
            {renderPopover && renderPopover()}
            {renderSideButton && renderSideButton()}
          </Label>
        )}
      </>
    );
  };

  return (
    <>
      {skeletonLoading ? (
        <Skeleton.Input active style={{ borderRadius: 6, width: '100%' }} />
      ) : horizontal ? (
        <Row align="middle" justify="space-between" style={{ columnGap: 8, ...rest.style }}>
          {renderLabel()}
          <Group
            template="initial"
            style={{ flexBasis: 120, flexGrow: selectGrow ? 1 : null, minWidth: 120, ...groupStyle }}
          >
            {renderSelect()}
          </Group>
        </Row>
      ) : labelIcon ? (
        <Group template={labelIcon ? 'max-content auto' : ''} gap="16px">
          {labelIcon && (
            <IconStyled>
              <Icon icon={labelIcon} />
            </IconStyled>
          )}
          <Group template="initial" gap="8px">
            {renderLabel()}
            {renderSelect()}
          </Group>
        </Group>
      ) : (
        <Group className={className} template="initial" gap="8px">
          {renderLabel()}
          {renderSelect()}
        </Group>
      )}
    </>
  );
}

// SelectInput.propTypes = {
//   label: PropTypes.string,
//   labelProps: PropTypes.object,
//   placeholder: PropTypes.string,
//   labelIcon: PropTypes.string,
//   name: PropTypes.string,
//   skeletonLoading: PropTypes.bool,
//   loading: PropTypes.bool,
//   value: PropTypes.any,
//   options: PropTypes.array,
//   getOptionLabel: PropTypes.func,
//   getOptionValue: PropTypes.func,
//   suffixIcon: PropTypes.string,
//   prefixIcon: PropTypes.string,
//   openIcon: PropTypes.string,
//   showSearch: PropTypes.bool,
//   serverProps: PropTypes.object,
//   horizontal: PropTypes.bool,
//   className: PropTypes.string,
//   onChange: PropTypes.func,
//   errorMsg: PropTypes.string,
// };

export default SelectInput;
