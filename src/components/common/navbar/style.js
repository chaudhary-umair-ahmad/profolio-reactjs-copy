import Styled from 'styled-components';

const Nav = Styled.nav`
  ul {
    list-style: none;
    // margin: 20px 0;
    // padding: 0;
    word-break: break-all;

    li{
      position: relative;
      &.add-label-btn {
        &:hover {
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

      a {
        padding: 8px 16px;
        display: flex;
        align-items: center;
        transition: 0.3s ease;
        border-radius: 4px;
        color: ${({ theme }) => theme['base-color']};
        font-weight: 500;

        svg {
          min-width: 18px;
          margin-inline-end: 20px;
          color: ${({ theme }) => theme['extra-light-color']};
        }

        &.active {
          background-color: ${({ theme }) => theme['primary-light']};
          color: ${({ theme }) => theme['primary-color']};
          font-weight: 600;

          svg,
          i {
            color: ${({ theme }) => theme['primary-color']};
          }
        }

        &:hover {
          background-color: ${({ theme }) => theme['bg-color-light']};
          color: ${({ theme }) => theme['primary-color']};

          svg,
          i {
            color: ${({ theme }) => theme['primary-color']};
          }
        }
      }

      &:not(:last-child) a {
        margin-block-end: 8px;
      }

      .nav-text{
        width: 100%;
        display: flex;
        justify-content: space-between;
      }
      }
    }

  }

  .folderList {
    margin-top: 10px;

    li {
      a {
        font-weight: 400;
        padding-block: 7px;
      }

      .newFolder {
        color: #BDBDBD !important;
        font-weight: 400;

        .anticon {
          margin-inline: 2px 13px;
        }
      }
    }

  }
`;

const NavWrapper = Styled.div`
  position: relative;
  .trigger-close.ant-btn-link{
    margin: 0 !important;
    position: absolute;
    inset-inline-end: 20px;
    top: 20px;
    z-index: 99;
    padding: 0;
    background: transparent !important;
  }
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
      inset-inline-start: 0;
      top: 75px;
      width: 280px;
      height: 100%;
      z-index: 99;
    }
    .ant-card{
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
    padding: 10px 15px 25px 15px;
    @media only screen and (min-width: 992px){
      padding-top: 0;
    }
  }

  table{
    .ant-table-tbody{
      .ant-table-cell{
        vertical-align: top;
      }
    }
  }
`;

const SideBar = Styled.div`
  display: ${({ collapsed }) => (!collapsed ? 'none' : 'block')}
`;

Nav.displayName = 'Nav';
NavWrapper.displayName = 'NavWrapper';
SideBar.displayName = 'SideBar';

export { Nav, NavWrapper, SideBar };
