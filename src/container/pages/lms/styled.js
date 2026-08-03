import tenantTheme from '@theme';
import React from 'react';
import { Card, Drawer, Flex, TextInput } from '../../../components/common';
import styled from 'styled-components';

export const TextField = styled((props) => <TextInput {...props} />)`
  .anticon-close-circle {
    svg {
      height: 20px;
      width: 20px;
    }
  }
  .ant-input-suffix {
    line-height: 0;
  }
`;
export const DrawerContainer = styled((props) => <Drawer {...props} />)``;
export const ReportCard = styled((props) => <Card {...props} />)`
  &.reportCard {
    flex: auto;
    .ant-card-body {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 12px;
      @media only screen and (max-width: 767px) {
        gap: 8px;
      }
    }
  }
`;
export const UserCard = styled((props) => <Flex {...props} />)`
  &.card-order {
    @media only screen and (max-width: 767px) {
      > div {
        &:nth-child(1) {
          order: 1;
        }
        &:nth-child(2) {
          order: 3;
        }
        &:nth-child(3) {
          order: 4;
        }
        &:nth-child(4) {
          order: 2;
        }
      }
    }
  }
`;
