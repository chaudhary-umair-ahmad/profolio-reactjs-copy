import Styled from 'styled-components';
import { Alert } from 'antd';
import chroma from 'chroma-js';

const outline = (theme, type) => {
  return `
    border: 1px solid ${theme[`${type}-color`]} !important;
    background: #fff!important;
    &:hover, &:focus, &:active {
      .ant-alert-message, .ant-alert-message{
        color: #fff;
      }
    }
    .ant-alert-message, .ant-alert-message {
      color: ${theme[`${type}-color`]}
    }
  `;
};

const themed = (theme, type) => {
  return `
    background-color: ${chroma.mix('fff', theme[`${type}-color`], 0.16).saturate(0.08)};
  `;
};

const AlertStyled = Styled(Alert)`
  &.ant-alert {
    border-radius: clamp(0px, ((100vw - 4px) - 100%) * 9999, 6px) / 6px;

    .ant-alert-message {
      margin-bottom: 0;
      color: ${({ color }) => color};
      font-weight: 600;
    }
    .ant-alert-description {
      color: ${({ color }) => color}
    }
  }

  &.ant-alert-with-description{
    padding: 8px 8px;
  }

  &.ant-alert-closable {
    .ant-alert-message{
      display: block;
    }
  }

  .ant-alert-close-text{
    font-size: 12px;
    line-height: 1.5;
  }

  ${({ outlined, theme, type }) => outlined && outline(theme, type)}
  // $ {({ theme, type }) => themed(theme, type)}

  ${({ showIcon, theme, messageColor }) =>
    showIcon &&
    `.ant-alert-icon{
      top: 20px !important;
      ${theme.rtl ? 'right' : 'left'}: 15px !important;
    }
    i.ant-alert-icon {
      color: ${({ type }) => theme[`${type}-color`]} !important;
      background: #ffffff80 !important;
      height: 100%;
      width: 50px;
      position: absolute;
      top: 0;
      ${theme.rtl ? 'right' : 'left'}: 0;
    }`}


  .ant-alert-close-icon {
    top: 12px !important;
    ${({ theme }) => (!theme.rtl ? 'right' : 'left')}: 20px !important;
    svg,
    span,
    img,
    i{
      width: 8px;
      height: 8px;
    }
  }
`;

export { AlertStyled };
