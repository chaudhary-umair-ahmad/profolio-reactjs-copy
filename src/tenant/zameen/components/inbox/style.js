import tenantTheme from '@theme';
import { Badge } from 'antd';
import React from 'react';
import Styled from 'styled-components';

const Nav = Styled.nav`
  ul{
    list-style: none;
    margin: 20px 0;
    padding: 0;
    li{
      position: relative;
      &.add-label-btn{
        &:hover{
          background: transparent;
          a{
            background: transparent;
            color: ${({ theme }) => theme['primary-color']} !important;
          }
        }
        a{
          color: ${({ theme }) => theme['light-color']} !important;
          transition: .3s;
          &:hover{
            background: transparent;
            svg,
            i,
            span{
              color: ${({ theme }) => theme['primary-color']};
            }
          }
        }
      }
      a{
        padding: 8px 15px;
        display: flex;
        align-items: center;
        transition: 0.3s ease;
        border-radius: 4px;
        color: ${({ theme }) => theme['gray-color']};
        svg{
          min-width: 18px;
          margin-inline-end: 20px;
          color: ${({ theme }) => theme['extra-light-color']};
        }
        &.active{
          background: rgba(95,99,242,0.1);
          color: ${({ theme }) => theme['primary-color']};
          svg,
          i{
            color: ${({ theme }) => theme['primary-color']};
          }
        }
      }

      &:hover{
        a{
          background: rgba(95,99,242,0.1);
          color: ${({ theme }) => theme['primary-color']};
          svg,
          i{
            color: ${({ theme }) => theme['primary-color']};
          }
        }
      }
      .nav-text{
        width: 100%;
        display: flex;
        justify-content: space-between;
      }
      }
    }
  }
`;

const NavWrapper = Styled.div`
  position: relative;
  // .trigger-close.ant-btn-link{
  //   margin: 0 !important;
  //   position: absolute;
  //   ${({ theme }) => (!theme.rtl ? 'right' : 'left')}: 20px;
  //   top: 20px;
  //   z-index: 99;
  //   padding: 0;
  //   background: transparent !important;
  // }
  // .trigger-col {
  //   @media only screen and (max-width: 991px){
  //     text-align: center;
  //   }
  // }
  .ant-btn-link{
    background: #fff !important;
    margin-bottom: 25px;
    border-radius: 6px;
    color: ${({ theme }) => theme['primary-color']} !important;
    &:focus{
      color: ${({ theme }) => theme['primary-color']} !important;
    }
  }
  .mail-sideabr{
    &.hide{
      transform: translateX(${({ theme }) => (theme.rtl ? '100%' : '-100%')});
      transition: .35s ease-in;
    }
    &.show{
      transform: translateX(0%);
      transition: .35s ease-in;
    }
    @media only screen and (max-width: 991px){
      display: block;
      background: #fff;
      position: fixed;
      ${({ theme }) => (theme.rtl ? 'right' : 'left')}: 0;
      top: 60px;
      width: 280px;
      height: 100%;
      z-index: 99;
    }
    .ant-card{
      min-height: 900px;
      .ant-card-body{
        padding: 0px !important;
      }
    }
  }

  .mail-sidebar-top{
    padding: 30px 30px 0;
    @media only screen and (max-width: 991px){
      padding: 60px 30px 0;
    }
  }

  .mail-sidebar-bottom{
    padding: 0 15px 25px 15px;
  }

  table{
    .ant-table-tbody{
      .ant-table-cell{
        vertical-align: top;
      }
    }
  }
`;

export const BadgeMobileStyle = Styled((props) => <Badge {...props} />)`
  .ant-badge-count {
    font-size: 11px;
    margin: -3px 0 0 12px;
    height: 16px;
    min-width: 16px;
    line-height: 16px;
    padding: 0;
    background-color: ${tenantTheme['primary-color']};
  }
`;

export { Nav, NavWrapper };
