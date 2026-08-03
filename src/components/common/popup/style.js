import tenantTheme from '@theme';
import { Popover } from 'antd';
import styled from 'styled-components';

const Content = styled.div`
  a,
  .span {
    display: block;
    color: #888;
    padding: 6px 12px;
    text-align: start;

    span {
      padding-inline-start: 12px;
    }
  }
  a:hover {
    background: ${tenantTheme['primary-color']}10;
    color: ${tenantTheme['primary-color']};
  }
`;

const Title = styled.p`
  text-align: start;
  margin-block-end: 0;
`;

const PopoverStyled = styled(Popover)`
  line-height: 1;
`;

PopoverStyled.displayName = 'PopoverStyled';
export { Content, PopoverStyled, Title };
