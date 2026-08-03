import tenantTheme from '@theme';
import { Card } from 'antd';
import Styled from 'styled-components';

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
    fontSize: 16,
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

export const CardListing = Styled(Card)`
  font-size: 14px !important;

  @media only screen and (min-width: 992px){
    font-size: 16px !important;
  }

  .ant-card-body {
    padding: 16px;

    @media only screen and (min-width: 992px){
      padding: 32px 64px;
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
