import tenantTheme from '@theme';
import { Input, Typography } from 'antd';
import chroma from 'chroma-js';
import React from 'react';
import styled from 'styled-components';

export const InputStyled = styled(
  ({ noRightRadius, getOptionLabel, okText, minDate, accentColor, reportsStaticRanges, allowInput, ...rest }) => (
    <Input {...rest} />
  ),
)`
  &.ant-input-affix-wrapper {
    border-radius: ${tenantTheme['border-radius-base']};
    border-color: var(--input-border-color, ${tenantTheme['input-border-color']});
    box-shadow: 0 0 0 2px var(--input-shadow, transparent);

    input[type='number']::-webkit-outer-spin-button,
    input[type='number']::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    input[type='number'] {
      -moz-appearance: textfield;
    }

    &:not(.ant-input-affix-wrapper-disabled) {
      &:hover {
        border-color: var(--input-border-color, ${tenantTheme['input-border-color']});
      }

      &:hover,
      &:focus,
      &.ant-input-affix-wrapper-focused {
        --input-border-color: ${({ accentColor }) => accentColor || tenantTheme['primary-color']};
        --input-shadow: ${({ accentColor }) =>
          accentColor ? chroma(accentColor).alpha(0.1) : tenantTheme['primary-light-3']};
      }
    }
  }

  ${(props) =>
    props.noRightRadius &&
    `
     &.ant-input-affix-wrapper {
      border-start-end-radius: 0;
      border-end-end-radius: 0;

    }
  `}
`;
InputStyled.displayName = 'InputStyled';

export const ErrorMsg = styled((props) => <Typography.Text {...props} />)`
  font-size: 13px;
  margin-top: -6px;
`;
