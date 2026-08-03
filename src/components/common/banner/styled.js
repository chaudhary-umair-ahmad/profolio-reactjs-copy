import styled from 'styled-components';

export const BannerStyled = styled.div`
  --banner-padding: 16px;
  --gradient-overlay: 90deg, #e1f6edfe, #e1f6edee 24% 32%, #e1f6edae;

  position: relative;
  padding-block: var(--banner-padding);
  padding-inline: var(--banner-padding);
  z-index: 0;

  &::before {
    background-color: ${({ theme }) => theme['primary-light-3']};
    background-image: linear-gradient(var(--gradient-overlay)), url(${({ bannerPath }) => bannerPath}),
      url(${({ bannerBackground }) => bannerBackground}), linear-gradient(168.93deg, #e1f5ec 33.52%, #cfe7e8 126.5%);
    background-repeat: no-repeat;
    background-size:
      100%,
      auto var(--size, 100%),
      100% auto,
      100%;
    background-position:
      center,
      right var(--right, -88%) center,
      left center,
      center;

    content: '';
    inset: 0;
    position: absolute;
    z-index: -1;
    scale: ${({ theme }) => theme.rtl && '-1 1'};

    @media (min-width: 768px) {
      --gradient-overlay: 90deg, #fff0 24%, #e1f6ed 56%, #fff0;

      border-radius: ${({ theme }) => theme['border-radius-lg']};
      background-position:
        center,
        right var(--right, -40%) center,
        left center,
        center;
      background-size:
        100%,
        var(--size, 60%) auto,
        100% auto,
        100%;
    }
  }

  h1.ant-typography {
    color: ${(props) => props.titleColor || props.theme['primary-color']};
    font-size: var(--titleFontSize, 14px);
    font-weight: ${(props) => props.titleFontWeight || '700'};
    line-height: 1.3;
    max-inline-size: ${({ theme }) => (theme.rtl ? 'initial' : 'var(--max-space, 86%)')};
    margin-block-end: ${(props) => props.titleMarginBottom || '2px'} 2px;

    @media (min-width: 768px) {
      --titleFontSize: 24px;
      max-inline-size: ${({ theme }) => (theme.rtl ? 'initial' : '69%')};
    }
  }

  .cardTitle {
    color: ${({ theme }) => theme['primary-color']};
    font-size: 14px;
    font-weight: 700;
    line-height: 1.3;
    max-inline-size: ${({ theme }) => (theme.rtl ? 'initial' : '86%')};
    margin-block-end: 2px;
    @media (min-width: 768px) {
      font-size: 21px;
      max-inline-size: ${({ theme }) => (theme.rtl ? 'initial' : '69%')};
    }
  }

  .ant-typography-secondary {
    font-size: 12px;
  }

  li {
    width: 45%;
    font-size: 12px;
  }

  @media (min-width: 768px) {
    --banner-padding: 24px;

    li {
      font-size: 14px;
      width: initial;
      > div {
        color: ${(props) => props.listColor};
      }
    }

    .ant-typography-secondary {
      font-size: 1em;
      display: ${(props) => props.displayText};
    }
  }

  .btn-package {
    background-color: #fff;
    color: ${({ theme }) => theme['primary-color']};
    max-width: max-content;
  }
`;
