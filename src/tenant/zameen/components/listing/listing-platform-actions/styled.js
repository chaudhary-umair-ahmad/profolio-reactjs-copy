import tenantTheme from '@theme';
import styled from 'styled-components';

export const JeffiContainerStyled = styled('div')`
  background-color: #f5f5f5;
  margin-inline: -24px;
  margin-bottom: -24px;
  padding: 20px 24px;

  .ant-row-space-between {
    @media only screen and (min-width: 767px) {
      justify-content: start;
      > div {
        width: 188px;
        margin-inline-end: 8px;
      }
    }

    button {
      height: 18px !important;
      align-self: center;
    }
  }

  .checkboxRow {
    label {
      background-color: #fff;
      padding: 10px 13px;
      border-radius: 3rem;
      border: 1px solid #e6e6e6;
    }
  }
`;

export const HasVerifiedCheck = styled('div')`
  position: relative;

  .icon-check {
    background-color: #fff;
    box-shadow: 0 1px 2px #0002;
    border-radius: 50%;
    color: ${tenantTheme['link-color']};
    position: absolute;
    inset-block-end: 0;
    inset-inline-end: 0;
  }
`;
