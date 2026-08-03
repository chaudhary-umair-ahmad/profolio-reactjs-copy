import tenantTheme from '@theme';
import { Tabs } from 'antd';
import Styled from 'styled-components';

const { TabPane } = Tabs;

const TabColor = (colors) => `
  margin-bottom: 30px !important;
  .ant-tabs-bar {
    margin: 0;
  }
  .ant-tabs-nav-list{
    margin: 0;
  }
  .ant-tabs-nav{
    color : ${({ color }) =>
      color !== 'default' && color !== '#ffffff' && color !== '#fff' && color !== 'white' ? '#ffffff' : '#000000'};
  }
  .ant-tabs-nav .ant-tabs-tab:hover, .ant-tabs-nav .ant-tabs-tab:focus {
    //background : ${colors !== 'default' && colors};
    color : ${({ color }) =>
      color !== 'default' && color !== '#ffffff' && color !== '#fff' && color !== 'white' ? '#ffffff' : '#000000'};
  }
  .ant-tabs-nav .ant-tabs-tab.ant-tabs-tab-active {
    border: none;
    border-radius: 3px;
    background : ${colors !== 'default' && colors};
  }
  .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn{
    color : ${
      colors !== 'default' && colors !== '#ffffff' && colors !== '#fff' && colors !== 'white' ? '#ffffff' : '#5F63F2'
    };
  }
  .ant-tabs-ink-bar {
    background: transparent
  }
`;

const TabChildColor = (color) => `
  h1, h2, h3, h4, h5, h6, p, span, i {
    padding: 15px;
    background : ${color !== 'default' && color};
    color : ${
      color !== 'default' && color !== '#ffffff' && color !== '#fff' && color !== 'white' ? '#ffffff' : '#000000'
    };
    margin: 0;
  }

`;

const TabBasic = Styled(Tabs)`
  ${({ color }) => color && TabColor(color)};

  &.ant-tabs-top.ant-tabs-mobile .ant-tabs-nav {
    overflow: hidden;
  }

  &.ant-tabs-pills.ant-tabs-top {
    .ant-tabs-nav::before { content: none; }

    .ant-tabs-ink-bar { display: none; }

    .ant-tabs-nav-list {
      gap: 8px;
    }

    .ant-tabs-tab {
      border: 1px solid #E6E6E6;
      border-radius: 32px;
      font-size: .875rem;
      line-height: 1.2;
      padding: 8px 12px;
    }

    .ant-tabs-tab-active {
      border-color: ${tenantTheme['primary-color']};
      background-color: ${tenantTheme['primary-light']};
    }
  }
`;

const Child = Styled(TabPane)`
    /* background: ${({ color }) =>
      color !== 'default' && color !== '#ffffff' && color !== '#fff' && color !== 'white' ? '#ffffff' : '#000000'}; */
    ${({ color }) => color && TabChildColor(color)}
`;

export { Child, TabBasic };
