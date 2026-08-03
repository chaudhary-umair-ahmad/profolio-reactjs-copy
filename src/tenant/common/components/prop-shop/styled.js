import { Card, Radio } from 'antd';
import React from 'react';
import { default as Styled, default as styled } from 'styled-components';
import { Group, TextWithIcon } from '../../../../components/common';

export const PropShopCard = Styled((props) => <Card bordered={false} {...props} />)`
  @media only screen and (max-width: 991px){
    border-radius: 0;
    background: transparent;
  }

  .ant-card-head {
    @media only screen and (min-width: 992px){
      border: none;
      padding-bottom: 8px;
    }
    @media only screen and (max-width: 991px){
      border-radius: 0;
    }
    @media only screen and (max-width: 767px){

      padding-inline: 16px 0;
    }

    .ant-card-head-title {
      font-size: 24px;
      font-weight: 700;
      padding-block: 20px 12px;
    }
    .ant-tabs {
      @media only screen and (min-width: 992px){
        padding-inline-end: 50%;
      }

      .ant-tabs-nav-list {
        gap: 20px;
        @media only screen and (min-width: 992px){
          gap: 32px;
        }
      }
    }
    .ant-tabs-top > .ant-tabs-nav::before {
      // border: none;
    }
    .propshop-image {
      position: absolute;
      inset-inline-end: 32px;
    }
  }

  > .ant-card-body {
    padding: 16px;

    @media only screen and (min-width: 992px){
      padding: 0 64px;
    }
  }

`;

export const ProductsListing = Styled((props) => <Radio.Group {...props} />)`
  display: grid;
  gap: 8px;

  @media only screen and (min-width: 992px){
    gap: 18px;
  }

  > .ant-card-grid {
    width: 100%;

    .ant-radio-wrapper::after {
      display: none;
    }
  }

`;

export const ValidAlert = Styled((props) => <TextWithIcon {...props} />)`
  @media only screen and (max-width: 991px){
    background-color: ${({ theme }) => theme['primary-light-4']};
    padding: 8px 12px;
    margin-top: 12px;
    border-radius: 4px;
    strong {
      font-weight: 400;
    }
  }
`;

export const ProductList = Styled((props) => <Card.Grid {...props} />)`
  box-shadow: none;
  padding: 0;

  .ant-radio-wrapper {
    padding: 16px 12px;
    margin: 0;
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    gap: 12px;
    border-radius: 6px;
    background-color: #fff;
    border: 1px solid ${({ theme }) => theme['border-color-base']};

    @media only screen and (min-width: 992px){
      padding: 16px 20px;
    }

    &-checked {
      background-color: ${({ theme }) => theme['primary-light-4']};
      border-color: ${({ theme }) => theme['primary-light-3']};
    }

    > span + * {
      flex: 1;
      padding: 0;
    }

    &:after {
      display: none;
    }
  }
`;

export const CardPackages = styled((props) => <Group {...props} />)`
  .card-container {
    .slick-track {
      display: flex;
      gap: 8px;
    }
    &.cardShadow {
      &::after {
        content: '';
        position: absolute;
        inset-block-start: 0;
        inset-inline-end: 0;
        width: 100px;
        height: 100%;
        background: ${(props) =>
          props.isRtl
            ? 'linear-gradient(to right, #ffffff 0%, rgba(255, 255, 255, 0.02) 100%)'
            : 'linear-gradient(270deg, #ffffff 0%, rgba(255, 255, 255, 0.02) 100%)'};
        border-radius: 12px;
      }
    }
  }
  .titanium-card {
    background: linear-gradient(213.08deg, rgba(243, 218, 255, 0.31) 7.77%, rgba(247, 236, 253, 0.1) 51.51%);
    border: 1px solid #f3d9ff;

    &:hover {
      .listing-tag {
        background: linear-gradient(263.91deg, #bb51eb 2.05%, #dd94ff 97.78%);
        color: #fff !important;
      }
    }
  }
  .package-list {
    position: relative;
    &:hover {
      background-color: #0061690a;
      border-color: ${({ theme }) => theme['primary-light-1']};
    }
    @media only screen and (max-width: 767px) {
      background-color: #0061690a;
      border-color: ${({ theme }) => theme['primary-light-1']};
      .listing-tag {
        background: linear-gradient(83.24deg, #28b16d -3.89%, #006169 93.22%);
        color: #fff !important;
      }
    }
    &:hover {
      .listing-tag {
        background: linear-gradient(83.24deg, #28b16d -3.89%, #006169 93.22%);
        color: #fff !important;
      }
    }
  }
  .listing-tag {
    position: absolute;
    top: -1px;
    right: -1px;
    font-weight: 700;
    padding: 4px 8px;
    border-radius: 0 10px 0 4px;
    font-style: italic;
  }

  .next-btn {
    position: absolute;
    inset-inline-end: 0;
    top: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0px 0px 12px 0px #00000024;
    z-index: 3;
  }

  .prev-btn {
    position: absolute;
    inset-inline-start: 0;
    top: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0px 0px 12px 0px #00000024;
    z-index: 3;
  }

  @media only screen and (max-width: 767px) {
    .slick-slide {
      padding-inline: 6px;
    }
    .slick-slider {
      margin-inline: -6px;
    }
  }
`;

export const CreditTopUpCard = styled((props) => <Card {...props} />)`
  // &.topUpCard {
  //   background: linear-gradient(180deg, rgba(225, 245, 236, 0.6) -3.21%, rgba(255, 255, 255, 0.6) 42.14%);
  //   @media only screen and (max-width: 767px) {
  //     border-radius: 0;
  //   }
  // }
`;
