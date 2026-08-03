import styled from 'styled-components';
import React, { forwardRef } from 'react';
import { Drawer } from '../drawer/drawer';

export const BottomSheetDrawer = styled(forwardRef((props, ref) => <Drawer {...props} ref={ref} />))`
  &.drawer-container {
    border-top-left-radius: 24px;
    border-top-right-radius: 24px;
    .ant-drawer-header {
      --ant-padding-lg: 16px;
      --ant-padding: 20px;
      position: relative;
      //   .ant-drawer-header-title {
      //     text-align: center;
      //   }
      &:after {
        content: '';
        display: block;
        width: 44px;
        height: 4px;
        background-color: #eaeaea;
        border-radius: 10px;
        position: absolute;
        left: 50%;
        top: 10px;
        bottom: 0;
        transform: translateX(-50%);
      }

      ${({ gradientBackground }) =>
        gradientBackground &&
        `
        background: linear-gradient(180deg, rgba(40, 177, 109, 0.15) 0%, rgba(76, 162, 205, 0.07) 108.09%);
        border-bottom: 0;
      `}
    }
    .ant-drawer-body {
      --ant-padding-lg: var(--drawer-space, 16px);
    }
  }
`;
