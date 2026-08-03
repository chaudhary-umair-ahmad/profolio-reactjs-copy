import Styled from 'styled-components';

const H1 = Styled.h1`
  font-size: 2.1428571429em;
  font-weight: 600;
  line-height: 38px;
`;

const H2 = Styled.h2`
  font-size: 1.7142857143em;
  font-weight: 600;
  line-height: 30px;
`;

const H3 = Styled.h3`
  font-size: 1.5714285714em;
  font-weight: 600;
  line-height: 27px;



`;

const H4 = Styled.h4`
  font-size: 1.4285714286em;
  font-weight: 600;
  line-height: 20px;



`;

const H5 = Styled.h5`
  font-size: 1.2857142857em;
  font-weight: 600;
  line-height: 22px;
`;

const H6 = Styled.h6`
  font-size: 1.142855em;
  font-weight: 600;
  line-height: 20px;
  color: ${({ theme }) => theme['dark-color']};

`;

export { H1, H2, H3, H4, H5, H6 };
