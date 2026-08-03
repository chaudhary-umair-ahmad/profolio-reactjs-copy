import { Skeleton, Space } from 'antd';
import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Icon, Popover, Select, Spinner } from '..';

import debounce from 'lodash/debounce';
import Group from '../group/group';
import { IconStyled } from '../icon/IconStyled';
import Label from '../Label/Label';
import tenantUtils from '@utils';
import { getMissingOptions } from '../../../utility/utility';

const DebounceSelect = forwardRef((props, ref) => {
  const {
    label,
    labelIcon = null,
    name,
    skeletonLoading = false,
    value,
    suffixIcon,
    prefixIcon,
    showSearch = false,
    serverProps,
    openIcon,
    horizontal,
    fetchApi: fetchOptions,
    payloadKey,
    dependents,
    debounceTimeout = 500,
    hideOnNoOptions,
    labelProps,
    onChange,
    initialOptions,
    fetchSelectedOptions = false,
    ...rest
  } = props;

  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState([]);
  const fetchRef = useRef(0);
  const fetchedMissingOnce = useRef(false);

  useEffect(() => {
    if (fetchSelectedOptions) {
      fetchMissingOptions();
    }
  }, [value]);

  useEffect(() => {
    setOptions(initialOptions);
  }, [initialOptions]);

  useEffect(() => {
    !!dependents && debounceFetcher(dependents);
  }, [dependents]);

  useEffect(() => {
    rest.disabled && setOptions([]);
  }, [rest.disabled]);

  useImperativeHandle(ref, () => ({
    clearOptions() {
      setOptions([]);
    },
  }));

  const maxTagPlaceholder = (items) => (
    <Popover
      getPopupContainer={() => document.body}
      content={items?.map((e, i) => (
        <div key={i}>{tenantUtils.getLocalisedString(e, 'title')}</div>
      ))}
    >{`+${items?.length}`}</Popover>
  );

  const fetchMissingOptions = () => {
    if (fetchedMissingOnce.current || !Array.isArray(value) || !value.length || !initialOptions) {
      return;
    }

    fetchedMissingOnce.current = true;

    getMissingOptions(value, initialOptions)
      .then((missingOptions) => {
        if (missingOptions?.length) {
          setOptions((prev) => [...prev, ...missingOptions]);
        }
      })
      .catch((error) => {
        console.error('Error fetching missing options:', error);
      });
  };

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);
      fetchOptions(
        value,
        (newOptions) => {
          if (fetchId !== fetchRef.current) {
            return;
          }
          setOptions(newOptions[payloadKey]);
          setFetching(false);
        },
        () => {
          setFetching(false);
        },
      );
    };
    return debounce(loadOptions, debounceTimeout);
  }, [fetchOptions, debounceTimeout]);

  const renderSelect = () => (
    <Select
      showSearch
      onChange={onChange}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spinner size="small" /> : null}
      options={options}
      loading={fetching}
      value={value}
      maxTagPlaceholder={maxTagPlaceholder}
      {...rest}
    />
  );

  const renderLabel = () => {
    return (
      <Label htmlFor={name} {...labelProps}>
        {label}
      </Label>
    );
  };

  return hideOnNoOptions && !options.length ? null : (
    <>
      {skeletonLoading ? (
        <Skeleton active avatar={labelIcon} paragraph={{ rows: 1 }} />
      ) : horizontal ? (
        <Space size="middle">
          {renderLabel()}
          <div>{renderSelect()}</div>
        </Space>
      ) : labelIcon ? (
        <Group template="max-content auto" gap="16px">
          <IconStyled>
            <Icon icon={labelIcon} />
          </IconStyled>
          <Group template="initial" gap="8px">
            {renderLabel()}
            {renderSelect()}
          </Group>
        </Group>
      ) : (
        <Group template="initial" gap="8px">
          {renderLabel()}
          {renderSelect()}
        </Group>
      )}
    </>
  );
});

export default DebounceSelect;
