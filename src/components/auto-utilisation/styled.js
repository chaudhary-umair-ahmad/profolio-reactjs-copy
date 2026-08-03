import tenantTheme from '@theme';
import { Row } from 'antd';
import chroma from 'chroma-js';
import Styled from 'styled-components';
import { IconStyled } from '../common/icon/IconStyled';

export const ListUsedCriteria = Styled.div`
  border-radius: 6px;
  border: 1px solid ${tenantTheme['border-color-normal']};
  padding: 24px;
`;

export const CriteriaItem = Styled.li`
  color: ${tenantTheme['gray-dark-color']};
`;

export const ListingCountStyled = Styled.span`
  color: ${tenantTheme['gray-dark-color']};
`;

export const DateItem = Styled.div`
  color: ${tenantTheme['gray-dark-color']};
  font-size: 12px;
`;

export const Requirements = Styled.div`
  counter-reset: requirement-list;
`;

export const RequirementListItem = Styled.div`
  counter-increment: requirement-list;
  padding-block: 32px;
  padding-inline: 48px 24px;
  position: relative;

  @media screen and (max-width: 991px) {
    padding-block: 24px;
    padding-inline: 36px 8px;
  }

  &:not(:first-child) {
    border-top: 1px solid ${tenantTheme['border-color-normal']};
  }

  &::before {
    background-color: ${tenantTheme['bg-color-light']};
    border-radius: 50%;
    color: ${tenantTheme['light-gray-color']};
    content: counter(requirement-list);
    display: grid;
    font-size: 12px;
    place-content: center;
    position: absolute;
    top: 24;
    left: 0;
    width: 24px;
    height: 24px;
  }
`;

export const OverviewSalesCard = Styled.div`
    display: flex;
    align-items: flex-start;
    padding: 5px 0 2px 0;
    gap: 1.1428rem;

    ${IconStyled} {
      font-size: 2.5em;
      padding: 12px;
    }

    .icon-box {
      --icon-color: ${(props) => props.iconColor || tenantTheme['light-gray-color']};
      --icon-bg-color: ${(props) =>
        props.iconColor ? chroma(props.iconColor).alpha(0.08) : tenantTheme['bg-color-light']};

      background-color: var(--icon-bg-color);
      color: var(--icon-color);
      display: grid;
      font-size: 2.5em;
      place-content: center;
      inline-size: 60px;
      aspect-ratio: 1;
      border-radius: 10px;
      flex: none;

      img{
          max-width: 35px;
      }
    }
    .card-chunk{
        h2{
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 2px;
            color: ${({ theme }) => theme['dark-color']};
            span{
               font-size: 24px;
            }
        }
        span{
            color: ${({ theme }) => theme['light-gray-color']};
        }
        p{
            margin-top: 16px;
        }
    }

    @media only screen and (max-width: 767px) {
      .ant-card-body{
        padding: 16px;
      }
    }
`;
OverviewSalesCard.displayName = 'OverviewSalesCard';

export const CardBarChart2 = Styled.div`
    @media only screen and (max-width: 379px){
        text-align: center
    }
    h1{
        margin-bottom: 5px;
    }
    @media only screen and (max-width: 1500px){
        h1{
            font-size: 22px;
        }
    }
    & > span{
        font-size: 14px;
        color: ${({ theme }) => theme['light-gray-color']};
    }
    p{
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        margin: 21px 0 0 0;
        @media only screen and (max-width: 379px){
            justify-content: center;
        }
        .growth-upward, .growth-downward{
            display: inline-flex;
            align-items: center;
            padding-inline-end: 10px;
            font-weight: 600;

            svg{
                width: 15px;
            }
        }
        .growth-upward{
            color: ${({ theme }) => theme['success-color']};
            svg{
                color: ${({ theme }) => theme['success-color']};
            }
        }
        .growth-downward{
            color: ${({ theme }) => theme['danger-color']};
            svg{
                color: ${({ theme }) => theme['danger-color']};
            }
        }
        span{
            color: ${({ theme }) => theme['light-gray-color']};
            font-size: 13px;
            display: inline-block;
        }
    }
`;

export const OverviewProductCard = Styled(OverviewSalesCard)`
  align-items:center;
  display: grid;
  grid-template-columns: auto 1fr;
`;

export const UtilisationRowStyled = Styled(Row)`

  @media screen and (max-width: 991px){
    position: relative;
    border: 1px dashed ${({ theme }) => theme['primary-color']};
    padding: 12px 6px 0;
    border-radius: 8px;

    .btnClose {
      position: absolute;
      top: -13px;
      right: -13px;
      padding: 5px !important;
      border-radius: 3rem;
      width: 26px;
      height: 26px !important;
      border-color: ${({ theme }) => theme['primary-color']};
      margin: 0 !important;

      svg {
        font-size: 12px;
      }
    }

    .btnAdd {
      position: absolute;
      left: 14px;
      right: 14px;
      bottom: -46px;
    }
  }

`;
