import tenantTheme from '@theme';
import { Statistic as AntdStatistic } from 'antd';
import styled from 'styled-components';

export const StatisticStyled = styled(AntdStatistic)`
  &.ant-statistic {
    ${(props) =>
      props.inline &&
      `
      display: flex;
      align-items: baseline;
      gap: 8px;
    `}

    line-height: 1.4;
  }

  .ant-statistic-title {
    color: ${(props) => props.titleColor || tenantTheme.gray700} !important;
    font-size: ${(props) => props.titleFontSize || (props.isMobile ? '0.8571em' : '1em')};
    margin-block-end: 0.1428em;
    font-weight: ${(props) => props.titleFontWeight};
  }

  .ant-statistic-content {
    font-size: ${(props) => {
      return (
        props.fontSize || (props.leader ? '1.5714em' : props.lead ? '1.4285em' : props.isMobile ? '1em' : '1.1428em')
      );
    }};
    font-weight: ${(props) => props.fontWeight || (props.lead || props.leader ? 700 : 700)};
    color: ${(props) => props.contentColor};
  }

  & + & {
    border-inline-start: 1px solid ${tenantTheme.gray100};
    padding-inline-start: 16px;
  }
`;

StatisticStyled.displayName = 'StatisticStyled';
