import tenantTheme from '@theme';
import React from 'react';
import styled from 'styled-components';
import { Tag } from '..';
import { IconStyled } from '../icon/IconStyled';

export const TagStyled = styled(({ iconContainerSize, tagBackgroundColor, tagSpace, ...rest }) => <Tag {...rest} />)`
  &.ant-tag {
    --tag-font-size: 10px;
    font-weight: 700;
    --tag-color: #fff;
    display: inline-flex;
    align-items: center;
    gap: 3px;
    padding: ${(props) => props.tagSpace || '6px'};
    background-color: ${(props) => props.tagBackgroundColor || tenantTheme.gray100};
    border: 0;
    line-height: 1;
    vertical-align: text-bottom;
    border-radius: var(--border-radius, 4px);

    background-image: linear-gradient(90deg, rgba(0, 0, 0, 0.7), rgba(255, 255, 255, 0.2));
    background-blend-mode: soft-light;

    ${IconStyled} {
      --icon-styled-width: ${(props) => props.iconContainerSize};
    }
  }
`;
TagStyled.displayName = 'ProductTag';
