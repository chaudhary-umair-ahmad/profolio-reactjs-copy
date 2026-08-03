import tenantTheme from '@theme';
import { List, Tag } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { CustomCard } from '../common';

export const NotificationsWrapper = styled((props) => <CustomCard {...props} />)`
  &.notification-center {
    margin-bottom: 0 !important;
    &:hover {
      background-color: ${tenantTheme['primary-light-4']};
    }
  }
`;
