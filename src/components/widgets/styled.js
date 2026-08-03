import React from 'react';
import Styled from 'styled-components';
import { Group } from '../common';

export const Widgets = Styled.div`
  display: grid;
  grid-gap: 16px;
    //   grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-template-columns: repeat(auto-fit, minmax(15ch, 1fr));

    @media only screen and (min-width: 768px) {
        grid-template-columns: repeat(auto-fit, minmax(20ch, 1fr));
    }
`;
Widgets.displayName = 'Widgets';

export const StatsBlock = Styled.div`
  padding-block: 8px;

  &:not(:last-of-type) {
    border-block-end: 1px solid #f0f0f0;
  }

  > div {
    padding-block: 4px;
  }
`;

export const ChartContainer = Styled.div`
    display: block;
    .chart-divider {
        display: block;
        width: 100%;
        height: 100px;
    }
    .chartjs-tooltip {
        opacity: 1;
        position: absolute;
        background: #fff;
        box-shadow: 0 8px 10px #9299B815;
        padding: 10px 12px !important;
        border-radius: 3px;
        border: 1px solid #F1F2F6;
        min-width: 80px;
        transition: all 0.5s ease;
        pointer-events: none;
        transform: translate(-50%, 5%);
        font-family: ${({ theme }) => theme['font-family']};
        z-index: 222;
        top: 0;
        left: 0;
        @media only screen and (max-width: 1199px){
            padding: 6px 8px !important;
        }
        &:before {
            position: absolute;
            content: '';
            border-top: 5px solid #fff;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            bottom: -5px;
            ${({ theme }) => (!theme.rtl ? 'left' : 'right')}: 50%;
            transform: translateX(-50%);
        }
    }
    .chartjs-tooltip-key {
        display: inline-block;
        width: 10px;
        height: 10px;
        background: "pink";
        margin-inline-end
        : 10px;
    }
    .tooltip-title {
        color: ${({ theme }) => theme['gray-color']};
        font-size: 12px;
        font-weight: 500 !important;
        font-family: 'Inter', sans-serif;
        text-transform: capitalize;
        margin-bottom: 4px;
    }
    .tooltip-value {
        color: #63b963;
        font-size: 22px;
        font-weight: 600 !important;
        font-family: 'Inter', sans-serif;
    }
    .tooltip-value sup {
        font-size: 12px;
        @media only screen and (max-width: 1199px){
            font-size: 11px;
        }
    }
    table{
      font-family: ${({ theme }) => theme['font-family']};
        tbody{
            td{
                font-size: 13px;
                font-weight: 500;
                padding-bottom: 3px;
                white-space: nowrap;
                color: ${({ theme }) => theme['dark-color']};
                @media only screen and (max-width: 1199px){
                    font-size: 12px;
                }
                .data-label{
                    margin-inline-start: 3px;
                    color: ${({ theme }) => theme['light-gray-color']};
                }
            }
        }
    }
`;

export const LineChartWrapper = Styled.div`
    .linkedin-chart-wrap{
        min-height: 388px;
    }
    .growth-upward,
    .growth-downward{
        line-height: 2.2;
        h1{
            margin-bottom: 0;
            svg,
            i,
            img{
                margin-inline-end: 6px;
            }
        }
    }
    .line-chart-row{
        &:not(:last-child){
            margin-bottom: 24px;
        }
        .border-linechart{
            border-bottom: 1px solid ${({ theme }) => theme['border-color-deep']};
            position: relative;
            &:before{
                position: absolute;
                content: '';
                width: 10px;
                height: 2px;
                ${({ theme }) => (theme.rtl ? 'right' : 'left')}: 0;
                bottom: -1px;
                background: #fff;
            }
        }
    }
    .overview-container{
        .line-chart-row{
            &:not(:last-child){
                margin-bottom: 18px;
                ${({ theme }) => (theme.topMenu ? 'margin-bottom: 25px' : 'margin-bottom: 18px')};
            }
        }
    }
`;

export const PerformanceChartWrapper = Styled.div`
--primary-color: ${(props) => props.accentColor};

  height: var(--height, 100%) ;

> .ant-card {
  height: inherit;
  display: grid;
  grid-template-rows: auto 1fr;
}
.ant-card-head-title{
  width: var(--mx-width, 100%);
}

.ant-card-head {
  padding-inline: 0;
  border-bottom: var(--bottom-border);

  .ant-tabs-nav {
    margin-inline: -1px;
    margin-block-start: -1px;

    &-list {
      @media (max-width: 640px) {
        flex: 1;

        .ant-tabs-tab {
          flex-basis: 100%;
        }
      }
    }

    &-wrap {
      z-index: 1;
      @media (min-width: 641px) {
        flex: initial;
      }
    }

    .ant-tabs-tab {
      background-color: #fff;
      border-radius: 0;
      padding: 16px 1.6em;

      @media (min-width: 640px) {
        min-width: 200px;
        border-inline-end: 0;
      }

      .anticon {
        margin-inline: initial;

        svg {
          padding-inline: initial;
        }
      }

      &-active {
        background: ${(props) => props.gradientBackground || 'linear-gradient(color-mix(in srgb, var(--primary-color) 6%, #fff) 0%, #fff 80%);'};
        background-origin: border-box;
        box-shadow: 0px 16px 0 -1px #fff, ${({ theme }) => (theme.rtl ? '-2px' : '2px')} 0px 21px -10px #41414164;
        z-index: 1;

        .ant-statistic-title {
          color: ${(props) => props.accentColor || 'var(--primary-color)'};
        }
      }
    }

    .ant-tabs-extra-content {
      display: flex;
      padding-inline: 1.7143em;
      position: relative;
      align-items: center;
      align-self: stretch;
      overflow: hidden;
      margin-inline-start: var(--margin-left);

        ${({ blurEffect = true }) =>
          blurEffect &&
          `&::after {
            content: '';
            filter: blur(4px);
            position: absolute;
            inset-inline-start: -8px;
            background-color: #0007;
            width: 4px;
            height: 100%;
          }`}
    }

    .ant-tabs-ink-bar {
      bottom: initial;
      top: 0;
      height: 3px;
      visibility: visible;
      transition: none;
      z-index: 1;
    }
  }
}

.performance-chart-tabs {
  &.ant-tabs-rtl {
    .ant-tabs-nav .ant-tabs-tab {
      margin: initial;
    }
  }
}

.performance-lineChart{
    margin-top: 20px;
    .chart-label{
        display: none;
    }
    ul{
        margin-top: 16px;
        li{
            &:not(:last-child){
                margin-inline-end: 25px;
            }
        }
    }
}

.chartjs-tooltip{
    min-width: 175px !important;
    @media only screen and (max-width: 767px){
        min-width: 150px !important;
    }
}
`;

export const SessionChartWrapper = Styled.div`
.ant-card {
  height: inherit;
}
  /* min-height: 510px;

  @media only screen and (max-width: 1599px){
    min-height: 440px;
  }

  @media only screen and (max-width: 991px){
    min-height: auto;
  } */

  .session-chart-inner{
      ul{
          display: flex;
          max-width: 365px;
          margin: 16px auto 6px auto;
          li{
              width: 33.33%;
              text-align: center;
              position: relative;
              .doughnutLabelColor{
                  position: absolute;
                  display: block;
                  height: 8px;
                  width: 8px;
                  border-radius: 50%;
                  top: 50%;
                  transform: translateY(-50%);
                  ${({ theme }) => (theme.rtl ? 'right' : 'left')}: 14px;
                  @media only screen and (max-width: 1400px){
                      ${({ theme }) => (theme.rtl ? 'right' : 'left')}: 5px;
                  }
                  @media only screen and (max-width: 1300px){
                      ${({ theme }) => (theme.rtl ? 'right' : 'left')}: 0;
                  }
                  @media only screen and (max-width: 1199px){
                      ${({ theme }) => (theme.rtl ? 'right' : 'left')}: 15px;
                  }
                  @media only screen and (max-width: 379px){
                      ${({ theme }) => (theme.rtl ? 'right' : 'left')}: 0;
                  }
              }
              .doughnutLabe{
                  color: ${({ theme }) => theme['gray-color']};
              }
          }
      }
      p,
      .value {
          position: absolute;
          top: 50%;
          left: 50%;
          text-align: center;
          width: calc(100% - 48px);
          margin-bottom: 0;
          display: inline-block;
          transform: translate(-50%, -50%);
      }

      p {
        span {
            font-size: 1.714em;
            display: block;
            font-weight: 600;
        }
      }

      .value {
        > div {
            flex-flow: column;
        }

        span {
            font-size: 20px;
            display: block;
            font-weight: 600;
            flex-flow: column;
        }

        .of {

            &:after {
                content: "";
                position: absolute;
                height: 1px;
                background-color: #868EAE;
                width: 100px;
                left: 50%;
                margin-inline-start:-50px;
                margin-top: -9px;
                z-index: -1;
            }
            span {
                color: ${({ theme }) => theme['light-gray-color']};
                padding-inline: 5px;
                font-size: 12px;
                font-weight: 300;
                line-height: 18px;
                background-color: #fff;

          }
        }

        small {
          display: flex;

          span {
            //   font-weight: 400;
              font-size: 16px;
              margin-top: 4px;
          }
        }

      }
  }
`;

export const SessionState = Styled.div`
    margin-block-start: 16px;
    max-width: 365px;

    >div{
        /* width: 33.33%; */
        text-align: center;
        span{
            font-size: 18px;
            font-weight: 600;
            display: inline-block;
            @media only screen and (max-width: 1300px){
                display: block;
            }
            @media only screen and (max-width: 1199px){
                display: inline-block;
            }
            @media only screen and (max-width: 379px){
                display: block;
            }
        }
        sub{
            bottom: 0;
            ${({ theme }) => (theme.rtl ? 'right' : 'left')}: 5px;
            font-size: 13px;
            color: ${({ theme }) => theme['light-gray-color']};
        }
    }

    .session-single{
        text-align: center;
    }
`;

export const StatsSpacer = Styled.div`
    > div {
        > div {
            display: flex;
            flex-direction: column;
            justify-content: end;
        }
    }

`;

export const AnalyticsStyled = Styled.div`
  container: analytics / inline-size;
`;

export const ContainerWidgets = Styled((props) => <Group {...props} />)`
  container: container-widgets / inline-size;

  .dot-1, .dot-2, .dot-3 {
    path {
      fill: var(--primary-color);
    }
  }

  .dot-2, .dot-3 {
    path {
      fill: color-mix(in sRGB, var(--primary-color) 32%, #fff);
    }
  }

  &.reports-listings-section {
    min-width: 0;
    /* Fluid type: shrinks with section width so single-line stats stay on one row */
    font-size: clamp(0.625rem, 0.32rem + 1.35cqw, 0.875rem);

    .ant-card {
      min-width: 0;
    }

    .ant-card-body {
      min-width: 0;
    }

    .ant-card-head-title {
      min-width: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .ant-statistic-title,
    .ant-statistic-content,
    .ant-statistic-content-value,
    .ant-statistic-content-value-int {
      white-space: nowrap;
    }

    .ant-statistic-content-value {
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .ant-space-item {
      min-width: 0;
    }

    small .ant-flex {
      flex-wrap: nowrap;
      white-space: nowrap;
    }

    .session-chart-inner .ant-row {
      flex-wrap: nowrap;
    }
  }
`;
