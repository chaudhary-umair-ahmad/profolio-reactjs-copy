import tenantTheme from '@theme';
import styled from 'styled-components';
import { Thumbnail } from '../../common/image-uploads/styled';

export const ImageSelector = styled.div`
  position: relative;

  .ant-checkbox {
    border-radius: 4px;
    position: absolute;
    inset-block-start: 8px;
    inset-inline-start: 8px;

    + span {
      border-radius: ${tenantTheme['border-radius-base']};
      overflow: hidden;
      padding-inline: initial;
      display: inline-block;
      width: inherit;
      height: inherit;
    }
  }

  .ant-checkbox-checked {
    + span {
      box-shadow: 0 0 0 2px ${tenantTheme['primary-color']};
    }
  }

  ${Thumbnail} {
  }
`;

export const ImageEnlarge = styled.div`
  position: absolute;
  inset-inline-end: 3px;
  inset-block-end: 3px;
  display: inline-flex;
  cursor: pointer;
`;
