import { Segmented } from 'antd';
import styled from 'styled-components';

export const SegmentedStyled = styled(Segmented)`
  &.ant-segmented {
    background-color: ${(props) => props.theme['primary-light-4']};
    border: 1px solid ${(props) => props.theme['primary-light-2']};
    padding: 4px 6px;
    .ant-segmented-item {
      font-weight: 700;
      color: ${(props) => props.theme['gray700']};
      &:hover {
        color: ${(props) => props.theme['gray700']};
      }
      flex-grow: 1;
    }
    .ant-segmented-item-selected {
      background-color: ${(props) => props.theme['primary-hover']};
      color: #fff;
      border-radius: 4px;
      &:hover {
        color: #fff;
      }
    }
    &:hover {
      background-color: ${(props) => props.theme['primary-light-4']};
    }

    .ant-segmented-item-label {
      padding: 0 14px;
      min-height: 32px;
      line-height: 32px;
    }

    &.ant-segmented-sm {
      .ant-segmented-item-label {
        min-height: 25px;
        line-height: 25px;
        font-size: 12px;
      }
    }
  }

  .ant-segmented-group {
    // justify-content: space-between;
    @media (min-width: 768px) {
      min-width: var(--minWidth);
    }
    .ant-segmented-thumb {
      background-color: ${(props) => props.theme['primary-hover']};
      inset-inline-start: 0;
      inset-inline-end: auto;
    }
  }
`;

SegmentedStyled.displayName = 'SegmentedStyled';
