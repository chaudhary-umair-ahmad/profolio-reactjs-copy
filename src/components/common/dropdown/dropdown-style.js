import tenantTheme from '@theme';
import { Dropdown } from 'antd';
import Styled from 'styled-components';

export const Content = Styled.div`
    background-color: #fff;
    box-shadow: 0px 0px 2px #888;
    border-radius: ${tenantTheme['border-radius-base']};
    border: 1px solid #e3e6ef;

    .ant-menu {
      background-color: initial;
    }

    .ant-menu-vertical {
      border-width: 0;
    }

    a i,
    a svg,
    a img {
      margin-inline-start: 8px;
    }

    a {
      display: block;
      color: #888;
      padding: 6px 12px;
    }

    .ant-menu-item:hover,
    a:hover {
      background-color: ${tenantTheme['light-gray-color']}16;
      color: ${tenantTheme['primary-color']}
    }

    .dropdown-theme-2{
      a:hover{
        background-color: ${tenantTheme.pink}10;
        color: ${tenantTheme.pink}
      }
    }

`;

export const DropdownStyled = Styled(Dropdown)`
  background-color: #fff;
  position: relative;
  display: inline-block;
  width: 100%;
  min-width: 0;
  font-size: 14px;
  line-height: 1.5715;
  border: 1px solid ${tenantTheme['input-border-color']};
  border-radius: ${tenantTheme['border-radius-base']};
  transition: all 0.3s;
  padding: 10px 11px;

  &.ant-dropdown-trigger {
    display: flex;
    justify-content: space-between;

    span {
      color: ${tenantTheme[`placeholder-color`]};
    }
  }

  .anticon {
    display: flex;
    align-items: center;
  }

  &:hover,
  &:focus,
  &.ant-dropdown-open {
    border-color: ${tenantTheme[`primary-color`]};
  }
`;
