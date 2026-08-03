// import 'react-phone-number-input/style.css';

import 'react-phone-number-input/style.css';

import tenantTheme from '@theme';
import { Space, Typography } from 'antd';
import cx from 'clsx';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Button, ErrorMessage, Group, Icon } from '../common';
import Label from '../common/Label/Label';
import { IconStyled } from '../common/icon/IconStyled';
import { PhoneInputStyle } from './styled';
import { useSelector } from 'react-redux';

const PhoneIntl = (props) => {
  const {
    name,
    label,
    labelProps,
    className,
    errorMsg,
    horizontal,
    labelClassName,
    loading,
    errorClassName,
    placeholder,
    id,
    value,
    containerClassName,
    onChange,
    onBlur,
    inputContainerClass,
    defaultCountry,
    labelIcon,
    addSpacing,
    index,
    isMobile,
    touched,
    addMobileField,
    removeMobileField,
    addDisable,
    extra,
    ...rest
  } = props;

  const [country, setCountry] = useState('PK');

  const renderLabel = () => {
    return label ? (
      <Label htmlFor={name} {...labelProps}>
        {label}
      </Label>
    ) : null;
  };

  const { rtl } = useSelector((state) => ({ rtl: state.app.AppConfig.rtl }));

  const renderInput = (number, index) => {
    return (
      <PhoneInputStyle
        value={number}
        onChange={(e) => onChange(e, index)}
        onBlur={() => onBlur && onBlur(index)}
        defaultCountry={defaultCountry}
        placeholder={placeholder}
        // countrySelectComponent={Select}
        // countrySelectProps={{
        //   getOptionLabel: option => option.label,
        //   getOptionValue: option => {
        //     return option.value;
        //   },
        //   valueAsObj: true,
        //   // value: country,
        //   // onChange: (value, option) => {
        //   //   // setCountry(value);
        //   // },
        // }}
        international
        className={rtl && 'rtlPhone'}
        {...rest}
      />
    );
  };

  const renderMultipleInputs = (index) => {
    return (
      <>
        {(index > 0 || index + 1 === value.length) && (
          <Space
            direction={isMobile && 'vertical'}
            align={isMobile ? 'start' : 'end'}
            style={{ justifyContent: 'end' }}
          >
            {index > 0 && (
              <Button
                style={{ padding: 'unset', width: 49, height: 49 }}
                icon="MdClose"
                iconColor={tenantTheme['error-color']}
                iconSize="1.4em"
                onClick={() => {
                  removeMobileField(index);
                }}
              />
            )}
            {index + 1 === value.length && index < 2 && (
              <Button
                style={{ padding: 'unset', width: 49, height: 49 }}
                icon="AiOutlinePlus"
                iconColor={tenantTheme['primary-color']}
                onClick={() => {
                  addMobileField();
                }}
                disabled={value.length >= 3 || addDisable}
              />
            )}
          </Space>
        )}
        {/* {value.length >= 3 && index + 1 === value.length && value.length - 1 == index && (
          <Typography.Text type="danger">You&apos;ve reached maximum limit of 3 mobile numbers</Typography.Text>
        )} */}
      </>
    );
  };
  return (
    <>
      {typeof value === 'string' ? (
        <>
          {labelIcon && (
            <IconStyled>
              <Icon icon={labelIcon} />
            </IconStyled>
          )}
          {addSpacing && <div style={{ width: 35.2 }} />}
          <Group className={(rest.className, containerClassName)} template="initial" gap="8px" id={id}>
            {renderLabel()}
            <div className={cx(inputContainerClass)}>
              <Group
                template={`
            ${!isMobile ? '1fr' : '1fr auto'}`}
                gap={`${!isMobile ? '8px' : '0'}`}
              >
                {renderInput(value)}
                {extra && extra}
              </Group>
              {extra && extra}
              {!!errorMsg && (
                <Typography.Text type="danger">
                  <small>{errorMsg}</small>
                </Typography.Text>
              )}
            </div>
          </Group>
        </>
      ) : (
        value?.map((mobile, index) => {
          return (
            <React.Fragment key={index}>
              {index === 0 && labelIcon && (
                <IconStyled>
                  <Icon icon={labelIcon} />
                </IconStyled>
              )}
              {index !== 0 && labelIcon && <div style={{ width: 35.2 }} />}
              <Group className={(rest.className, containerClassName)} template="initial" gap="8px" id={id}>
                {index === 0 && renderLabel()}
                <div className={cx(inputContainerClass)}>
                  <Group
                    template={`
                      ${
                        isMobile ? '1fr auto' : index > 0 ? '1fr auto' : index + 1 === value.length ? '1fr auto' : '1fr'
                      }`}
                    gap={`${!isMobile || index > 0 || index + 1 === value?.length ? '8px' : '0'}`}
                  >
                    {renderInput(mobile, index)}
                    {renderMultipleInputs(index)}
                  </Group>
                  {!!touched?.[`${index}`] && !!errorMsg?.[index] && <ErrorMessage message={errorMsg?.[index]} />}
                </div>
              </Group>
            </React.Fragment>
          );
        })
      )}
    </>
  );
};

PhoneIntl.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  labelProps: PropTypes.object,
  className: PropTypes.string,
  errorMsg: PropTypes.string,
  horizontal: PropTypes.bool,
  labelClassName: PropTypes.string,
  loading: PropTypes.bool,
  errorClassName: PropTypes.string,
  placeholder: PropTypes.string,
  id: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  containerClassName: PropTypes.string,
  inputContainerClass: PropTypes.string,
  defaultCountry: PropTypes.string,
  onChange: PropTypes.func,
  labelIcon: PropTypes.string,
};

export default PhoneIntl;
