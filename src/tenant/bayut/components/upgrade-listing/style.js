import React from 'react';
import styled from 'styled-components';
import { Collapse, Radio } from 'antd';
import { Card, DateSelect, Dropdown, Tag } from '../../../../components/common';
import { SwitchWrapped } from '../../../../components/styled';

export const TagRecommend = styled((props) => <Tag {...props} />)`
  &.ant-tag {
    position: absolute;
    top: 0;
    inset-inline-end: 0;
    border-radius: 0;
    z-index: 2;
    border-start-end-radius: 4px;
    border-end-start-radius: 4px;
    font-size: 10px;
    color: #fff;
    background-color: ${({ theme }) => theme['warning-color']};
    border: none !important;
    margin-inline: 0;
  }
`;

export const CollapseStyled = styled((props) => <Collapse {...props} />)`
  &.ant-tag {
    position: absolute;
    top: 0;
    z-index: 2;
    inset-inline-end: 0;
    border-radius: 0;
    border-start-end-radius: 4px;
    border-end-start-radius: 4px;
    font-size: 10px;
    color: #fff;
    background-color: ${({ theme }) => theme['warning-color']};
    border: none;
  }

  &.listing-card {
    background: linear-gradient(180deg, rgba(0, 97, 105, 0.56) -164.55%, rgba(0, 97, 105, 0) 57.27%);
    border: 1px solid ${({ theme }) => theme['primary-color']};
  }
  .ant-radio-wrapper.ant-radio-wrapper-rtl {
    margin-inline-end: 8px;
  }
`;

export const CollapseRadio = styled((props) => <Radio {...props} />)`
  &.ant-radio-wrapper {
    align-items: center;
    flex-direction: row-reverse;
    text-align: end;
    gap: 4px;
    margin-inline-end: 0;
  }
`;

export const SwitchUpsell = styled((props) => <SwitchWrapped {...props} />)`
  position: absolute;
  background: #fff;
  padding: 2px 20px;
  top: -31px;
  inset-inline-end: -20px;
  white-space: nowrap;
  font-size: 10px;
  text-transform: uppercase;
  flex-direction: row-reverse;
  &.inHead {
    position: unset;
    padding: 0;
  }
`;

export const SwitchUpsellDiv = styled('div')`
  display: flex;
  font-size: 12px;
  gap: 8px;
  align-items: center;
  padding-top: 10px;
  color: ${({ theme }) => theme['primary-color']};
`;

export const UpSellImage = styled('div')`
  height: 140px;
  margin-bottom: 24px;
  @media only screen and (max-height: 900px) {
    height: 110px;
    margin-bottom: 12px;
  }

  @media only screen and (max-width: 991px) {
    height: 100px;
    margin-bottom: 12px;
  }
`;

export const DropdownStyle = styled((props) => <Dropdown {...props} />)`
  border: 1px solid pink;
  background: none;
  .ant-dropdown-trigger {
    border: 1px solid red;
    background: none;
  }
`;
export const CollapseCard = styled((props) => <Card {...props} />)`
  &.collapse-card {
    background-color: ${({ theme }) => theme['primary-light-4']};
  }
`;
export const ListingDateSelect = styled((props) => <DateSelect {...props} />)`
.date-picker{

  &.ant-picker{
    border-color : ${({ theme }) => theme['gray400']};
  }
 .ant-picker-input{
  input{
    &::placeholder{
      color:  ${({ theme }) => theme['gray600']} !important;
    }
  }
 }



}
 }
`;
