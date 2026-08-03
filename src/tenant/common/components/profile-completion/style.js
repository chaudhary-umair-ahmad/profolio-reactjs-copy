import Styled from 'styled-components';
import { Avatar, Card, DrawerModal } from '../../../../components/common';
import { Progress } from 'antd';
import tenantTheme from '@theme';

export const AvatarStyled = Styled((props) => <Avatar {...props} />)`



`;

export const ProgressStyled = Styled((props) => <Progress {...props} />)`
  
  &.ant-progress {
    .ant-progress-inner {
      overflow: visible;
    }
    .ant-progress-text {
      margin-inline-start: 0 !important;
      paddingTop: 1px;
    }

  }

`;
export const ModalCompletion = Styled((props) => <DrawerModal {...props} />)`
 &.profile-completion{
   position: relative;
   .congrats-lottie{
     position: absolute;
     inset: 0;
   }
 }

`;
export const ProfileCard = Styled((props) => <Card {...props} />)`
  &.ant-card {
    --ant-color-bg-container: ${tenantTheme['primary-light-4']};
    --ant-padding-lg: 16px;
    box-shadow: 0px 1px 6px 0px #0000001C; 
    border: 1px solid ${tenantTheme['primary-light-2']};
      @media only screen and (min-width: 767px){
      border-radius: 12px;
      }


  }
`;
