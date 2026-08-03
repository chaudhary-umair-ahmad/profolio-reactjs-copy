import { Col, Input, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { ErrorMessage, Icon, Select, Skeleton } from '..';

import PropTypes from 'prop-types';
import { allowInput } from '../../../utility/utility';
import Label from '../Label/Label';
import Group from '../group/group';
import { IconStyled } from '../icon/IconStyled';
import { PriceCheckWrapper } from './styled';

function TextInputWithUnit(props) {
  const {
    label,
    placeholder,
    prefixIcon,
    labelIcon = null,
    name,
    skeletonLoading = false,
    value,
    handleChange,
    handleBlur,
    unitList,
    unitPosition = 'right',
    onInputChange = () => {},
    onUnitChange,
    unitValue,
    bottomRightContent,
    bottomLeftContent,
    errorMsg,
    onInputBlur,
    size,
    selectProps,
    type = 'text',
    limit,
    useInternalState,
    ...rest
    // suffixIcon,
  } = props;

  const [fieldValue, setFieldValue] = useState('');

  useEffect(
    () => {
      setFieldValue(value);
    },
    useInternalState ? [value] : [],
  );

  const renderUnit = () => {
    return (
      <Select
        name={`${name}Unit`}
        value={unitValue}
        placeholder="Select Unit"
        options={unitList}
        onChange={onUnitChange}
        getOptionValue={(e) => e.id}
        getOptionLabel={(e) => e.title}
        disabled={!(unitList?.length > 1)}
        status={!!errorMsg ? 'error' : undefined}
        placement="bottomRight"
        popupMatchSelectWidth={false}
        size={size}
        {...selectProps}
      />
    );
  };
  return (
    <div>
      {skeletonLoading ? (
        <Skeleton active avatar={labelIcon} paragraph={{ rows: 1 }} />
      ) : (
        <Group template="max-content auto" gap="16px">
          {labelIcon && (
            <IconStyled>
              <Icon icon={labelIcon} />
            </IconStyled>
          )}
          <Group template="initial" gap="8px">
            {label && <Label htmlFor={name}>{label}</Label>}
            <Row wrap={false} gutter={12}>
              {unitPosition !== 'right' && <Col flex="auto">{renderUnit()}</Col>}
              <Col xs={14} sm={18}>
                <Input
                  prefix={prefixIcon && <Icon icon={prefixIcon} size={14} />}
                  name={name}
                  value={useInternalState ? fieldValue : value}
                  onChange={(e) => {
                    useInternalState && allowInput(type, e.target.value, limit) && setFieldValue(e.target.value);
                    allowInput(type, e.target.value, limit) && onInputChange && onInputChange(e.target.value);
                  }}
                  onBlur={onInputBlur}
                  placeholder={placeholder}
                  status={!!errorMsg ? 'error' : undefined}
                  size={size}
                />
              </Col>
              {unitPosition === 'right' && <Col flex="auto">{renderUnit()}</Col>}
            </Row>
            {bottomRightContent || bottomLeftContent ? (
              <PriceCheckWrapper>
                {!!bottomLeftContent && bottomLeftContent(useInternalState ? fieldValue : value)}
                {!!bottomRightContent && bottomRightContent()}
              </PriceCheckWrapper>
            ) : null}

            <ErrorMessage message={errorMsg} />
          </Group>
        </Group>
      )}
    </div>
  );
}

TextInputWithUnit.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  prefixIcon: PropTypes.string,
  labelIcon: PropTypes.string,
  name: PropTypes.string,
  skeletonLoading: PropTypes.bool,
  value: PropTypes.string,
  handleChange: PropTypes.func,
  handleBlur: PropTypes.func,
  unitList: PropTypes.array,
  unitPosition: PropTypes.string,
  onInputChange: PropTypes.func,
  onUnitChange: PropTypes.func,
  unitValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  // suffixIcon: PropTypes.string,
};

export default TextInputWithUnit;
