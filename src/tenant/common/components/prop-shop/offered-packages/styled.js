import styled from 'styled-components';

export const PackageCardList = styled('div')`
   {
    .package-banner {
      &::before {
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
      }
      @media only screen and (max-width: 767px) {
        margin-bottom: 8px;
      }
    }
    .packages-card {
      @media only screen and (max-width: 767px) {
        border-radius: 0;
      }
      .package-banner {
        margin-inline: -16px;
        margin-block-start: -16px;
        margin-block-end: 20px;
      }
    }
  }
`;
