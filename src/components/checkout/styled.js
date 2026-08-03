import React from 'react';
import Styled from 'styled-components';
import { Card } from '../common';
import tenantTheme from '@theme';
import { Steps } from 'antd';

const TransactionCard = Styled((props) => <Card {...props} />)`
  .ant-card-head {
    background-color: ${tenantTheme['primary-light-4']};
    border-radius: 8px 8px 0 0;
    padding-inline: 20px;

    @media only screen and (max-width: 768px) {
      .ant-card-head-wrapper {
        justify-content: space-between;
        align-items: center;
      }
      .ant-card-head-title {
        padding-block: 10px !important;
        flex: none;
      }
      .ant-card-head-wrapper {
        flex-direction: row;
        .ant-card-extra {
          padding-block: 10px;
        }
      }
    }
  }
  .ant-card-body {
    padding: 20px;
  }
  .;

 .payment-steps {
   .ant-steps-item-icon {
      border-color: transparent;
       background: ${tenantTheme['primary-light-3']} !important;
    
      
       .ant-steps-icon {
       font-weight: 700;
        color: ${tenantTheme['primary-color']};
       }
    }
     .ant-steps-item-title{
     font-size:14px;
     line-height: 1.6;    
     color: ${tenantTheme['primary-color']} !important;
     
     }

 
}

`;

const PaymentFrame = Styled((props) => <Card {...props} />)`

  &.ant-card-bordered {
    border: 1px solid ${({ theme }) => theme['primary-light-1']};
    border-radius: 6px;

    .ant-card-head {
      background-image: linear-gradient(${({ theme }) => theme['primary-light-4']}, transparent);
      border: none;
      padding-inline: 36px !important;
      font-weight: 400;
      border-radius: 6px;
      
      @media only screen and (max-width: 991px){
        padding-inline: 16px !important;
      }
      
      .ant-card-head-wrapper {
        flex-flow: row;
        align-items: center !important;
        
        @media only screen and (min-width: 992px){
          min-height: 76px;
        }
        
        @media only screen and (max-width: 991px){
          .ant-card-head-title {
            padding: 0 !important;
          }
        }
      }
    }
    
    .ant-card-body {
      padding: 36px;
      @media only screen and (max-width: 991px){
        padding: 16px;
      }
    }
  }

  label {
    font-size: 16px;
    font-weight: 400;
  }

  .creditInput {
    border: 0;
    border-bottom: 1px solid ${({ theme }) => theme['border-color-normal']};
    font-weight: normal;
    font-size: 0.85rem;
    height: 36px;
    width: 100%;
    color: #333;
    outline: none;
    font-family: inherit;
    border-radius: 0;

    &.error,
    &.number-invalid {
      border-bottom: 1px solid ${({ theme }) => theme['error-color']};
    }

    // stylelint-disable selector-no-vendor-prefix
    &::-webkit-input-placeholder {
      color: hsla(0, 0%, 0%, 0.32);
      background-color: transparent;
    }

    &::-moz-placeholder {
      color: hsla(0, 0%, 0%, 0.32);
      opacity: 1;
      background-color: transparent;
    }
    // stylelint-enable selector-no-vendor-prefix
  }
`;

const PaymentSuccess = Styled((props) => <Card {...props} />)`

  .ant-card-body {
    padding: 84px;
    
    @media only screen and (max-width: 768px){
      padding: 24px;
    }
    
  }
  
  .svgIcon {
    margin-bottom: 70px;
    
    @media only screen and (max-width: 768px){
      margin-bottom: 30px;
      height: 100px;
    }
  }
  
  h2 {
    font-size: 1.375rem;
    margin-bottom: 26px;
  }
  
  h3 {
    font-size: 1.125rem;
    font-weight: 500;
    margin-bottom: 12px;
  }
  
  .para {
    max-width: 556px;
    margin-inline: auto;
  }
  
  @media only screen and (min-width: 768px){
    .btnQuota {
      padding-block: 13px;
    }
  }

  // .btnBack {
    // padding-block: 13px;
  // }


`;
const PaymentCard = Styled((props) => <Card {...props} />)`
&.ant-card{
  @media only screen and (max-width: 768px){
  min-width: 140px;
  width:100%;


}
&.active-card{
&.ant-card {
    border: 1px solid  ${({ theme }) => theme['primary-color']};
    background-color: ${({ theme }) => theme['primary-light']};
}
}

`;
const PaymentContainer = Styled((props) => <Card {...props} />)`
.ant-card-head-wrapper{
align-items: start;
}

`;

const TabbyStepper = Styled((props) => <Steps {...props} />)`
  &.ant-steps{
   @media only screen and (max-width: 768px){
      .ant-steps-item-content{
        --ant-steps-icon-size: 0px !important;
  
  }
    }
  .ant-steps-item-tail{
   &::after{
       --ant-color-split: ${tenantTheme['primary-light-3']};
   }
  }  
  }

`;

export { PaymentCard, PaymentContainer, PaymentFrame, PaymentSuccess, TransactionCard, TabbyStepper };
