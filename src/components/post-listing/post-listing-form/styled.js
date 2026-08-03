import { Card } from 'antd';
import React from 'react';
import Styled from 'styled-components';

export const BlockTitle = Styled.h2`
  font-size: 1.125em;
  font-weight: 600;
  line-height: 1.2;

  @media only screen and (min-width: 992px){
    max-width: 128px;
  }
`;

export const CardListing = Styled((props) => <Card bordered={false} {...props} />)`
  --ant-box-shadow-tertiary: none;
  margin-top: 0;
  margin-bottom: 0;

  @media only screen and (max-width: 991px) {
    border-radius: 0;
  }

  .ant-card-body {
    padding: 16px;

    @media only screen and (min-width: 992px){
      padding: 0 64px;
    }
  }

`;
