import styled from 'styled-components';
import Card from '../cards/Card';
import { getBaseURL } from '../../../utility/env';

export const CardFirstVistStyled = styled(Card)`
  &.ant-card {
    --bg-img: ${props => props.bgImg || `url(${getBaseURL()}/profolio-assets/images/bg-first-vist.svg)`};
    --bg-size: 45%;

    background-color: #fff;
    background-image: var(--bg-img);
    background-repeat: no-repeat;
    background-size: var(--bg-size);
    background-position: ${({ theme }) => (theme.rtl ? 'left' : 'center')} bottom;
    display: flex;
    align-items: center;
    /* height: 100%; */
    padding-inline-start: 12px;
  }
`;
CardFirstVistStyled.displayName = 'CardFirstVistStyled';

export const TextWrap = styled.div`
  --maxWidth: 275px;
  max-width: var(--maxWidth);
`;

export const CardFirstVisitTitle = styled.h3`
  color: ${props => props.titleColor || '#272B41'};
  font-size: ${props => props.titleColor || '24px'};
  line-height: 1.166667;
`;

export const SubTitle = styled.p`
  color: #bdbdbd;
  font-size: ${props => props.subTitleColor || '18px'};
`;
