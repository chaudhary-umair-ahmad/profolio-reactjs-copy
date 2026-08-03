import tenantTheme from '@theme';
import Styled from 'styled-components';

export const ExList2 = Styled.div`
  height: 100%;

  div {
    p {
        font-size: 13px;
        color: ${tenantTheme['light-gray-color']};
        margin-bottom: 0;
    }


    small {
        color: ${tenantTheme['light-color']};
        display: block;
        font-size: 13px;
        font-weight: 400;
        line-height: normal;
        margin-block-start: 4px;

        span {
          display: inline-flex;
          align-items: center;
          padding-inline-end: 10px;
        }

        > span {
            color: ${tenantTheme['primary-color']};
        }

        .growth-downward {
          color: ${tenantTheme['error-color']};
        }
    }
}
`;

export const Value = Styled.div`
    font-size: ${(props) => (props.lead ? '20px' : '16px')};
    font-weight: ${(props) => (props.lead ? 700 : 700)};
    margin-bottom: 0;

    & > span {
      margin-inline-end: 10px;
      @media only screen and (max-width: 1599px){
        display: block;
      }
    }
`;
