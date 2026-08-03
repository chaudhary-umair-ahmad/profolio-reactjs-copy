import styled from 'styled-components';
import CardFirstVist from '../../../components/common/dashboard/card-first-vist';
import { Carousel } from 'antd';
import { CarouselSwiper } from '../../../components/common';
import { getBaseURL } from '../../../utility/env';

export const FancyLinkBox = styled.div`
  --box-bg-img: url('${getBaseURL()}/profolio-assets/images/bg-analytics.png');

  background-image: var(--box-bg-img);
  background-position: center right -30%;
  background-size: 50%;
  background-repeat: no-repeat;
  background-color: #fff;
  border-radius: 8px;
  padding: 16px;
`;

export const DashboardCardFirstVist = styled(CardFirstVist)`
  @media screen and (max-width: 767px) {
    &.ant-card {
      --bg-size: 320px auto !important;
      padding-bottom: 170px !important;
      background-position: ${({ theme }) => (theme.rtl ? 'left' : 'center')} bottom;
    }
  }

  h3 {
    @media screen and (min-width: 768px) {
      max-width: 240px;
    }
    @media screen and (max-width: 767px) {
      font-size: 18px;
    }
  }

  .ant-card-body {
    @media screen and (max-width: 767px) {
      text-align: center;
      width: 100% > div {
        --maxWidth: auto;
      }
    }
  }

  p {
    // font-size: 1.125rem;
    // color: ${({ theme }) => theme['gray-lightest-color']};
    @media screen and (max-width: 767px) {
      font-size: 1rem;
    }
  }

  .listItems {
    > * {
      margin-inline-end: 38px;
      span {
        font-weight: 400;
      }
    }
  }

  &.halfWidget {
    background-position: bottom 0 right -190px;

    @media screen and (min-width: 1256px) {
      background-position: bottom 0 right -480px;
    }

    @media screen and (min-width: 1600px) {
      background-position: bottom 0 right -430px;
    }

    @media screen and (max-width: 1255px) {
      --bg-size: auto 50% !important;
      align-items: self-start;
      padding: 12px !important;

      h3 {
        max-width: none;
        font-size: 18px;
      }
    }

    .ant-card-body {
      > div {
        --maxWidth: 500px !important;

        @media screen and (min-width: 1256px) {
          --maxWidth: 290px !important;
        }

        @media screen and (min-width: 1600px) {
          --maxWidth: 480px !important;
        }
      }
    }
  }
`;

DashboardCardFirstVist.displayName = 'DashboardCardFirstVist';

export const TruBrokerCarousel = styled((props) => <Carousel {...props} />)`
  --ant-carousel-dot-offset: -14px;
  --ant-color-bg-container: var(--primary-color);
  .slick-track {
    display: flex;
    gap: 8px;
  }
  .slick-dots {
    direction: ${({ theme }) => (theme.rtl ? 'rtl' : 'ltr')};
  }
`;

export const CarouselSwiperDashboard = styled((props) => <CarouselSwiper {...props} />)`
  &.dashboard-slider {
    .swiper-slide {
      height: 215px;
    }

    .swiper-pagination-bullet {
      background-color: ${({ theme }) => theme['primary-color']};
      top: 2px;
      height: 12px;
      width: 12px;
    }

    .swiper-pagination-bullet-active {
      background-color: ${({ theme }) => theme['primary-color']};
      width: 22px;
      border-radius: 6px;
      height: 8px;
      top: 0 !important;
    }
    --swiper-pagination-bullet-horizontal-gap: 2px;
  }
`;
