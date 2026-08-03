import tenantTheme from '@theme';
import styled from 'styled-components';
import Group from '../../common/group/group';
import { Thumbnail } from '../../common/image-uploads/styled';

export const VideoSelector = styled.div`
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

export const AddVideo = styled(Group)`
  border: 1px dashed ${tenantTheme['primary-color']};
  border-radius: ${tenantTheme['border-radius-base']};
  padding: 16px;
  position: relative;

  .btn-close {
    position: absolute;
    inset-block-start: 10px;
    inset-inline-end: 8px;
    top: -5px;
    right: 0px;
  }
`;
