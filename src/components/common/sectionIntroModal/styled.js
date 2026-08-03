import tenantTheme from '@theme';
import React from 'react';
import Styled from 'styled-components';
import { Modal } from '../modals/antd-modals';

export const IntroModal = Styled((props) => <Modal {...props} />)`
 .ant-modal-content {
   
    .ant-modal-header{
     padding: 0;
     padding-top: 45px;
      background: linear-gradient(178.74deg, #F2FAFA 27.98%, #C7FFFF 86.14%);
    }
  }

`;
