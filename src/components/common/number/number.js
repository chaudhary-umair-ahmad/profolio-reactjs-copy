import tenantConstants from '@constants';
import { Tooltip, Typography } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import { formatNumberString, formatPriceValue } from '../../../utility/utility';

const Number = (props = {}) => {
  const {
    value,
    size = 'sm',
    compact = true,
    type = 'number',
    currency,
    unit,
    style,
    dashForNone = false,
    typoOptions,
    tooltip = true,
    fractionDigits,
    intl = false,
    fraction,
    subKey,
    dataIndex,
    ...rest
  } = props;

  const commonOptions = { currency: currency || tenantConstants.CURRENCY, intl: intl };

  const getText = (type) => {
    if (!value && dashForNone) return ' - ';
    switch (type) {
      case 'price':
        return formatPriceValue(value, {
          ...commonOptions,
          minimumFractionDigits: fraction ? 2 : 0,
          maximumFractionDigits: fraction ? 2 : 0,
          dashForNone,
          fractionDigits: fractionDigits,
        });
      case 'priceCompact':
        return formatPriceValue(value, {
          ...commonOptions,
          notation: 'compact',
          unitDisplay: 'narrow',
          dashForNone,
          fractionDigits: fractionDigits,
        });
      case 'priceWordCompact':
        return formatPriceValue(
          value,
          {
            ...commonOptions,
            notation: 'compact',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
            dashForNone,
            fractionDigits: fractionDigits,
          },
          null,
          null,
          false,
        );
      case 'numberCompact':
        return formatNumberString(value, {
          ...commonOptions,
          notation: 'compact',
          unitDisplay: 'narrow',
          dashForNone,
          fractionDigits: fractionDigits,
        });
      default:
        return formatNumberString(value, { ...commonOptions, dashForNone, fractionDigits: fractionDigits });
    }
  };

  const getTooltipText = (tooltipType = type) => {
    switch (tooltipType) {
      case 'price':
        return formatPriceValue(value, { ...commonOptions });
      default:
        return formatNumberString(value, { ...commonOptions });
    }
  };

  const getValue = () => {
    if (compact) {
      return getText(`${type}Compact`);
    }
    return getText(type);
  };

  return compact ? (
    tooltip ? (
      <Tooltip placement="top" title={<span>{getTooltipText(type)}</span>}>
        <Typography.Text style={{ ...style }} {...typoOptions} {...rest}>
          {getValue()}
          {unit ? ` ${unit}` : ''}
        </Typography.Text>
      </Tooltip>
    ) : (
      <Typography.Text style={{ ...style }} {...typoOptions} {...rest}>
        {getValue()}
        {unit ? ` ${unit}` : ''}
      </Typography.Text>
    )
  ) : (
    <Typography.Text style={{ ...style }} {...typoOptions} {...rest}>
      {getValue()}
      {unit ? (typeof unit !== 'string' ? unit : ` ${unit}`) : ''}
    </Typography.Text>
  );
};

Number.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  compact: PropTypes.bool,
  type: PropTypes.oneOf(['number', 'price']),
  currency: PropTypes.string,
  unit: PropTypes.string,
  style: PropTypes.object,
  dashForNone: PropTypes.bool,
  typoOptions: PropTypes.object,
};

export default Number;
