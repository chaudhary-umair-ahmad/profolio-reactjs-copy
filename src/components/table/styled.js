import ReactAudioPlayer from 'react-audio-player';
import styled from 'styled-components';
import { Group, Popover } from '../common';
import tenantTheme from '@theme';

export const CreditLimitPopup = styled.div`
  &.text-limit {
    .ant-form-item-explain-error {
      font-size: 12px;
      white-space: break-spaces;
    }
  }
`;

export const ReactAudioContainer = styled(({ $drawer, ...rest }) => <ReactAudioPlayer {...rest} />)`
  &.react-audio-player {
    height: 32px;
    width: ${({ $drawer }) => ($drawer ? '100%' : '395px')};
    max-width: ${({ $drawer }) => ($drawer ? '100%' : '395px')};

    @media only screen and (max-width: 767px) {
      height: 28px;
      width: 100%;
      max-width: 100%;
      margin-top: 4px;
    }
  }
`;
export const PopoverListingContainer = styled((props) => <Popover {...props} />)`
  &.listing-detail {
    padding: 8px;
    max-width: max-content;
    @media only screen and (min-width: 767px) {
      &:hover {
        background-color: ${tenantTheme['primary-light-color']};
        width: 100%;
        border-radius: 6px;
      }
    }

    .ant-popover-inner {
      padding: 0 !important;
    }

    @media only screen and (max-width: 767px) {
      padding: 0;
      margin-bottom: 8px;
    }
  }
`;

export const ListingCardDetail = styled.div`
  &.card-hover {
    margin-inline: -16px;
    padding-inline: 16px;

    .card-scroll {
      cursor: pointer;
      margin-inline: -16px;
      padding-inline: 16px;
      padding-block: 12px;
      & + .card-scroll {
        border-top: 1px solid ${tenantTheme['border-color-light']};
      }
      &:hover {
        background-color: ${tenantTheme['primary-light-4']};
      }
    }
  }
`;
