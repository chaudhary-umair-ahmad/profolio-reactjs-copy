import Styled from 'styled-components';

export const EmptyStateWrapper = Styled.div`
  display: grid;
  place-items: center;
  gap: ${props => props.gap || '32px'};
  width: 100%;
  padding-block: 40px;
  text-align: center;

  img {
    max-width: 500px;
    width: 100%;
  }
`;
