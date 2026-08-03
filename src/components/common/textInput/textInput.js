import { Input, Row, Skeleton } from 'antd';
import React, { useEffect, useState } from 'react';
import { ErrorMessage, Flex, Icon, Spinner } from '..';

import tenantTheme from '@theme';
import PropTypes from 'prop-types';
import { allowInput } from '../../../utility/utility';
import Label from '../Label/Label';
import Group from '../group/group';
import { IconStyled } from '../icon/IconStyled';
import { InputStyled } from './styled';
import { useSelector } from 'react-redux';
import { t } from 'i18next';

function TextInput(props) {
  const {
    label,
    isOptional = false,
    labelProps,
    placeholder,
    prefixIcon,
    suffixIcon,
    iconColor,
    labelIcon = null,
    name,
    skeletonLoading = false,
    value,
    handleChange,
    handleBlur,
    horizontal,
    lineCount,
    errorMsg,
    loading,
    muted,
    useInternalState,
    type = 'text',
    inputType = 'text',
    limit,
    readOnly = false,
    groupStyle,
    extra,
    fieldSize,
    renderPopover,
    button,
    noRightRadius = false,
    areaUnitSuffix,
    priceSuffix,
    /** Shown only after the label text as ` ( … )`, e.g. currency symbol for price fields */
    labelSuffixInBrackets = null,
    reserveLabelIconColumn = false,
    reserveLabelIconColumnAtEnd = false,
    ...rest
  } = props;

  const [fieldValue, setFieldValue] = useState('');
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);

  useEffect(
    () => {
      setFieldValue(value);
    },
    useInternalState ? [value] : [],
  );

  const renderLabel = () => {
    return skeletonLoading ? (
      <Skeleton.Button active size="small" style={{ height: 22 }} />
    ) : (
      label && (
        <Label muted={muted} htmlFor={name} {...labelProps}>
          <Flex align="center" gap="4px" style={{ flexWrap: 'wrap' }}>
            {label}
            {labelSuffixInBrackets !== false &&
              labelSuffixInBrackets != null &&
              !(typeof labelSuffixInBrackets === 'string' && labelSuffixInBrackets.trim() === '') && (
              <span className="label-suffix-in-brackets" style={{ whiteSpace: 'nowrap' }}>
                {' '}
                ({' '}
                {labelSuffixInBrackets}
                {' '})
              </span>
            )}
            {renderPopover && renderPopover()}
          </Flex>
        </Label>
      )
    );
  };

  const renderInput = (showAsTextArea) => {
    const Component = showAsTextArea ? Input.TextArea : inputType === 'password' ? Input.Password : InputStyled;
    return skeletonLoading ? (
      <Skeleton.Input active style={{ borderRadius: 6, width: '100%' }} />
    ) : (
      <>
        <Component
          {...(lineCount && { rows: lineCount })}
          type={type}
          prefix={
            prefixIcon &&
            (typeof prefixIcon === 'string' ? (
              <Icon icon={prefixIcon} size="1.2em" color={iconColor || tenantTheme['primary-color']} />
            ) : (
              prefixIcon
            ))
          }
          readOnly={readOnly}
          suffix={
            loading ? (
              <Spinner size="small" />
            ) : (areaUnitSuffix != null || priceSuffix != null) ? (
              <span style={{ color: 'inherit' }}>{areaUnitSuffix ?? priceSuffix ?? ''}</span>
            ) : (
              suffixIcon && (
                <Icon
                  icon={suffixIcon}
                  size="1.2em"
                  color={iconColor || tenantTheme['primary-color']}
                  onClick={rest.onClick}
                />
              )
            )
          }
          name={name}
          value={useInternalState ? fieldValue : value}
          onChange={(e) => {
            if (useInternalState) {
              if (allowInput(type, e.target.value, limit)) {
                setFieldValue(e.target.value);
                // Sync to Formik so validation sees the value (useInternalState is for display/suffix only)
                handleChange && handleChange(e);
              }
            } else {
              allowInput(type, e.target.value, limit) && handleChange && handleChange(e);
            }
          }}
          onBlur={handleBlur}
          placeholder={placeholder}
          status={errorMsg ? 'error' : undefined}
          key={name}
          size={fieldSize ? fieldSize : !isMobile ? 'middle' : 'small'}
          {...(Component === InputStyled && { noRightRadius: noRightRadius })}
          {...rest}
        />

        {errorMsg && <ErrorMessage message={errorMsg} />}
        {extra && extra()}
        {button && button()}
      </>
    );
  };

  return (
    <>
      {horizontal ? (
        <Row align="middle" justify="space-between">
          {renderLabel()}
          <div style={{ flexBasis: 120 }}>{renderInput(lineCount)}</div>
        </Row>
      ) : labelIcon || reserveLabelIconColumn ? (
        <Group
          template={
            reserveLabelIconColumn && !labelIcon && reserveLabelIconColumnAtEnd
              ? 'auto max-content'
              : 'max-content auto'
          }
          gap="16px"
          style={groupStyle}
        >
          {labelIcon ? (
            <>
              <IconStyled>
                <Icon icon={labelIcon} />
              </IconStyled>
              <Group template="initial" gap="8px" className="w-100" style={{ minWidth: 0 }}>
                {renderLabel()}
                {renderInput(lineCount)}
              </Group>
            </>
          ) : reserveLabelIconColumnAtEnd ? (
            <>
              <Group template="initial" gap="8px" className="w-100" style={{ minWidth: 0 }}>
                {renderLabel()}
                {renderInput(lineCount)}
              </Group>
              <span
                aria-hidden
                style={{
                  display: 'block',
                  width: 32,
                  minWidth: 32,
                  flexShrink: 0,
                  alignSelf: 'start',
                }}
              />
            </>
          ) : (
            <>
              <span
                aria-hidden
                style={{
                  display: 'block',
                  width: 32,
                  minWidth: 32,
                  flexShrink: 0,
                  alignSelf: 'start',
                }}
              />
              <Group template="initial" gap="8px" className="w-100" style={{ minWidth: 0 }}>
                {renderLabel()}
                {renderInput(lineCount)}
              </Group>
            </>
          )}
        </Group>
      ) : (
        <Group className={rest.className} template="initial" gap="8px" style={groupStyle}>
          {renderLabel()}
          {renderInput(lineCount)}
        </Group>
      )}
    </>
  );
}

// TextInput.propTypes = {
//   label: PropTypes.string,
//   labelProps: PropTypes.object,
//   placeholder: PropTypes.string,
//   prefixIcon: PropTypes.string,
//   suffixIcon: PropTypes.string,
//   labelIcon: PropTypes.string,
//   name: PropTypes.string,
//   skeletonLoading: PropTypes.bool,
//   value: PropTypes.string,
//   handleChange: PropTypes.func,
//   handleBlur: PropTypes.func,
//   horizontal: PropTypes.bool,
//   errorMsg: PropTypes.string,
//   lineCount: PropTypes.number,
//   loading: PropTypes.bool,
//   muted: PropTypes.bool,
//   iconColor: PropTypes.string,
//   inputType: PropTypes.oneOf(['text', 'password']),
// };

export default TextInput;
