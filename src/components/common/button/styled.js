import tenantTheme from '@theme';
import { Button } from 'antd';
import chroma from 'chroma-js';
import Styled from 'styled-components';

const ButtonGroup = Button.Group;

const outline = (theme, type, color) => {
  return `
    --btn-bg-color: transparent;
    --btn-content-color: ${color ? chroma(color).darken(0.1) : type !== 'default' && theme[`${type}-color`]};
    --btn-border-color: ${type !== 'light' ? 'currentColor' : theme['border-color-normal']};

    &.ant-btn {
      border-color: var(--btn-border-color);
    }

    &:hover, &:focus {
      --btn-border-color: ${
        type !== 'light' && type !== 'default' ? 'var(--btn-bg-color)' : theme['border-color-normal']
      };
    }
  `;
};
const primaryOutline = (theme, type, color) => {
  return `
    --btn-bg-color: var(--bg-color, ${theme['primary-light-4']}) ;
    --btn-content-color: var(--content-color,  ${theme['primary-color']});
    --btn-border-color: var(--border-color,  ${theme['primary-light-1']} );

    &.ant-btn {
      border-color: var(--btn-border-color);
    }

    &:hover, &:focus {
      --btn-bg-color: ${theme['primary-color']};
      --btn-content-color: #fff !important;
      --btn-border-color:${theme['primary-color']};
    }
  `;
};
const dubizzlePrimaryBtn = (theme, type, color) => {
  return `
    --btn-bg-color: #fff;
    --btn-content-color:  ${theme['primary-color']};
    --btn-border-color: #F0F0F0;

    &.ant-btn {
      border-color: var(--btn-border-color);
    }

    &:hover, &:focus {
      --btn-bg-color: ${chroma(theme['dubizzle-primary']).mix('#fff', 0.9).saturate(0.1)};
      --btn-border-color:${chroma(theme['dubizzle-primary']).mix('#fff', 0.5).saturate(0.3)};
     --btn-content-color: ${theme['primary-color']} !important;

    }
  `;
};

const ghosts = (theme) => {
  return `
          background: transparent;
          border: 1px solid ${theme['border-color-normal']} !important;
          color: ${theme['border-color-normal']} !important;

          &:hover, &:focus {
              background: #ffffff50 !important;
              border: 1px solid transparent !important;
              color: ${theme['border-color-normal']} !important;
          }
      `;
};

const transparents = (theme, type) => {
  return `
        background: ${type !== 'default' && theme[`${type}-color`]}15;
        color: ${type !== 'default' && theme[`${type}-color`]};

        &.ant-btn,
        &.ant-btn[disabled],
        &.ant-btn[disabled]:hover,
        &.ant-btn[disabled]:focus,
        &.ant-btn[disabled]:active {
          border-color: transparent;
        }

        &:hover, &:focus {
            background: ${type !== 'default' && theme[`${type}-hover`]}15;
            color: ${type !== 'default' && theme[`${type}-hover`]};
        }
    `;
};

const raise = (theme, type) => {
  return `
        box-shadow: 0 10px 15px ${type !== 'white' ? theme[`${type}-color`] : '#9299B8'}20;
    `;
};

const square = (theme, type) => `
      background: ${type !== 'default' && theme[`${type}-color`]};
      border: 1px solid ${type !== 'default' ? theme[`${type}-color`] : theme['disabled-color']};
      color: ${type !== 'default' && '#fff'};
      border-radius: 0px;
      padding: 0px 15px;

      &:hover, &:focus {
          background: ${type !== 'default' && theme[`${type}-hover`]};
          border: 1px solid ${type !== 'default' && theme[`${type}-hover`]};
          color: ${type !== 'default' && '#fff'};
      }
  `;

const squareOutline = (theme, type) => `
      background: transparent;
      border: 1px solid ${type !== 'default' ? theme[`${type}-color`] : theme['disabled-color']};
      color: ${type !== 'default' && theme[`${type}-color`]};
      border-radius: 0px;
      padding: 0px 15px;
      &:hover, &:focus {
          background: ${type !== 'default' && theme[`${type}-hover`]};
          border: 1px solid ${type !== 'default' && theme[`${type}-hover`]};
          color: ${type !== 'default' && '#fff'};
      }
  `;

const iconCircled = (color, opaque) => `
  --btn-bg-color: ${
    color && !opaque ? chroma(color).alpha(0.1) : color && opaque ? color : null || tenantTheme['bg-color-normal']
  };
  --btn-content-color: ${color || tenantTheme['extra-light-color']};

  && {
    border-color: transparent;
    padding: 4px;

    &:hover,
    &:focus {
      --btn-bg-color: ${
        color && !opaque ? chroma(color).alpha(0.1) : color && opaque ? color : null || tenantTheme['bg-color-normal']
      };
      --btn-content-color: ${color || tenantTheme['primary-color']};

    --ant-button-default-hover-border-color: transparent;
    --ant-button-default-hover-bg:${
      color && !opaque ? chroma(color).alpha(0.1) : color && opaque ? color : null || tenantTheme['primary-light-3']
    };
    --ant-button-default-active-border-color: var( --ant-button-default-hover-bg);
    --ant-button-default-active-bg: var( --ant-button-default-hover-bg);
    }

    .ant-btn-loading-icon {
      display: flex;
    }
  }
`;

const socialButton = (color, shape) => `
      background: ${color};
      border: 1px solid ${color};
      color: #fff;
      border-radius: ${!shape ? '4px' : '40px'};
      padding: 0px 12px;
      display: inline-flex;
      align-items: center;
      span {
          padding-inline-start: 5px;
      }
      &:hover, &:focus {
          background: ${color}90;
          border: 1px solid ${color}90;
          color: #fff;
      }
  `;

const ButtonStyled = Styled(Button)`
  --btn-bg-color: ${({ type, theme }) => type !== 'default' && theme[`${type}-color`]};
  --btn-content-color: ${({ type, color }) => (color || type === 'default' ? tenantTheme['gray-color'] : '#fff')};
  --btn-padding-y: 0.428571em;

  border-style: ${({ type }) => (type !== 'dashed' ? 'solid' : 'dashed')};
  border-radius: ${({ shape }) => (!shape ? tenantTheme['border-radius-base'] : '40px')};
  box-shadow: 0 0;
  text-shadow: none;

  &:hover, &:focus, &:active {
    --btn-bg-color: ${({ type, theme, color }) =>
      color ? chroma(color).darken(0.1) : type !== 'default' && theme[`${type}-hover`]};
    --btn-content-color: ${({ type, color }) => (color || type !== 'default' ? '#fff' : tenantTheme['primary-color'])};
      --ant-color-primary-hover: var(--btn-bg-color);
      --ant-color-primary-active: var(--btn-bg-color);

  }


  &:not(.ant-btn-link) {
    background-color: var(--btn-bg-color, #fff);
    color: var(--btn-content-color);
  }

  // &:not(.ant-btn-icon-only) {
  //   height: unset;
  // }

  &.ant-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: ${(props) => (props.size === 'large' ? '16px' : props.size === 'small' ? '13px' : 'inherit')};
    font-weight: 600;
    padding: var(--btn-padding-y) 1em;
    text-shadow: none;

    &[href] {
      padding-block-start: var(--btn-padding-y) !important;
    }

   &.ant-btn-link {
      --btn-content-color: ${tenantTheme['primary-color']};
      color: var(--btn-content-color);

      &:hover,&:focus {
        --btn-content-color: ${tenantTheme['primary-color']};
        --ant-color-link-hover: var(--btn-content-color);

      }
      --ant-color-link-active: var(--btn-content-color);

    }


    svg {
      vertical-align: middle;
      pointer-events: none;
    }
  }

  i,
  svg,
  img {
    + span {
      margin-inline-start: 6px;
    }
  }

  ${({ transparent, theme, type }) => transparent && transparents(theme, type)};
  ${({ outlined, theme, type, color }) => outlined && outline(theme, type, color)};
  ${({ type, theme, color }) => {
    if (type === 'primaryOutlined') {
      return primaryOutline(theme, type, color);
    }
  }};
  ${({ type, theme, color }) => {
    if (type === 'dubizzlePrimary') {
      return dubizzlePrimaryBtn(theme, type, color);
    }
  }};
  ${({ ghost, theme }) => ghost && ghosts(theme)};
  ${({ raised, theme, type }) => raised && raise(theme, type)};
  ${({ squared, theme, type }) => squared && square(theme, type)};
  ${({ squared, outlined, theme, type }) => squared && outlined && squareOutline(theme, type)};
  ${({ social, color, shape }) => social && socialButton(color, shape)};
  ${({ icon, shape, color, opaque }) => icon && shape === 'circle' && iconCircled(color, opaque)};
`;

const ButtonStyledGroup = Styled(ButtonGroup)`
  > .ant-btn:first-child {
    border-top-left-radius: 3px !important;
    border-bottom-left-radius: 3px !important;
  }

  button {
    margin: 0;
    padding: 0 10.75px;
    // height: 30px;
    font-size: 12px;
    font-weight: 500;
  }

  .ant-btn-light:hover {
    background: #f4f5f7;
  }
`;

export { ButtonStyled, ButtonStyledGroup };
