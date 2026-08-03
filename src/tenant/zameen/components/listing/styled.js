import React from 'react';
import { Space } from 'antd';
import styled from 'styled-components';
import { DropdownStyled } from '../../../../components/common/dropdown/dropdown-style';
import { Group, Card } from '../../../../components/common';

export const TenantList = styled(props => <Group {...props} />)`
  align-items: center;
`;

export const ListingCardStyled = styled(props => <Card {...props} />)`
  &.ant-card {
    color: #707070;
    font-size: 12px;
  }

  ${DropdownStyled} {
    border: unset;
    cursor: pointer;
    padding: 0 4px;
  }
`;

export const SwitchWrapped = styled(Space.Compact)`
  align-items: center;
  padding: 8px 12px;
  border-radius: 6px;
  background-color: #f2fafa;
  gap: 8px;
`;
