import tenantTheme from '@theme';
import { Modal } from 'antd';
import Styled from 'styled-components';

const ModalStyledColord = (type, theme) => `
  .ant-modal-content, .ant-modal-header {
    background-color: ${type !== 'default' && theme[`${type}-color`]} !important;
  }

  .ant-modal-title {
    color: #fff;
  }

  .ant-modal-footer button {
    background: #fff;
    color: #999;
    border: 1px solid #ffff;
  }
`;

const ModalStyled = Styled(Modal)`
  ${({ theme, type }) => type && ModalStyledColord(type, theme)}

  &.ant-modal {
    .ant-modal-header {
      --ant-modal-header-margin-bottom: 0;
      .ant-modal-title{
          --ant-font-weight-strong: 700;
      }

    }
  
    
    .ant-modal-content {
      --ant-modal-content-padding: 0;
      --ant-modal-header-padding: 16px 24px;
      --ant-modal-header-border-bottom: 1px solid #f0f0f0;
      --ant-modal-body-padding: 24px;
    }
    .ant-modal-footer {
      --ant-modal-footer-margin-top: 0;
      --ant-modal-footer-border-top: 1px solid #f0f0f0;
    }
  
 

    
  .ant-modal-close {
    color: var(--ant-color-icon, ${tenantTheme['light-gray-color']}) ;
    // inset-inline-end: 5px;
    // top: 12px;
  }
  }


  .ant-modal-footer {
    padding: 16px 24px;

    button {
      font-weight: 500;
      height: 40px;
      padding-inline: 20px;
    }
  }
`;

export { ModalStyled, ModalStyledColord };
