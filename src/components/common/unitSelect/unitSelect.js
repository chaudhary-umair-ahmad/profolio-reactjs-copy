import { Space, Row, Skeleton } from 'antd';
import cx from 'clsx';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { Group, Icon, Label, Select } from '..';
import { DATE_TIME_FORMAT } from '../../../constants/formats';
import DateFilter from '../dateFilter/DateFilter';
import { IconStyled } from '../icon/IconStyled';
import TextInput from '../textInput/textInput';
import styles from './index.module.less';

export default function UnitSelect(props) {
  const {
    label,
    labelProps,
    muted,
    name,
    options,
    value,
    formItem,
    placeholder,
    getOptionLabel = (option) => option.label,
    getOptionValue = (option) => option.key,
    defaultOption,
    handleChange,
    useInternalState = true,
    componentType,
    inputType,
    disabled,
    loading,
    preventOnChange = true,
    className,
    getValues,
    splitBy = ',',
    selectMode,
    allowInput,
    dateEnabledKey,
    onPressEnter,
    skeletonLoading,
    horizontal,
    renderPopover,
    labelIcon,
    groupStyle,
    selectStyles,
  } = props;
  const [option, setOption] = useState(options?.[0] || null);
  const [futureDateEnabled, setFutureDateEnabled] = useState();

  useEffect(() => {
    defaultOption && setOption(defaultOption);
  }, [defaultOption]);

  useEffect(() => {
    !defaultOption && options && setOption(options?.[0]);
  }, [options]);

  const disabledDate = (current) => {
    if (futureDateEnabled) {
      return null;
    }
    const minDate = new Date();
    const maxDate = new Date();
    minDate.setDate(minDate.getDate() - 500);
    return current && current > maxDate;
  };

  const getConvertedDateValue = (dates) => {
    return `${dates[0].startOf('day').format(DATE_TIME_FORMAT)},${dates[1].endOf('day').format(DATE_TIME_FORMAT)}`;
  };

  const getDateValueFromString = (value) => {
    if (value) {
      return value?.split(splitBy);
    }
    return undefined;
  };

  const getSelectedValue = () => {
    let currentSelectType = option;
    let selectedOption = value?.[currentSelectType?.key];
    return !!selectedOption ? selectedOption?.split(',') : [];
  };

  const getComponent = () => {
    switch (componentType) {
      case 'date':
        return (
          <DateFilter
            onChange={(dates) => {
              dates && handleChange(option.key, getConvertedDateValue(dates));
            }}
            disabledDate={disabledDate}
            value={getDateValueFromString(value?.[option?.value])}
            noDefault
            inputReadOnly
            {...option?.componentProps}
          />
        );
      case 'select':
        return (
          <Select
            value={getSelectedValue()}
            className="selectSearch togglesearch"
            style={{
              width: '100%',
            }}
            placeholder={placeholder ? placeholder : `${t('Select')} ${option?.label}`}
            disabled={disabled}
            mode={selectMode}
            options={option?.list}
            loading={loading}
            allowClear
            onChange={(value, item) => {
              handleChange(option.key, value);
            }}
          />
        );
      default:
        return (
          <TextInput
            type={inputType || 'text'}
            value={formItem ? value.value : value?.[option?.key]}
            placeholder={placeholder ? placeholder : `${t('Search By')} ${option?.label}`}
            useInternalState={useInternalState}
            disabled={disabled}
            loading={loading}
            maxLength={100}
            noRightRadius={true}
            {...(preventOnChange && {
              ...(useInternalState
                ? {
                    handleBlur(e) {
                      handleChange(option.key, e.target.value);
                    },
                  }
                : {
                    handleChange(e) {
                      if (getValues) {
                        getValues({ key: option.value, value: e.target.value });
                      } else {
                        handleChange(option.key, e.target.value);
                      }
                    },
                  }),
            })}
            onPressEnter={(e) => {
              handleChange(option.key, e.target.value, true);
              onPressEnter();
            }}
            allowInput={allowInput}
            allowClear
          />
        );
    }
  };

  const renderInput = () => {
    return skeletonLoading ? (
      <Skeleton.Input active style={{ borderRadius: 6, width: '100%' }} />
    ) : (
      <Space.Compact className={styles.unitSelect}>
        {getComponent()}
        <Select
          style={{ ...selectStyles }}
          placeholder=""
          value={formItem && value.unit ? value.unit : option}
          noLeftRadius={true}
          options={options}
          getOptionLabel={getOptionLabel}
          getOptionValue={getOptionValue}
          disabled={disabled}
          onChange={(value, item) => {
            if (value === dateEnabledKey) {
              setFutureDateEnabled(true);
            } else {
              setFutureDateEnabled(false);
            }
            setOption({ ...item, key: item?.value });
            getValues && getValues((prev) => ({ ...prev, key: value }));
            handleChange(item.key, value.value);
          }}
          popupMatchSelectWidth={false}
        />
      </Space.Compact>
    );
  };

  const renderLabel = () => {
    return skeletonLoading ? (
      <Skeleton.Button active size="small" style={{ height: 22 }} />
    ) : (
      label && (
        <Label muted={muted} htmlFor={name} {...labelProps}>
          {label}
          {renderPopover && renderPopover()}
        </Label>
      )
    );
  };

  return (
    <>
      {horizontal ? (
        <Row align="middle" justify="space-between" className={className}>
          {renderLabel()}
          <div style={{ flexBasis: 120 }}>{renderInput()}</div>
        </Row>
      ) : labelIcon ? (
        <Group template={labelIcon ? 'max-content auto' : ''} gap="16px" style={groupStyle} className={className}>
          {labelIcon && (
            <IconStyled>
              <Icon icon={labelIcon} />
            </IconStyled>
          )}
          <Group template="initial" gap="8px" className="w-100">
            {renderLabel()}
            {renderInput()}
          </Group>
        </Group>
      ) : (
        <Group className={cx(className, 'abc')} template="initial" gap="8px" style={groupStyle}>
          {renderLabel()}
          {renderInput()}
        </Group>
      )}
    </>
  );
}
