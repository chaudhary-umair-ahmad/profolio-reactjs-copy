import tenantTheme from '@theme';
import { Card } from 'antd';
import styled, { css } from 'styled-components';

export const CardStyled = styled(
  ({
    accentColor,
    showHeader,
    hasBackground,
    compactCardRadius,
    iconContainerSize,
    compactCardPadding,
    headless,
    onRow,
    rowClassName,
    ...rest
  }) => <Card {...rest} />,
)`
  --_accent-color: ${({ accentColor }) => accentColor || tenantTheme['primary-color']};

  &.ant-card {
    border-radius: clamp(0px, ((100vw - 4px) - 100%) * 9999, 8px) / 8px;
    border-width: ${tenantTheme['card-border-width-lg']};
  }

  @media screen and (max-width: 991px) {
    &.ant-card {
      border-width: ${tenantTheme['card-border-width-sm']};
    }
  }

  .ant-card-head {
    min-height: 47px;

    > .ant-tabs {
      .ant-tabs-nav {
        &::before {
          content: none;
        }

        &-list {
          gap: ${(props) => props?.tabProps?.tabBarGutter || '24px'};
        }
      }
    }
  }

  .ant-card-head-title h4 {
    font-size: 18px;
  }

  .ant-tabs-tab {
    padding-inline: initial;

    &:hover {
      color: var(--_accent-color);
    }

    &.ant-tabs-tab-active .ant-tabs-tab-btn {
      color: var(--_accent-color);
    }
  }

  .ant-tabs-tab-btn:active {
    color: var(--_accent-color);
  }

  .ant-tabs-ink-bar {
    bottom: -1px;
    background-color: var(--_accent-color);
  }
`;

CardStyled.displayName = 'CardStyled';

export const CardCompact = styled.div`
  background-color: ${(props) => props.theme['primary-light-4']};
  border: 1px solid ${(props) => props.theme['primary-light-2']};
  border-radius: ${(props) => props.compactCardRadius || '4px'};
  padding: ${(props) => props.compactCardPadding || '8px'};
`;

CardCompact.displayName = 'CardCompactStyled';

export const CardGradient = styled.div`
  border-radius: ${(props) => props.compactCardRadius || '12px'};
  padding: ${(props) => props.compactCardPadding || '16px'};

  background: ${(props) =>
    props.bgImage
      ? `
        linear-gradient(
          var(--deg, 273.74deg),
          rgba(113, 167, 172, var(--gradient-alpha, 0.83)) var(--gradient-val, -56.69%),
          rgba(216, 233, 240, var(--gradient-alpha, 0.83)) var(--gradient-val1, 56.07%)
        ),
        url(${props.bgImage})
      `
      : `
        linear-gradient(
          var(--deg, 273.74deg),
          rgba(113, 167, 172, var(--gradient-alpha, 0.83)) var(--gradient-val, -56.69%),
          rgba(216, 233, 240, var(--gradient-alpha, 0.83)) var(--gradient-val1, 56.07%)
        )
      `};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  ${(props) =>
    props.hoverable === true &&
    css`
      &:hover {
        --gradient-alpha: 0.6 !important;
        cursor: pointer;
      }
    `}
  [dir='rtl'] & {
    --deg: -273.74deg;
  }
`;

CardGradient.displayName = 'CardGradientStyled';
