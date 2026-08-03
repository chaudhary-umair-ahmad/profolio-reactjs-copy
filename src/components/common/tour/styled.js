import Styled from 'styled-components';
import { Tour } from 'antd';

export const TourStyled = Styled(Tour)`
  --btn-bg-color: ${({ type, theme }) => type !== 'default' && theme[`${type}-color`]};
`;
