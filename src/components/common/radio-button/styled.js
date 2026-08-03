import tenantTheme from '@theme';
import { Radio, Tabs } from 'antd';
import chroma from 'chroma-js';
import Styled from 'styled-components';

export const RadioPill = Styled(Radio)`
align-items: center;
background-color: var(--radio-pill-bg, ${tenantTheme['radio-pill-bg']});
border-radius: ${(props) => (props.shape === 'round' ? 24 : 6)}px;

&.ant-radio-wrapper {
  align-items: center;
  font-size: var(--radio-pill-font-size, 14px);
  margin-inline-end: unset;
  color: var(--radio-pill-text-color, ${tenantTheme['radio-pill-text-color']});
  border: 1px solid var(--radio-pill-border-color, ${tenantTheme['radio-pill-border-color']});
}

.ant-radio {
  clip: rect(0, 0, 0, 0);
  opacity: 0;
  position: absolute;
}

> span:not(.ant-radio) {
    align-items: center;
    justify-content: center;
    display: inline-flex;
    gap: 4px;
    min-width: 36px;
    line-height: ${(props) => (props.size === 'small' ? '24px' : '32px')};
    padding-inline: var(--padding-x, .7rem);
  }

  &.ant-radio-wrapper-checked {
    --radio-pill-bg: ${({ color }) => (color ? chroma(color).alpha(0.1) : tenantTheme['radio-pill-checked-bg'])};
    --radio-pill-border-color: ${({ color }) => color || tenantTheme['radio-pill-checked-border-color']};
    --radio-pill-text-color: ${({ color }) => color || tenantTheme['radio-pill-checked-text-color']};
     font-weight: 700;
  }

  ${(props) =>
    props.size === 'small' &&
    `
    padding: .1em .2em !important;

    .ant-badge-status-text {
      font-size: var(--font-size, 12px)!important;
      vertical-align: baseline;
    }
  `}
`;
RadioPill.displayName = 'RadioPillStyled';

export const RadioButtonStyled = Styled(Radio.Button)`
  --radio-btn-bg: ${({ color }) => (color ? chroma(color).alpha(0.1) : tenantTheme['primary-light-3'])};
  --radio-btn-color: ${({ color }) => color || tenantTheme['primary-color']};
  --radio-btn-border-color: currentColor;
  --_input-height: var(--radio-btn-height, ${tenantTheme['input-height-base']});

  &.ant-radio-button-wrapper {
    color: ${tenantTheme['gray-color']};
    height: var(--_input-height);
    line-height: calc(var(--_input-height) - 2px);
    --ant-color-border: #f0f0f0;

    &.ant-radio-button-wrapper-checked {
      background-color: var(--radio-btn-bg);
      border-color: var(--radio-btn-border-color);
      color: var(--radio-btn-color);
    }

    &:hover {
      color: var(--radio-btn-color);
    }

    span:not(.ant-radio) {
      display: flex;
      align-items: center;
      gap: 8px;
      ${(props) => props.block && 'justify-content: center;'}
    }
  }

  &.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
    &::before {
      background-color: var(--radio-btn-border-color)
    }

    &:first-child {
      border-color: var(--radio-btn-border-color);
    }

    &:hover,
    &:active {
      color: var(--radio-btn-color);
      border-color: currentColor;

      &::before {
        background-color: currentColor;
      }
    }

    &:focus-within {
      box-shadow: none;
    }
  }

  &.ant-radio-button-wrapper-checked:not([class*=" ant-radio-button-wrapper-disabled"]).ant-radio-button-wrapper:first-child {
    border-color: var(--radio-btn-border-color);
  }
`;
RadioButtonStyled.displayName = 'RadioButtonStyled';

export const RadioGroupStyled = Styled(Radio.Group)`
  gap: var(--radio-group-gap, 8px);

  &.ant-radio-group {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    font-size: inherit;

    &-small {
      --radio-btn-height: ${tenantTheme['input-height-sm']};
    }

    &-large {
      --radio-btn-height: ${tenantTheme['input-height-lg']};
    }

    ${(props) =>
      props?.block &&
      `
      > * {
        flex: 1;
        justify-self: center;
      }
      `}
  }
`;

export const RadioListStyled = Styled('div')`
  .radio-list-item {
    display: grid;
    align-items: center;
    flex-wrap: wrap;
    font-size: inherit;
  }

  .product-tag {
    font-size: 12px;
    padding: 3px 7px 2px;
    border-radius: 5px;
    text-transform: uppercase;
    white-space: nowrap;

    @media only screen and (max-width: 991px){
      font-size: 11px;
      padding: 2px 5px;
    }
  }

  label {
    display: block;
    border-radius: 0;
    margin-inline-end: 0;
    margin-top: -1px;
    padding: 18px 20px !important;

    .credits {
      svg {
        margin-inline-end: 8px;
      }
    }

    &:first-child {
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
    }

    &:last-child {
      border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;
    }

    &.list-item-checked {
      // --upgrade-bg-color: #e9f3ef;
      // --upgrade-border-color: #7ed8aa;

      background: rgb(255,255,255);
      background: linear-gradient(0deg, rgba(255,255,255,1) 0%, var(--upgrade-bg-color) 100%);
      border-color: var(--upgrade-border-color);

      position: relative;
      z-index: 2;

      .credits {
        color: ${tenantTheme['heading-color']};
      }
    }

    > span:not(.ant-radio) {
      display: grid;
      gap: 16px;
      grid-template-columns: 1fr;
      align-items: flex-start;
      padding: 0;
    }

    button {
      border: none;
    }
  }

  .ant-radio-wrapper::after {
    display: none;
  }
`;

RadioButtonStyled.displayName = 'RadioButtonStyled';

export const TabsStyled = Styled(Tabs)`
  &.ant-tabs {
    &,
    .ant-tabs-tab {
      font-size: inherit;
    }


  @media only screen and (max-width: 768px){
   .ant-tabs-nav{
   margin-bottom: 0 !important;
  }
  }

  }
`;
