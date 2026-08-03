import tenantTheme from '@theme';
import { List, Tag } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { Popover } from '../common';

export const ColorBlob = styled.div`
  --blob-color: ${(props) => props.color};
  --blob-size: ${(props) => props.size};

  background-color: var(--blob-color);
  border-radius: 50%;
  width: var(--blob-size, 26px);
  /* height: var(--blob-size, 26px); */
  aspect-ratio: 1;
`;

export const LegendHorizontal = styled.div``;

export const PopoverContainer = styled(props => <Popover {...props} />)``;
export const QualityPopover = styled(props => <List {...props} />)`
  .qualityCard {
    background: color-mix(in srgb, ${tenantTheme['danger-color']} 10%, #fff);
  }
 .ant-list-header {
      padding: 0;
      > div {
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
      }
    }
  }
  .health-icon {
    > div {
      transform: none;
      display: inline-flex;
    }
  }
`;

export const HealthTag = styled(props => <Tag {...props} />)`
  border-radius: 4px;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.06);
  margin: 0;
  border: none;
  @media only screen and (max-width: 767px) {
    // position: relative;
    // inset-inline-start: 6px;
    // inset-block-start: -4px;
  }
`;
