import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../button/button';
import { Dropdown } from '../dropdown/dropdown';
import Group from '../group/group';
import SelectInput from '../select/select';
import { TextInput } from '..';

function RangeInput(props) {
  const {
    placeholder,
    label,
    labelProps,
    dropdownPlaceholder,
    inputPlaceholders,
    startLabel,
    endLabel,
    mode,
    list,
    defaultValue,
    onConfirm,
    queryStartValue,
    queryEndValue,
    queryUnitValue,
    onValuesConvert,
    defaultUnit,
    onUnitChange = () => {},
    isMobile,
    disabled = false,
    ...rest
  } = props;
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [startValue, setStartValue] = useState(null);
  const [endValue, setEndValue] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [startvalueError, setStartValueError] = useState(null);
  const [endvalueError, setEndValueError] = useState(null);

  useEffect(() => {
    queryStartValue != 'null' && queryStartValue != 'undefined' && setStartValue(queryStartValue);
    queryEndValue != 'null' && queryEndValue != 'undefined' && setEndValue(queryEndValue);
    list && setSelectedUnit(defaultUnit);
  }, [list, queryStartValue, queryEndValue]);

  const handleVisibleChange = flag => {
    setVisible(flag);
  };

  const handleClose = () => {
    setVisible(false);
  };

  const handleClick = () => {
    if (onValuesConvert) {
      let values = [startValue, endValue];
      const [start, end] = onValuesConvert(selectedUnit, values);
      onConfirm(!start ? null : start, !end ? null : end, selectedUnit);
    } else {
      if (!startvalueError && !endvalueError) {
        onConfirm(!startValue ? null : startValue, !endValue ? null : endValue);
      }
    }
  };

  const validateValue = value => {
    return value <= 1000000000 ? true : false;
  };

  const renderChildren = () => {
    const translatedList = list?.map(item => ({
      ...item,
      title: t(item.title),
    }));

    return (
      <>
        <Group className="p-16" clickable="ant-select-dropdown">
          <Group template={mode === 'unitRange' ? 'repeat(3, auto)' : 'repeat(2, 1fr)'} gap={isMobile ? '8px' : '16px'}>
            <TextInput
              label={t(startLabel)}
              placeholder={t(inputPlaceholders)}
              value={startValue}
              type="number"
              handleChange={e => {
                setStartValue(e.target.value);
                // if (mode === 'unitRange') {
                //   setStartValue(e.target.value);
                // } else {
                //   if (validateValue(e.target.value)) {
                //     setStartValue(e.target.value);
                //     setStartValueError(null);
                //   } else {
                //     setStartValueError('Invalid Price');
                //   }
                // }
              }}
              errorMsg={startvalueError}
            />
            <TextInput
              label={t(endLabel)}
              placeholder={t(inputPlaceholders)}
              value={endValue}
              errorMsg={endvalueError}
              type="number"
              handleChange={e => {
                setEndValue(e.target.value);
                // if (mode === 'unitRange') {
                //   setEndValue(e.target.value);
                // } else {
                //   if (validateValue(e.target.value)) {
                //     setEndValue(e.target.value);
                //     setEndValueError(null);
                //   } else {
                //     setEndValueError('Invalid Price');
                //   }
                // }
              }}
            />
            {mode === 'unitRange' && (
              <SelectInput
                label={t('Unit')}
                options={!!translatedList && translatedList}
                style={{ width: 140 }}
                suffixIcon="chevron-down"
                defaultValue={queryUnitValue || defaultValue}
                getOptionValue={e => e.slug}
                getOptionLabel={e => e.title}
                value={selectedUnit}
                onChange={(value, option) => {
                  onUnitChange(option);
                  setSelectedUnit(value);
                }}
                disabled={disabled}
              />
            )}
          </Group>
          <div style={{ display: 'flex', gap: 8, justifySelf: 'end' }}>
            <Button onClick={handleClose}>{t('Cancel')}</Button>
            <Button
              type="primary"
              onClick={() => {
                handleClick();
                handleClose();
              }}
            >
              {t('Confirm')}
            </Button>
          </div>
        </Group>
      </>
    );
  };

  return (
    <Dropdown
      title={label}
      placeholder={placeholder}
      style={{ cursor: 'pointer' }}
      renderChildren={renderChildren}
      open={visible}
      onOpenChange={handleVisibleChange}
      labelProps={labelProps}
    />
  );
}

export default RangeInput;
