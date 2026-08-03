import tenantTheme from '@theme';
import { Tabs } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { Flex, Group } from '../../../../components/common';

export const TabsStyled = styled((props) => <Tabs {...props} />)`
  &.ant-tabs {
    margin-inline: -16px;
    margin-block-end: -8px;

    &.ant-tabs-rtl {
      .ant-tabs-nav .ant-tabs-tab {
        margin: initial;
      }
    }

    &.agencyTabs {
      .ant-tabs-tab {
        .anticon {
          margin-right: 0;
        }
      }
    }
  }

  .ant-tabs-nav {
    margin-block-end: 0;
  }
`;

export const Stats = styled((props) => <Group {...props} />)`
  background-color: #f9f9f9;
  border: 1px solid ${tenantTheme['border-color-base']};
  padding: 8px 16px;
  border-radius: ${tenantTheme['border-radius-base']};
`;

export const HealthContainer = styled((props) => <Flex {...props} />)`
  @media only screen and (max-width: 400px) {
    gap: 15px !important;
  }
  @media only screen and (max-width: 767px) {
    gap: 0px !important;
  }
`;
