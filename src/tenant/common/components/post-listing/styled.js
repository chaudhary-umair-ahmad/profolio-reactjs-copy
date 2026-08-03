import tenantTheme from '@theme';
import { Card, List, Steps } from 'antd';
import React from 'react';
import Styled from 'styled-components';
import { Card as CommonCard, Flex, Modal } from '../../../../components/common';

export const ListViewStyled = Styled(List)`
  --grid-template: 1fr;
  --grid-gap: 0;

  .ant-spin-container {
    display: grid;
    grid-template-columns: var(--grid-template);
    gap: var(--grid-gap);
  }

  .ant-list-split .ant-list-item:last-child{
    border-block-end: initial;
  }
`;
export const ModalRegaStyled = Styled((props) => <Modal {...props} />)`
  .ant-modal-header {
    background-color: ${tenantTheme['primary-light-4']};
    border-bottom: none;
    padding: 24px 20px 18px;
  }

`;

export const RegaCardStyle = Styled((props) => <CommonCard {...props} />)`
  &.ant-card {
    position: relative;
    background: var(--bg-color, linear-gradient(180deg, #EBF4FB -22.8%, #FFFFFF 123.35%) ) ;
    border-color: #CCDFE1;
    border-inline-width: 0;
    @media only screen and (min-width: 992px){
      border-inline-width: 1px;
    }

    .rega-card-container{
      background-color: ${tenantTheme['primary-light']};
      border: 1px solid #E1F0F0;
    }

    @media screen and (max-width: 700px) {
      background-color: #fff;
      
    }
  
    animation: regaShadow 3s;

    @keyframes regaShadow {
      0% {box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;}
      100% {box-shadow: rgba(0, 0, 0, 0) 0px 5px 15px;}
    }


  }

  .ant-collapse > .ant-collapse-item > .ant-collapse-header{
    position: inherit;
  }

  .arrowIcon{
    .ant-collapse-expand-icon{
      position: absolute;
      inset-block-end: -30px;
      inset-inline-start: 50%;
      border-radius: 50%;
      height: 35px !important;
      padding-inline-end: 0 !important;
      width: 35px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid  ${tenantTheme['primary-light-2']};


      background-color:  ${tenantTheme['primary-light']};
       .ant-collapse-item .ant-collapse-header .ant-collapse-arrow {
        font-size: 16px !important;
       }
       span{
        font-size: 20px !important;
        margin-inline-end: 0 !important;
        svg{
          transform: rotate(90deg) !important;
          color: ${tenantTheme['primary-color']};
        }
       
       }

    }
    .ant-collapse-item-active{
      .ant-collapse-arrow{
        svg{
          transform: rotate(-90deg) !important;

        }
      }
    }
   
  }

  .regaLink{
    display: inline-block;
    white-space: break-spaces;
    padding-inline: 0;
  }
  

`;

export const CheckboxPlatforms = Styled.div`
  max-width: 640px;
  position: relative;

  .ant-checkbox {
    position: initial;
  }

  .ant-checkbox-inner {
    border-radius: 4px;
  }

  .ant-checkbox-checked {
    &::after {
      animation: none;
    }

    &::before {
      background-color: ${tenantTheme['primary-light']};
      border: 1px solid ${tenantTheme['primary-color']};
      border-radius: ${tenantTheme['border-radius-base']};
      content: '';
      position: absolute;
      inset: 0;
    }

    .ant-checkbox-inner {
      position: relative;

      &::after {
        left: 20%;
      }
      &::before {
        content: '';
        position: absolute;
        inset: 0;
      }
    }
  }

  .ant-checkbox-wrapper {
    border-radius: ${tenantTheme['border-radius-base']};
    display: flex;
    align-items: center;
    background-color: ${(props) => props.theme['bg-color-light']};
    border: 1px solid ${tenantTheme['border-color-normal']};

    padding: 10px;
    @media only screen and (min-width: 992px){
      padding: 22px 24px;
    }

    > span:not(.ant-checkbox) {
      display: inherit;
      align-items: inherit;
      flex-grow: 1;
      justify-content: space-between;
      position: relative;
      z-index: 1;
    }
  }
`;

export const BlockTitle = Styled.h2`
  font-size: 1.125em;
  font-weight: 600;
  line-height: 1.2;

  @media only screen and (min-width: 992px){
    max-width: 128px;
  }
`;

export const SelectOnMap = Styled.button`
  background-color: #fff;
  background-image: url(${(props) => props.imgUrl || ''});
  background-size: 100%;
  background-position: cover;
  border: 0;
  border-radius: ${tenantTheme['border-radius-base']};
  box-shadow: inset 0 0 0 1px rgb(0 0 0 / 2%), inset 0 0 16px rgb(0 0 0 / 8%);
  cursor: pointer;
  display: grid;
  place-content: center;
  height: 105px;
  transition: box-shadow 0.24s ease-in-out;

  .anticon {
    color: ${tenantTheme['primary-color']};
  }

  &.pointerDisabled {
    cursor: not-allowed;
    pointer-events: auto !important;
  }

  &:not([disabled]):hover {
    box-shadow: inset 0 0 0 1px ${tenantTheme['primary-color']}, inset 0 0 16px rgb(0 0 0 / 8%);
  }
`;

export const CardListing = Styled((props) => <Card bordered={false} {...props} />)`
  --ant-box-shadow-tertiary: none;
  margin-top: 0;
  margin-bottom: 0;

  @media only screen and (max-width: 991px) {
    border-radius: 0;
  }

  .ant-card-body {
    padding: 16px;

    @media only screen and (min-width: 992px){
      padding: 0 64px;
    }
  }

`;

export const PriceCheckWrapper = Styled.div`
  padding: 6px 8px;
  background: #F5F5F5 ;
  color: #A3A3A3;
  border-radius:20px;
  font-size: 12px;
  line-height: 1;
  font-weight:600;
    span{
      color: #00A651;
      font-size:1.2em;
    }
`;
export const PriceCheckValue = Styled.p`
  color: #A3A3A3;
  margin-bottom:0px !important;
  font-size: 14px;
  line-height: 1;
  font-weight:400;
`;

export const TextInputRTL = Styled.div`
  // direction: ${({ theme }) => (theme.rtl ? 'ltr' : 'rtl')};
  direction: rtl;
  @media only screen and (min-width: 992px){
    margin-inline-start: ${({ theme }) => (theme.rtl ? '0' : '-50px')};
  }
  padding-inline-end: ${({ theme }) => (theme.rtl ? '0' : '50px')};
`;

export const FormFieldPrefix = Styled.div`
  position: absolute;
  inset-inline-end: 0;
  bottom: -26px;

  > a {
    font-size: 14px;
    color: ${tenantTheme['primary-color']};
    display: flex;
    gap: 4px;


    &:hover {
      color: ${tenantTheme['primary-color']};
    }
  }
`;

export const PostListingAction = Styled.div`
  display: flex;
  justify-content:space-between;
  align-items: center;
  gap: 12px;

  
  @media only screen and (min-width: 992px){
    > button.ant-btn {
      padding: 8px 36px;
    }
  }

  @media only screen and (max-width: 991px){
    background-color: #fff;
    box-shadow: 0px -4px 10px 0px rgba(0, 0, 0, 0.1);
    position: fixed;
    bottom: 0;
    padding: 16px;
    left: 0;
    right: 0;
    z-index: 2;

    > button.ant-btn {
      flex-grow: 1;
    }



  }
`;

export const StepsStyled = Styled((props) => <Steps {...props} />)`
  &.ant-steps {
    max-width: 560px;
    margin-inline: auto;
    --title-max-width: 100px;

    .ant-steps-item-icon {
      border: none;
    }

    .ant-steps-item-finish .ant-steps-item-icon {
      background-color: ${tenantTheme['primary-light-2']};
    }

    @media only screen and (max-width: 992px){
      padding-inline: 16px;
      .ant-steps-item-title {
        white-space: break-spaces;
      }
    }

    .ant-steps-item-title {
      max-width: var(--title-max-width);
    }


  }
`;

// export const StickyCredit = Styled.div`
// position: absolute;
// inset-inline-start: 0;
// @media only screen and (min-width: 992px){
//   inset-inline-start: 80px;
// }
// inset-inline-end: 0;
// bottom: 0;
// background-color: #fff;
// box-shadow: 0px -2px 30px 0px #9299B81A;
// z-index: 3;
// `;

export const GenerateTitle = Styled((props) => <Flex {...props} />)`
.generate-btn{
  > {
    &:last-child{
      margin-left: 4px;
  
    }
  }

}

`;
