import tenantTheme from '@theme';
import { List } from 'antd';
import React from 'react';
import Styled from 'styled-components';
import { Modal } from '../../common';

// import { DropdownStyled } from './common/dropdown/dropdown-style';
// import { Card, Group } from './common';

// export const TenantList = Styled(Group)`
//   align-items: center;
//   padding-block: 12px;

//   &:not(:last-child) {
//     border-block-end: 1px solid #e6e6e6;
//   }
// `;

// export const ListingCardStyled = Styled(Card)`
//   &.ant-card {
//     color: #707070;
//     font-size: 12px;
//   }

//   ${DropdownStyled} {
//     border: unset;
//     padding: 4px;
//   }
// `;

export const ListViewStyled = Styled(List)`
  --grid-template: 1fr;
  --grid-gap: 0;

  .ant-spin-container {
    display: grid;
    grid-template-columns: var(--grid-template);
    gap: var(--grid-gap);
  }
`;
export const ModalRegaStyled = Styled((props) => <Modal {...props} />)`
  .ant-modal-header {
    background-color: ${tenantTheme['primary-light-4']}
    border-bottom: none;
  }
`;
