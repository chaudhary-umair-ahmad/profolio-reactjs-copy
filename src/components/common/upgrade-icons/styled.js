import tenantTheme from '@theme';
import styled from 'styled-components';

export const HasVerifiedCheck = styled('div')`
  position: relative;

  .icon {
    position: absolute;
    inset-block-end: 0;
    inset-inline-end: 0;
  }

  .icon-check {
    background-color: var(--icon-bg, #fff);
    box-shadow: 0 1px 2px #0002;
    border-radius: 50%;
    color: var(--icon-color, ${tenantTheme['link-color']});

    ${({ applyMediaQueries }) =>
      applyMediaQueries &&
      `
      @media only screen and (min-width: 1400px) and (max-width: 1600px) {
        inset-block-end: -2px;
        inset-inline-end: -17px;
      }
    `}
  }

  .icon-applied {
    --icon-bg: #28b16d;
    --icon-color: #fff;

    inset-block-end: -2px;
    inset-inline-end: -2px;

    ${({ applyMediaQueries }) =>
      applyMediaQueries &&
      `
      @media only screen and (min-width: 1400px) and (max-width: 1600px) {
        inset-block-end: -2px;
        inset-inline-end: -10px;
      }
    `}
  }
`;
