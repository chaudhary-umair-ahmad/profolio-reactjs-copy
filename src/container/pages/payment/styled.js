import Styled from 'styled-components';
import React from 'react';
import { Card } from '../../../components/common';

const PaymentFrame = Styled(props => <Card {...props} />)`

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

const PaymentSuccess = Styled(props => <Card {...props} />)`

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
const PaymentCard = Styled(props => <Card {...props} />)`
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
const PaymentContainer = Styled(props => <Card {...props} />)`
.ant-card-head-wrapper{
align-items: start;
}

`;

export { PaymentFrame, PaymentSuccess, PaymentCard, PaymentContainer };
