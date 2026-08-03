import styled from 'styled-components';
import React from 'react';

import { Flex, Group, Image } from '..';

export const ImageGallerySection = styled((props) => <Group {...props} />)`
  &.gallery-container {
    position: relative;
    grid-auto-rows: var(--row-template, minmax(0, max-content));
    div {
      img {
        border-radius: 4px;
        height: 100%;
        object-fit: cover;
      }
      &:first-child {
        grid-row: var(--grid-row-1, span 4);
      }
      &:nth-child(2) {
        grid-row: var(--grid-row-2, span 2);
      }
    }
    .gallery-btn {
      position: absolute;
      bottom: var(--bottom, 10px);
      height: var(--height, 30px);
      inset-inline-end: var(--right, 6px);
      display: flex;
      gap: 0.5rem;
      z-index: 1;
      @media only screen and (max-width: 767px) {
        --bottom: 5px;
        right: 4px;
      }
    }
    .btn-transparent {
      background-color: rgb(31 31 31 / 0.6);
      border: 0;
      border-radius: 18px;
      color: #fff;
      padding: 0.357rem 0.714rem;
      @media only screen and (max-width: 767px) {
        font-size: 10px;
        padding: 0.2rem 0.4rem;
      }
      font-size: 0.875rem;

      &:hover {
        background-color: ${({ theme }) => theme['primary-color']};
        color: #fff;
      }

      @media (hover: hover) {
        &:hover,
        &:focus {
          background-color: $brand-color;
        }
      }
    }
  }
`;

export const ImageGalleryDrawer = styled.div`
  .image-thumbnail {
    background-color: #c00;
    border: 5px solid #c00;
  }
`;

export const ImageModalContainer = styled((props) => <Group {...props} />)`
  .ant-image {
    height: var(--modal-img-height, 250px);
    .ant-image-img {
      border-radius: 12px;
      height: 100%;
      object-fit: cover;
    }

    .ant-image-mask {
      border-radius: 12px;
      .ant-image-mask-info {
        font-size: 16px;
      }
    }
  }
`;

export const ImageSlider = styled((props) => <Flex {...props} />)`
  .image-slider {
    width: 100px;
    height: 100px;
    cursor: pointer;
    margin: 0 5px;
    border-radius: 8px;
    opacity: 0.5;
    &:hover {
      opacity: 1 !important;
    }
    @media only screen and (max-width: 767px) {
      opacity: 1 !important;
      width: 60px;
      height: 60px;
      margin: 0 2px;
    }
  }
`;
