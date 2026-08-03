import tenantTheme from '@theme';
import { Space, Typography } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { Banner, Card, Group } from './common';
import { DropdownStyled } from './common/dropdown/dropdown-style';

const { Title } = Typography;

export const TenantList = styled((props) => <Group {...props} />)`
  align-items: center;

  /* &:not(:last-child) {
    border-block-end: 1px solid #e6e6e6;
  } */
`;

export const ListingCardStyled = styled((props) => <Card {...props} />)`
  &.ant-card {
    color: ${tenantTheme.gray700};
    font-size: 12px;
  }

  ${DropdownStyled} {
    border: unset;
    cursor: pointer;
    padding: 0;
    // margin-inline-end: 8px;
  }
`;

export const ListCardFooter = styled('div')`
  display: flex;
  align-items: center;
  padding-inline-end: 12px;
  margin-block-end: -12px;
  margin-inline: -12px;
  border-top: 1px solid ${tenantTheme.gray200};
  background-color: rgba(245, 245, 245, 0.6);
  justify-content: space-between;
  border-bottom: 1px solid ${tenantTheme['border-color-base']};
`;

export const StatisticWrapperSmall = styled('div')`
  display: flex;
  align-items: center;

  > div {
    align-items: center;
  }

  .ant-statistic-content {
    font-size: 0.9571em;
  }

  .totalLeads {
    position: relative;
    z-index: 2;
    min-width: 114px;
    padding: 10px 8px;
    box-shadow: 2px 0 4px rgba(0, 0, 0, 0.06);
    background-color: #fff;
    border-start-end-radius: 4px;
    border-end-end-radius: 4px;
    margin-inline-end: 16px;

    &::before {
      --arrow-width: 6px;

      content: '';
      position: absolute;
      z-index: 1;
      inset-inline-end: calc(var(--arrow-width) * -1);
      inset-block-start: 50%;
      transform: translateY(-50%);
      border-style: solid;
      border-block-width: var(--arrow-width);
      border-inline-width: var(--arrow-width) 0;
      border-block-color: transparent;
      border-inline-color: #fff transparent;
      filter: drop-shadow(2px 0 4px rgba(0, 0, 0, 0.06));
    }
  }
`;

export const SwitchWrapped = styled(Space.Compact)`
  align-items: center;
  gap: 40px;
  @media only screen and (max-width: 767px){
      gap: 8px;
   }
}

`;

export const Thumbnail = styled.div`
  display: grid;
  border-radius: 6px;
  overflow: hidden;

  .ant-image {
    height: 100%;
  }

  .ant-image-img {
    object-fit: cover;
    width: 100%;
    height: inherit;
    aspect-ratio: 1;
  }
`;
Thumbnail.displayName = 'Thumbnail';

export const TitleStyled = styled((props) => <Title level={1} {...props} />)`
  &.ant-typography {
    font-size: var(--font-size, 16px);

    @media (max-width: 768px) {
      --font-size: 16px;
    }

    strong {
      font-weight: 700;
    }
  }
`;
export const BannerContainer = styled((props) => <Banner {...props} />)`
  &.package-banner {
    --max-space: 55%;

    .ant-typography-secondary {
      color: #fff;
      display: block;
      max-width: 30ch;
      @media (min-width: 768px) {
        max-width: initial;
      }
    }

    &::before {
      --gradient-overlay: 90deg, #006169 32%, rgba(0, 97, 105, 0.7) 78%, rgba(0, 97, 105, 0.05) 100%;
      --right: 0;
      @media (min-width: 768px) {
        --gradient-overlay: 90deg, #006169 70%, rgba(0, 97, 105, 0.7) 87%, rgba(0, 97, 105, 0.05) 100%;
        --size: 32%;
        --right: -3px;
      }
    }
  }
`;

export const ListingBanner = styled((props) => <Banner {...props} />)`
  &.listing-banner {
    border-radius: 8px;
    h1.ant-typography {
      --titleFontSize: 15px;
    }
    @media (min-width: 768px) {
      h1.ant-typography {
        --titleFontSize: 18px;
        max-inline-size: 80%;
      }
      .ant-typography-secondary {
        max-width: 43ch !important;
      }
    }
    --max-space: 55%;
    --banner-padding: 20px;

    .ant-typography-secondary {
      color: #fff;
      display: block;
      max-width: 30ch;
    }
    &:before {
      --gradient-overlay: 90deg, #006169 32%, rgba(0, 97, 105, 0.7) 78%, rgba(0, 97, 105, 0.05) 100%;
      --right: -121px;
      --size: 100%;

      @media (min-width: 768px) {
        --right: -147px;
        --size: 100%;
        --banner-padding: 20px;
      }
    }

    a {
      font-size: 12px;
      font-weight: 700;
    }
  }
`;
