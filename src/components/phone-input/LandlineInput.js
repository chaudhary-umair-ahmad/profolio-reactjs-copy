import 'react-phone-number-input/style.css';

import tenantTheme from '@theme';
import tenantConstants from '@constants';
import cx from 'clsx';
import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Group, ErrorMessage } from '../common';
import Label from '../common/Label/Label';
import { IconStyled } from '../common/icon/IconStyled';
import { Icon } from '../common';
import { PhoneInputStyle } from './styled';
import { useSelector } from 'react-redux';

const formatLandlineNumber = (inputValue) => {
  if (!inputValue) return '';
  
  let cleaned = inputValue.replace(/[^\d+]/g, '');
  
  if (!cleaned.startsWith('+92')) {
    if (cleaned.startsWith('92')) {
      cleaned = '+92' + cleaned.substring(2);
    } else if (cleaned.startsWith('+9') && cleaned.length > 2) {
      cleaned = '+92' + cleaned.substring(2);
    } else if (cleaned.startsWith('+')) {
      cleaned = '+92' + cleaned.substring(1);
    } else {
      cleaned = '+92' + cleaned;
    }
  }
  
  const digits = cleaned.substring(3);
  
  const limitedDigits = tenantConstants.key === 'zameen' ? digits : digits.substring(0, 9);
  
  if (limitedDigits.length === 0) {
    return '+92';
  } else if (limitedDigits.length <= 2) {
    return `+92 ${limitedDigits}`;
  } else {
    const areaCode = limitedDigits.substring(0, 2);
    const number = limitedDigits.substring(2);
    return `+92 ${areaCode} ${number}`;
  }
};

const CustomInput = React.forwardRef((props, ref) => {
  const { value, onChange, ...rest } = props;
  const [displayValue, setDisplayValue] = useState(() => {
    return value ? formatLandlineNumber(value) : '';
  });
  const inputRef = useRef(null);

  const actualRef = ref || inputRef;

  useEffect(() => {
    if (value !== undefined) {
      const formatted = formatLandlineNumber(value);
      if (formatted !== displayValue) {
        setDisplayValue(formatted);
        if (actualRef.current && document.activeElement === actualRef.current) {
          const cursorPosition = actualRef.current.selectionStart;
          setTimeout(() => {
            if (actualRef.current) {
              const newPosition = Math.min(cursorPosition, formatted.length);
              actualRef.current.setSelectionRange(newPosition, newPosition);
            }
          }, 0);
        }
      }
    } else if (value === '' || value === null) {
      setDisplayValue('');
    }
  }, [value, displayValue, actualRef]);

  const handleChange = useCallback((e) => {
    const inputValue = e.target.value;
    const cursorPosition = e.target.selectionStart;
    const formatted = formatLandlineNumber(inputValue);
    
    setDisplayValue(formatted);
    
    if (onChange) {
      onChange(formatted);
    }
    
    setTimeout(() => {
      if (actualRef.current) {
        const beforeCursor = inputValue.substring(0, cursorPosition);
        const beforeCursorCleaned = beforeCursor.replace(/[^\d+]/g, '');
        const formattedBeforeCursor = formatLandlineNumber(beforeCursorCleaned);
        const newPosition = Math.min(formattedBeforeCursor.length, formatted.length);
        actualRef.current.setSelectionRange(newPosition, newPosition);
      }
    }, 0);
  }, [onChange, actualRef]);

  return (
    <input
      ref={actualRef}
      type="tel"
      value={displayValue}
      onChange={handleChange}
      {...rest}
    />
  );
});

CustomInput.displayName = 'CustomInput';

const LandlineInput = (props) => {
  const {
    name,
    label,
    labelProps,
    className,
    errorMsg,
    placeholder,
    id,
    value,
    containerClassName,
    onChange,
    onBlur,
    inputContainerClass,
    labelIcon,
    addSpacing,
    disabled,
    ...rest
  } = props;

  const { rtl } = useSelector((state) => ({ rtl: state.app.AppConfig.rtl }));

  const renderLabel = () => {
    return label ? (
      <Label htmlFor={name} {...labelProps}>
        {label}
      </Label>
    ) : null;
  };

  const handleChange = useCallback((phoneValue) => {
    const formatted = formatLandlineNumber(phoneValue || '');
    if (onChange) {
      onChange(formatted);
    }
  }, [onChange]);

  return (
    <>
      {labelIcon && (
        <IconStyled>
          <Icon icon={labelIcon} />
        </IconStyled>
      )}
      {addSpacing && <div style={{ width: 35.2 }} />}
      <Group className={cx(className, containerClassName)} template="initial" gap="8px" id={id}>
        {renderLabel()}
        <div className={cx(inputContainerClass)}>
          <Group template="1fr" gap="8px">
            <PhoneInputStyle
              value={value}
              onChange={handleChange}
              onBlur={onBlur}
              defaultCountry="PK"
              placeholder={placeholder}
              international
              className={rtl && 'rtlPhone'}
              disabled={disabled}
              countrySelectProps={{ disabled: true }}
              countryCallingCodeEditable={false}
              inputComponent={CustomInput}
              {...rest}
            />
          </Group>
          {errorMsg && <ErrorMessage message={errorMsg} />}
        </div>
      </Group>
    </>
  );
};

LandlineInput.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  labelProps: PropTypes.object,
  className: PropTypes.string,
  errorMsg: PropTypes.string,
  placeholder: PropTypes.string,
  id: PropTypes.string,
  value: PropTypes.string,
  containerClassName: PropTypes.string,
  inputContainerClass: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  labelIcon: PropTypes.string,
  addSpacing: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default LandlineInput;

