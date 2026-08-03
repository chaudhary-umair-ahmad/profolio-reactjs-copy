import tenantTheme from '@theme';
import styled from 'styled-components';

export const SelectListingCardsContainer = styled.div`
  &.select-card {
    .listing-card-check {
      margin-inline: -12px;
      padding-inline: 12px;
      padding-block: 24px;

      &:hover {
        background-color: ${tenantTheme['primary-light-4']};
      }

      @media screen and (max-width: 700px) {
        padding-inline: 16px;
      }
    }
  }
`;
