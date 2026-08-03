import Styled from 'styled-components';
import tenantTheme from '@theme';

export const ListWithBullet = Styled.ol`
  padding-inline-start: 0;
  margin-bottom: 0;
  li {
    list-style: none;
    &:before {
      content: '';
      display: inline-block; 
      width: 8px;
      height: 8px;
      border-radius: 1rem;
      background-color:  ${({ theme }) => theme['primary-light-3']};
      border: 2px solid #55969B;
      
      margin-inline-end: 8px;
    }
  }


`;
