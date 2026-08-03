import Styled from 'styled-components';
import { JSONForm } from '../../../components/common';
import { Card } from 'antd';

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
  // max-width: 1248px;
  // margin-inline: auto;
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

export { Nav, NavWrapper };

export const CardMetaStyled = Styled(({ titleFontWeight, titleWhiteSpace, titleFontSize, descColor, ...rest }) => (
  <Card.Meta {...rest} />
))`

  display: flex;
  padding-inline: 4px;
  align-items: var(--content-align);

  @media only screen and (min-width: 992px){
    padding-inline:  40px;
    padding-top: 10px;
  }
  @media only screen and (max-width: 991px){
    padding-bottom: 20px;
  }

  .ant-card-meta-avatar {
    --ant-padding: var(--profile-space, 16px);
    .img {
      padding: 10px;
      --icon-styled-width: auto;

      @media only screen and (min-width: 992px){
        padding: 20px;
      }
    }
  }

  .ant-card-meta-detail {
    display: flex;
    flex-flow: column;
    align-self: center;
    height: var(--card-height);
  }

  .ant-card-meta-title {
    margin-bottom: 2px !important;
    //text-transform: capitalize;
    font-weight: ${(props) => props.titleFontWeight};
    white-space: ${(props) => props.titleWhiteSpace || 'nowrap'};

    @media screen and (min-width: 991px){
     font-size: ${(props) => props.titleFontSize || '20px'};
    }
  }

  .ant-card-meta-description {
    color:   ${(props) => props.descColor || '#A3A3A3'} ;
    word-break: break-all;
    font-size: var(--desc-font);
  }
`;

export const ActionButton = Styled.div`
  display: flex;
  gap: 16px;

  @media screen and (min-width: 992px) {
    justify-content: end;
  }

  @media screen and (max-width: 991px) {
    background-color: #fff;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    box-shadow: 0px -4px 10px 0px rgba(0, 0, 0, 0.1);
    padding: 16px;
    z-index: 2;
    gap: 10px;
    > * {
      flex-grow: 1;
    }

  }
`;
