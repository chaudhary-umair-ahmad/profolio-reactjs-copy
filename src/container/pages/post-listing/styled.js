import React from 'react';
import styled from 'styled-components';
import { Card } from '../../../components/common';
import tenantTheme from '@theme';

export const PropertyCard = styled((props) => <Card {...props} />)`
  &.active-card {
    background: linear-gradient(180deg, rgba(0, 97, 105, 0.36) -164.55%, rgba(0, 97, 105, 0) 57.27%);
    border: 1px solid ${tenantTheme['primary-color']};
  }
`;
