import React from 'react';
import { Col, Progress } from 'antd';
import styled from 'styled-components';

export const HistoryPackage = styled.div`
  display: grid;
  height: 100%;
  grid-template-rows: auto 1fr;
  justify-items: center;
  gap: 10px;
  > .ant-divider-vertical {
    height: 100%;
  }
`;

export const HistoryDot = styled.span`
  display: inline-flex;
  width: 10px;
  height: 10px;
  border-radius: 2rem;
  background: var(--dot-color, #ccc);
`;

export const HistoryPackageDate = styled((props) => <Col {...props} />)`
  display: grid;
  align-content: space-between;
  justify-items: end;

  @media screen and (max-width: 991px) {
    grid-auto-flow: column;
    justify-content: space-between;
    width: 100%;
    align-items: center;
    margin-top: 12px;
  }
`;

export const ProgressStyled = styled((props) => <Progress {...props} />)`
  --progress-bg: #ccc;
  .ant-progress-bg {
    background: var(--progress-bg);
  }
`;

export const CreditUsage = styled.div`
  &.sticky {
    background-color: #fff;
    position: fixed;
    // position: sticky;
    top: 74px;
    z-index: 1;
    left: 0;
    right: 0;
    padding: 16px 16px 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
    transition: all 0.3s;
    width: 100%;

    + .stickySpace {
      height: 100px;
    }
  }
`;
export const ChartContainer = styled.div`
  .chartjs-render-monitor {
    // height: 265px !important;
    // width: 330px !important;
    margin-block: 40px;

    @media screen and (max-width: 760px) {
      margin-block: 20px;
    }
  }
`;
