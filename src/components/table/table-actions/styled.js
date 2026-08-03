import { Typography } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { Dropdown } from '../../common';

export const ActionDropDown = styled((props) => <Dropdown {...props} />)`
  &.ant-dropdown {
    .ant-dropdown-menu {
      padding-inline: 12px;
      padding-block: 12px;
      padding-bottom: 0;
    }
    a {
      padding: 0;
    }
    a svg {
      margin-inline-end: 0;
    }
  }
`;
