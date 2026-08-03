import styled from 'styled-components';
import React from 'react';
import { Group } from '../common';

export const ImageGallerySkeleton = styled(props => <Group {...props} />)`
  &.gallery-container {
    position: relative;
    grid-auto-rows: var(--row-template, minmax(0, max-content));
    div {
      &:first-child {
        grid-row: span 4;
      }
      &:nth-child(2) {
        grid-row: span 2;
      }
    }
  }
`;
