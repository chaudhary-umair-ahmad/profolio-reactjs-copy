import React from 'react';
import styled from 'styled-components';
import { Card, CarouselSwiper, DrawerModal } from '../../components/common';

export const TruBrokerBanner = styled((props) => <Card {...props} />)`
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  border: 1px solid #ccdfe1;
  box-shadow: 0 1px 8px 0 #00000021;
  min-height: 50px;

  ${({ circleShadow }) =>
    circleShadow &&
    `
      &::after {
        content: '';
        position: absolute;
        inset: 0;
        block-size: 100%;
        inline-size: 100%;
        background: rgba(255, 255, 255, 0.15);
       clip-path: circle(var(--circle-shadow, 170px) at var(--circle-position-inline, 94%) 50%);
        pointer-events: none;
        box-shadow: 0 -4px 15px 0 rgba(0, 97, 105, 0.1) inset;

        @media only screen and (max-width: 768px) {
          --circle-shadow: 85px;
          inset-block-start: 0 !important;
        }
           [dir='rtl'] & {
             --circle-position-inline: 6%;
              }
      }
    `}

  [dir='rtl'] & {
    .image-container {
      .first-image,
      .second-image {
        @media only screen and (max-width: 768px) {
          right: 0;
        }
      }
    }
  }

  .mockup-img {
    padding-right: 23px;
    /* width: 88px; */
    transform: scale(1.5);
  }

  .image-container {
    position: relative;
    inline-size: var(--inline-size, 280px);
    block-size: 140px;

    @media only screen and (max-width: 768px) {
      --inline-size: 110px;
      block-size: 99px;
      inset-block-start: -25px;
    }

    .first-image,
    .second-image {
      position: absolute;
      block-size: 68%;
      object-fit: cover;
      transition: opacity 1s ease;

      @media only screen and (max-width: 768px) {
        block-size: 46%;
        right: -17px;
      }
    }

    .first-image {
      animation: moveDown 4s linear infinite;
    }

    .second-image {
      animation: moveUp 4s linear infinite;
    }

    @keyframes moveDown {
      0% {
        transform: translateY(0);
        opacity: 1;
      }
      25% {
        transform: translateY(80%);
        opacity: 0.5;
      }
      100% {
        transform: translateY(80%);
        opacity: 0.5;
      }
    }

    @keyframes moveUp {
      0% {
        transform: translateY(80%);
        opacity: 0.5;
      }
      25% {
        transform: translateY(0);
        opacity: 1;
      }
      100% {
        transform: translateY(0);
        opacity: 1;
      }
    }
  }
`;
export const TruBrokerBanner1 = styled((props) => <Card {...props} />)`
  overflow: hidden;
  .ant-card-body {
    --ant-padding-lg: 20px;

    background-image: url(${(props) =>
        props.rtl
          ? require('/profolio-assets/images/tru-broker-banner-image-ar.svg')
          : require('/profolio-assets/images/tru-broker-banner-image.svg')}),
      url(${require('/profolio-assets/images/tru-broker-bg.svg')});

    background-repeat: no-repeat;
    background-position:
      center right 40px,
      right bottom;
    background-size: 25%, cover;

    html[dir='rtl'] & {
      background-position:
        center left 40px,
        left bottom;

      @media only screen and (max-width: 767px) {
        background-position:
          top 12px left 10px,
          left bottom;
      }
    }
  }

  @media only screen and (max-width: 767px) {
    margin: 12px 12px 0px 12px;

    .ant-card-body {
      --ant-padding-lg: 12px;

      background-repeat: no-repeat;
      background-position:
        top 12px right 10px,
        right bottom;
      background-size: 40%, cover;
    }
  }
`;

export const TruBrokerModal = styled((props) => <DrawerModal {...props} />)`
  --ant-color-icon: #fff;
  --ant-modal-title-color: #fff;
  .ant-modal-header,
  .ant-drawer-header {
    background-image: url(${require('/profolio-assets/images/tru-broker-modal.svg')});
    background-repeat: no-repeat;
    background-size: cover;
    color: #fff;
  }
`;

export const CarouselSwiperProfile = styled((props) => <CarouselSwiper {...props} />)`
  &.profile-slide {
    .swiper-slide {
      height: 70px;
    }
  }
`;
