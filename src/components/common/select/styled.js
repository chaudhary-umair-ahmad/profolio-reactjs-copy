import tenantTheme from '@theme';
import { Select } from 'antd';
import styled from 'styled-components';

export const SelectStyled = styled(
  ({
    accentColor,
    openIcon,
    isHorizontal,
    noLeftRadius,
    queryParamKey,
    showTag,
    singleValue,
    noRightRadius,
    errorMsg,
    containerClass,
    showIconDown,
    mobileCompactHeight,
    ...rest
  }) => <Select {...rest} />,
)`
  --_accent-color: ${({ accentColor }) => accentColor || tenantTheme['primary-color']};

  .form-post-listing & {
    font-size: inherit;
  }

  &.ant-select-single {
    max-width: ${(props) => props.isHorizontal && '120px'};
  }

  @media screen and (max-width: 991px) {
    &.ant-select-single:not(.ant-select-customize-input) .ant-select-selector {
      height: var(--select-height, 40px);

      .ant-select-selection-search-input {
        height: 38px;
      }
    }
    &.ant-select-single .ant-select-selector .ant-select-selection-item {
      line-height: 38px;
    }

    ${(props) =>
      props.mobileCompactHeight &&
      `
      &.ant-select-multiple:not(.ant-select-customize-input) .ant-select-selector,
    &.mobile-select-multiple.ant-select-multiple:not(.ant-select-customize-input) .ant-select-selector {
      min-height: 36px !important;
      max-height: none !important;
      height: 36px !important;
      padding: 0 8px !important;
      box-sizing: border-box !important;
      display: flex !important;
      align-items: center !important;

      &[style*="height"] {
        min-height: 36px !important;
        height: 36px !important;
      }

      .ant-select-selection-overflow {
        min-height: 36px !important;
        height: 36px !important;
        align-items: center !important;
        display: flex !important;
      }

      .ant-select-selection-item {
        height: 24px !important;
        line-height: 22px !important;
        margin: 0 4px 0 0 !important;
        padding: 0 8px !important;
        font-size: 12px !important;
        border-radius: 4px;
      }

      .ant-select-selection-placeholder {
        line-height: 36px !important;
        height: 36px !important;
        padding-inline-start: 4px;
      }

      .ant-select-selection-search {
        height: 36px !important;
        margin-inline-start: 4px;

        .ant-select-selection-search-input {
          height: 36px !important;
          line-height: 36px !important;
        }
      }
    }
    `}

    &.ant-select .ant-select-arrow .ant-spin {
      margin-inline-end: -4px !important;
      .ant-spin-dot {
        font-size: 18px;
      }
    }
  }

  &.ant-select-single.ant-select-sm: not(.ant-select-customize-input) .ant-select-selector {
    height: var(--select-height, 34px);
    align-items: center;
  }

  &.ant-select:not(.ant-select-disabled):hover .ant-select-selector {
    border-color: var(--_accent-color);
  }

  &.ant-select.ant-select-focused {
    border-color: transparent;

    &:not(.ant-select-disabled).ant-select:not(.ant-select-customize-input) .ant-select-selector {
      box-shadow: none;
      border-color: var(--_accent-color);
    }
  }

  &.ant-select-single.ant-select-show-arrow .ant-select-selection-item {
    > div {
      display: flex;
      align-items: center;
      .anticon {
        margin-inline-end: 3px;
      }
    }
  }

  ${(props) =>
    props.noLeftRadius &&
    `
    &.ant-select {
      .ant-select-selector {
       border-start-start-radius: 0;
        border-end-start-radius: 0;

      }
    }
  `}
`;
SelectStyled.displayName = 'SelectStyled';
