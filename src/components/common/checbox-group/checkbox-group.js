import { Checkbox, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { getErrorString, getOBJValueByKey } from '../../../utility/utility';

import Group from '../group/group';
import { Icon, Skeleton } from '..';
import { IconStyled } from '../icon/IconStyled';
import Label from '../Label/Label';
import PropTypes from 'prop-types';
import { fetchApi } from '../../../utility/commonApis';

function CheckboxGroup(props) {
  const {
    label,
    labelIcon = null,
    name,
    loading = false,
    value = null,
    handleChange,
    buttonList = [],
    serverProps = null,
    defaultValue = [],
    groupTemplate,
    ...rest
  } = props;

  const [options, setOptions] = useState(buttonList);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    setOptionsData();
  }, [buttonList]);

  const setOptionsData = async () => {
    if (serverProps) {
      const { url, payloadKey, parser } = serverProps;
      const response = await fetchApi(url);
      setApiLoading(true);
      if (response && getOBJValueByKey(response, payloadKey)) {
        setApiLoading(false);
        setOptions(getOBJValueByKey(response, payloadKey).map(parser));
      } else {
        setApiLoading(false);
        setApiError(getErrorString(response));
      }
    } else {
      setOptions(buttonList);
    }
  };

  const renderCheckbox = () => {
    return (
      <Checkbox.Group
        options={options}
        defaultValue={defaultValue}
        value={value}
        onChange={handleChange}
        name={name}
        {...rest}
      />
    );
  };

  return (
    <>
      {loading ? (
        <Skeleton active avatar={!!labelIcon} paragraph={{ rows: 1 }} />
      ) : labelIcon ? (
        <Group template="max-content auto" gap="16px">
          <IconStyled>
            <Icon icon={labelIcon} />
          </IconStyled>

          <Group template="initial" gap="8px">
            {label && <Label htmlFor={name}>{label}</Label>}
            {renderCheckbox()}
          </Group>
        </Group>
      ) : (
        <Group template={groupTemplate || 'initial'} gap="8px">
          {label && <Label htmlFor={name}>{label}</Label>}
          {renderCheckbox()}
        </Group>
      )}
    </>
  );
}

CheckboxGroup.propTypes = {
  label: PropTypes.string,
  labelIcon: PropTypes.string,
  name: PropTypes.string,
  loading: PropTypes.bool,
  value: PropTypes.array,
  handleChange: PropTypes.func,
  buttonList: PropTypes.array,
  serverProps: PropTypes.object,
  defaultValue: PropTypes.array,
};

export default CheckboxGroup;
