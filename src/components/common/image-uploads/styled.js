import tenantTheme from '@theme';
import React from 'react';
import styled from 'styled-components';
import { Button } from '../button/button';
import Group from '../group/group';
import Label from '../Label/Label';

export const ImageUpload = styled(Group)`
  @media screen and (min-width: 992px) {
    border: 1px dashed ${tenantTheme['primary-light-1']};
    border-radius: ${tenantTheme['border-radius-base']};
    font-size: 14px;
    padding: 24px;
  }
`;

export const Thumbnail = styled.img`
  --thumbnail-width: 96px;
  --thumbnail-height: 96px;

  width: var(--thumbnail-width);
  height: var(--thumbnail-height);
  object-fit: cover;
  border-radius: var(--border-radius);
`;

export const Retry = styled.button`
  border: 0;
  background-color: hsla(0, 0%, 0%, 0.7);
  border-radius: 24px;
  color: #fff;
  cursor: pointer;
  font-size: 0.8em;
  padding: 4px 12px;
  z-index: 1;
`;

// export const SpinnerStyled = styled(Spinner)` `;

export const DocumentsThumb = styled.div`
  width: 100%;
  padding: 8px 16px;
  border: 1px dashed #009f2b;
  border-radius: 8px;

  .file-tile {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .file-icon {
      color: ${tenantTheme['gray-lightest-color']};
    }

    .btnTrash {
      border: 0;
      padding: 0;
      color: ${tenantTheme['error-color']};
    }
  }
`;

export const UploadButton = styled((props) => <Label {...props} />)`
  &,
  &:hover {
    height: initial;
    color: #fff;

    @media only screen and (max-width: 991px) {
      border: 1px dashed ${tenantTheme['primary-light-1']};
      color: ${tenantTheme['gray-dark-color']};
      background: none;
      text-shadow: none;
      box-shadow: none;
      min-width: 96px;
      width: 100%;
      white-space: normal;
      height: 96px;
      display: flex;
      flex-direction: column;
      place-content: center;
      gap: 4px;
      font-size: 12px;
      font-weight: 400;
    }
  }
`;

export const Remove = styled((props) => <Button {...props} />)``;

export const GalleryThumb = styled.div`
  width: 96px;
  height: 96px;
  position: relative;
  display: grid;
  place-items: center;
  overflow: hidden;
  cursor: pointer;

  > * {
    grid-area: 1 / 1;
  }

  > .btn {
    background-color: #f6f7f7;
    border: 1px solid #f1f2f2;
    border-radius: 4px;
    width: inherit;
    height: inherit;
    padding: 0;

    &:hover,
    &:focus {
      border-color: #ddd;
    }
  }

  ${Thumbnail} {
    filter: ${(props) => props.faded && `grayscale(0.8)`};
    opacity: ${(props) => props.faded && 0.8};
  }

  ${Remove} {
    position: absolute;
    inset-inline-end: 4px;
    inset-block-start: 4px;
  }
`;
