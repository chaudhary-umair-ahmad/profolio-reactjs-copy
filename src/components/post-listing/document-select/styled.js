import tenantTheme from '@theme';
import styled from 'styled-components';
import { Thumbnail } from '../../common/image-uploads/styled';

export const DocumentSelector = styled.div`
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
