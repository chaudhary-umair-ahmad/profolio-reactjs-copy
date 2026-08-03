import { Drawer } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { Button, Dropdown, Flex, Modal } from '../../../../components/common';

import tenantTheme from '@theme';
import { ButtonStyled } from '../../../../components/common/button/styled';
import { getBaseURL, TENANT_KEY } from '../../../../utility/env';

const screenXsMax = 640;
const screenDesktop = 1280;

export const FooterStyled = styled.footer`
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;

  &.footer {
    background: url('${getBaseURL()}/profolio-assets/${TENANT_KEY}/lite/footer-bayut.svg');
    background-size: 28px 28px;
    background-color: ${tenantTheme['base-color']};
    color: ${tenantTheme.gray700};
    font-family: Lato, Helvetica, sans-serif;
    font-size: 0.875rem;
    line-height: 1.5;
    padding-block-start: 20px;
    padding-block-end: 10px;
    padding-inline: 24px;

    [dir='rtl'] & {
      font-family: 'Droid Arabic Kufi', 'Lato', sans-serif;
    }

    @media (max-width: ${screenXsMax}px) {
      padding-inline: 10px;
    }

    @media (min-width: ${screenXsMax + 1}px) {
      padding-top: 40px;
      padding-bottom: 38px;
      background-color: ${tenantTheme['base-color']};
    }
  }

  .footer-icons {
    @media (max-width: ${screenDesktop}px) {
      flex-wrap: wrap;
    }
  }

  .footerNav {
    display: flex;
    list-style: none;
    padding-inline-start: 0;
    margin-bottom: 4.5px;
    [dir='rtl'] & {
      margin-bottom: 5.5px;
      width: ${TENANT_KEY === 'oman' ? '28rem' : '17rem'};
    }
    flex-wrap: wrap;

    li {
      color: #dedede;
      font-weight: 700;
      line-height: 37px;
      letter-spacing: 0.84px;
      // [dir='rtl'] & {
      //   line-height: 36.5px;
      // }
    }

    a {
      display: inline-block;
      color: inherit;

      &:hover,
      &:focus {
        color: #f2f2f2;
        text-decoration: underline;
      }
    }
  }

  .copyRight {
    color: #c1bfbf;
    font-size: 12px;
    [dir='rtl'] & {
      margin-top: 2px;
    }

    @media (max-width: ${screenXsMax}px) {
      margin-block-start: 10px;
      margin-inline: auto;
      padding-inline-start: 15px;
      text-indent: -15px;
      max-width: 248px;
      width: max-content;
    }
  }

  .separator {

    display: inline-block;

    background: #fff;
   margin-inline-end: 13.9px;
    margin-inline-start: 13px;
    margin-block: -2px;
     width: 1px;
    height: 13px;
  
  [dir='rtl'] & {
      margin-inline-end: 13px;
    margin-inline-start: 13.9px;
    margin-block: 0px;
        width: 1.5px;
    height: 10px;
   
    }

   
}
  }

  .hoverIcon {
    --btn-bg-color: #dbdbdb;
    --btn-content-color: #2d2d2d;
    --btn-padding-y: 0;

    width: 36px;
    height: initial;
    aspect-ratio: 1;
    padding: 0;
    transition: none;

    &:hover {
      --ant-button-default-hover-bg: var(--hover-bg);
      --ant-button-default-hover-color: #fff;
    }
  }

  .ant-dropdown-trigger {
    background-color: transparent;
    border: 0;
    padding: 0;
    margin-inline-start: 8px;
    html[dir='rtl'] & {
      margin-inline-start: 9px;
    }

    span {
      color: #dedede;
    }

    &:hover {
      svg {
        filter: none;
      }
    }

    svg {
      // filter: grayscale(1);
    }
  }

  .badges svg {
    vertical-align: middle;
  }

  .dropdownIcon {
    margin-inline-start: 0px;
    transform: rotate(360deg);

    &.open {
      transform: rotate(180deg);
    }
  }

  .instagram-logo {
    --ig-white: #fff;
    --ig-blue: #3051f1;
    --ig-purple: #c92bb7;
    --ig-red: #f73344;
    --ig-orange: #fa8e37;
    --ig-yellow: #fcdf8f;
    --ig-yellow_to: #fbd377;

    &:hover {
      --ant-button-default-hover-bg: radial-gradient(
          circle farthest-corner at 28% 120%,
          var(--ig-yellow) -16%,
          var(--ig-yellow_to) 16%,
          var(--ig-orange) 32%,
          var(--ig-red) 48%,
          transparent 64%
        ),
        linear-gradient(0deg, var(--ig-red) 16%, transparent 72%),
        radial-gradient(circle farthest-corner at 12% 12%, var(--ig-blue) -8%, var(--ig-purple) 32%);
      background-repeat: no-repeat;
      background-position: center;
      background-origin: border-box;
    }
  }

  .scrollTop {
    svg {
      color: #dbdbdb;
    }

    &:hover {
      opacity: 1;
    }
  }
`;
FooterStyled.displayName = 'FooterStyled';

export const HeaderStyled = styled.header`
  .modalContainer {
    padding: 48px;
  }

  .currency-text {

   font-family:
        Lato,
        sans-serif !important;

    html[dir='rtl'] & {
      font-family:
        Droid Arabic Kufi,
        sans-serif !important;
    }
  }

  .icon-login {
    padding: 0;
    padding-block-start: 0px !important;
    --btn-bg-color: none;
    border: none !important;
    padding-block-end: 0px;
    color: #006169 !important;
    padding-inline: 0px !important;
    margin-top: 1px;
    --btn-padding-y: 0px !important;

    span {
      font-weight: 700;
    }
    svg {
      fill: #006169 !important;
    }
    &:hover {
      border: none;
      --ant-button-default-hover-bg: none;
    }
  }

  ${({ $fullWidth }) =>
    $fullWidth &&
    `
    .navbar-ceiling.full-width,
    .navbar-floor.full-width {
      width: 100vw;
      .container {
        max-width: 1200px;
        margin: 0 auto;
      }
    }
  `}

  .shine {
    background: linear-gradient(120deg, #0000 33%, rgb(255 255 255 / 0.4) 50%, #0000 66%) #eb5322;
    background-size: 300% 100%;
    animation: shine 2s infinite;
  }
  @keyframes shine {
    0% {
      background-position: right;
    }
  }

  .navbar-ceiling {
    background-color: ${tenantTheme.gray200};
    color: ${tenantTheme['base-color']};
    font-family: ${tenantTheme['font-family']} !important;

    .navbar-text,
    .ant-btn,
    .ant-btn span,
    .ant-dropdown-trigger,
    .ant-dropdown-trigger span,
    .dropDownSelect,
    .dropDownSelect span,
    .languageDropdown,
    .languageDropdown span {
      font-family: ${tenantTheme['font-family']};
    }

    .navbar-text {
      font-size: ${tenantTheme['font-size-base']};
      font-weight: 400;
      color: ${tenantTheme['base-color']};
    }

    .navbar-text-bold {
      font-family: ${tenantTheme['font-family']};
      font-size: ${tenantTheme['font-size-base']};
      font-weight: 700;
      color: ${tenantTheme['base-color']};
    }

    .navbar-text-small {
      font-family: ${tenantTheme['font-family']};
      font-size: 12px;
      font-weight: 400;
      color: ${tenantTheme['primary-color']};
    }

    .languageDropdown {
      --dropdown-width: var(--min-width, max-content);
      --top: 26px;
      --svg-margin-end: 0;
      --border-radius: 6px;
      --align: 'start';
      --ant-font-family: ${tenantTheme['font-family']} !important;
      font-family: ${tenantTheme['font-family']} !important;

      padding: var(--padding, 4px);
      inset-inline-end: var(--right) !important;

      div {
        padding: 0 !important;
        cursor: pointer;
        font-family: ${tenantTheme['font-family']} !important;

        &:not(:last-child) {
          margin-bottom: 8px;
        }
      }

      span {
        font-family: ${tenantTheme['font-family']} !important;
      }

      .ant-dropdown-trigger {
        --ant-font-family: ${tenantTheme['font-family']} !important;
        font-family: ${tenantTheme['font-family']} !important;

        span {
          font-family: ${tenantTheme['font-family']} !important;
        }
      }

      .active {
        color: ${tenantTheme['primary-color']};
      }
    }

    .loginLinks {
      li {
        cursor: pointer;
        padding: 5px 16px;

        &:hover {
          text-decoration: underline;
        }
      }
    }

    .ant-dropdown-trigger {
      cursor: pointer;
      display: flex;
      align-items: center;
      border: 0;
      background-color: transparent;
      padding: 0;
      color: ${tenantTheme['base-color']};
      transition: cubic-bezier(0.645, 0.045, 0.355, 1) 0.3s;

      span {
        color: ${tenantTheme.gray800};
      }

      &:hover {
        color: ${tenantTheme['primary-color']};
        span {
          color: currentColor;
        }
        svg {
          fill: ${tenantTheme['primary-color']};
        }
      }
    }

    .favouritePropertiesTag {
      svg {
        color: ${tenantTheme.gray800};
      }

      &:hover {
        svg {
          color: ${tenantTheme['primary-color']};
        }
        color: ${tenantTheme['primary-color']};
      }
    }

    .dropDownSelect {
      --ant-font-family: ${tenantTheme['font-family']} !important;
      font-family: ${tenantTheme['font-family']} !important;

      > div {
        font-family: ${tenantTheme['font-family']} !important;

        &:hover {
          text-decoration: none !important;
        }
      }

      span {
        font-family: ${tenantTheme['font-family']} !important;
      }

      .ant-dropdown-trigger {
        --ant-font-family: ${tenantTheme['font-family']} !important;
        font-family: ${tenantTheme['font-family']} !important;

        span {
          font-family: ${tenantTheme['font-family']} !important;
        }
      }

      .ant-dropdown-menu {
        outline: 1px solid #f39;
        min-width: 148px;
      }

      .ant-dropdown-menu-item {
        padding: 5px 16px;

        a {
          color: inherit;

          &:hover {
            text-decoration: underline;
          }
        }

        span {
          &:hover a {
            text-decoration: underline;
          }
        }

        .my-bookings-link {
          color: inherit;
          text-decoration: none;

          &:hover {
            text-decoration: underline;
          }
        }
      }

      button {
        padding: 0;

        span {
          color: ${tenantTheme['base-color']};
        }

        svg {
          color: ${tenantTheme.gray800};
          margin-inline-end: 7px;
        }

        &:hover {
          span,
          svg {
            color: ${tenantTheme['primary-color']};
          }
        }
      }

      ul {
        &:hover {
          text-decoration: none;
        }

        li {
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }

    .navlinks {
      gap: 8px;

      span {
        font-size: 0.875rem;
      }

      svg {
        color: ${tenantTheme.gray800};
      }

      &:hover {
        --underline-link: none;

        > * {
          color: ${tenantTheme['primary-color']};
        }
      }
    }

    svg {
      transition: cubic-bezier(0.645, 0.045, 0.355, 1) 0.3s;
      fill: #4c4a4a;
    }

    .ant-btn {
      --btn-content-color: ${tenantTheme['base-color']};
      --ant-font-family: ${tenantTheme['font-family']} !important;
      font-weight: 400;
      font-family: ${tenantTheme['font-family']} !important;

      span {
        font-family:  ${tenantTheme['font-family']}) ;
      
      }

      svg {
        color: #4c4a4a;
      }

      &:hover {
        svg {
          color: ${tenantTheme['primary-color']};
          fill: ${tenantTheme['primary-color']};
        }
      }
    }
  }

  .navbar-ceiling,
  .navbar-floor {
    padding-inline: 24px;
  }

  .navbar-floor {
    background-color: #fff;

    .navbar-text {
      font-family: ${tenantTheme['font-family']};
      font-size: ${tenantTheme['font-size-base']};
      font-weight: 400;
      color: ${tenantTheme['base-color']};
    }

    ${ButtonStyled} {
      border-radius: 8px;
      padding-inline: 11px 11px;
      padding-block: 20px 17px;
      font-family: ${tenantTheme['font-family']};
    }
  }

  .dropdownIcon {
    transform: rotate(360deg);

    &.open {
      transform: rotate(180deg);
    }
  }

  .favouritePropertiesModal {
    max-width: 325px !important;

    .favouritePropertiesContent {
      padding-inline: 35px;
      padding-block-start: 0px;
      padding-block-end: 35px;
    }
  }

  .favouriteProperty {
    background: linear-gradient(44.5deg, #fff9, #0002);
  }

  .localeModal {
    > div {
      max-width: 416px;
    }

    .localeInnerContainer {
      padding: 38px 24px 32px;
    }

    .cancelBtn {
      &:hover {
        border: 1px solid ${tenantTheme['primary-color']};
        background-color: #fff;
        color: ${tenantTheme['primary-color']};
      }
    }
  }

  .closeIconBg {
    position: absolute;
    inset-inline-end: 16px;
    inset-block-start: 16px;
    border-radius: 4px;
    display: flex;
    &:hover {
      background-color: #cecece;
    }

    svg {
      cursor: pointer;

      &:hover {
        .closeIconBg {
          background-color: ${tenantTheme.gray800};
        }
      }
    }
  }

  .currencyContainer {
    > div {
      max-width: 400px;

      @include size-md-down {
        max-width: 300px;
        border-top: 5px solid #28b16d;
        border-radius: 4px;
        border-left: none;
        border-right: none;
      }

      border-radius: 0px 0px 4px 4px;
    }

    .currencyHeader {
      padding: 10px;
      box-shadow: 0 0.3rem 0.6rem 0 rgba(0, 0, 0, 0.08);

      @include size-md-down {
        box-shadow: none;
        padding: 0;
      }

      > div {
        margin: auto;

        h4 {
          font-size: 21px;

          margin-bottom: 0;

          @include size-md-down {
            margin-top: 25px;
            font-size: 30px;
            font-weight: 400;
            margin-bottom: 20px;
            letter-spacing: -1px;
          }
        }
      }
    }

    .unitSelect {
      .select__control {
        background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 6" fill="%23222"><path class="cls-1" d="M0 0l6 6 6-6H0z"/></svg>');
        background-repeat: no-repeat;
        background-position: calc(100% - 7px);
        background-size: 14px;

        button {
          padding: 0;
          width: 100%;

          > div {
            justify-content: space-between;
            align-items: center;
          }
        }

        padding: 0 8px;
        margin-bottom: 10px;
        border: 1px solid #e5e5e5;
        border-radius: 2px;
        height: 40px;

        @include size-md-down {
          height: 35px;
          margin-bottom: 22px;
          border-radius: 4px;
        }

        .select__single-value {
          font-size: 14px;
          font-weight: 400;
          color: #222;

          @include size-md-down {
            font-size: 13px;
          }
        }
      }

      .select__menu {
        border-radius: 0;
        box-shadow: none;

        .select__option {
          cursor: pointer;
          padding: 0px 10px;

          font-size: 12px;
          line-height: 34px;

          &:hover {
            background-color: #f5f5f5;
          }
        }
      }
    }
  }

  .closeIcon {
    position: absolute;
    inset-inline-end: 10px;
    inset-block-start: 9px;
    border-radius: 4px;
    background-color: var(--icon-bg, #e3e3e3);
    display: flex;
    cursor: pointer;

    &:hover {
      background-color: #cecece;
    }

    @include size-md-down {
      background-color: #fff;
    }
  }

  .favouritePropertiesPopup {
    height: 48px;
    width: 48px;
    background: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"><defs><linearGradient id="a" x1=".8" x2=".5" y1=".1" y2="1" gradientUnits="objectBoundingBox"><stop offset="0" stop-color="%23ef3d3d"/><stop offset="1" stop-color="%23bf1212"/></linearGradient></defs><path fill="none" d="M0 0h48v48H0z"/><path fill="url(%23a)" d="M24 45.4l-3.2-3.1C9.5 31.5 2 24.3 2 15.7 2 8.7 7.3 3 14.1 3A13 13 0 0124 7.8 13 13 0 0134 3c6.7 0 12 5.6 12 12.7 0 8.7-7.5 15.8-18.8 26.6z"/></svg>')
      50% / contain no-repeat;
  }
`;
HeaderStyled.displayName = 'HeaderStyled';

export const NavbarLinks = styled((props) => <Flex {...props} />)`
  .new-tag {
    inset-inline-start: 4px;
    top: -7px !important;
    padding-block: 3px 3px !important;
    padding-inline: 4.91px !important;
    padding-top: 3.5px;
    min-width: 35px;
    line-height: 10px;

    font-family: Lato, Helvetica, sans-serif !important;

    html[dir='rtl'] & {
      letter-spacing: 0.5px;
      min-width: 35px;
      min-height: 16px;
      height: 16px;
      line-height: 6px;
      inset-inline-start: 4px;
      inset-block-start: -3px;
      padding: 22px 7px;
      padding-inline: 6.91px !important;
      top: -7.5px !important;
      font-family:
        Droid Arabic Kufi,
        Lato,
        sans-serif !important;
    }
  }

  --nav-link-color: ${tenantTheme['base-color']};

  font-size: 16px;
  font-family: ${tenantTheme['font-family']};

  a {
    display: inline-block;
    color: var(--nav-link-color);
    font-family: ${tenantTheme['font-family']};

    &:hover {
      --nav-link-color: ${tenantTheme['primary-color']};
    }
  }

  .ant-btn {
    line-height: 1.2;
    padding: 8px 14px;
    border: 0;

    &:hover {
      border-color: transparent;
    }
  }

  .ant-tag {
    font-weight: 600;
    padding-inline: 3px;
    position: relative;
    top: -0.8rem;
    color: #fff;
    line-height: 1;
    text-transform: uppercase;
  }

  /* Style dropdown to match anchor tags */
  > div > div[class*='ant-dropdown-trigger'] {
    padding: 0 !important;
    border: none !important;
    background: transparent !important;
    min-width: auto !important;
    width: auto !important;
    display: inline-flex !important;
    color: var(--nav-link-color) !important;
    font-size: inherit !important;
    line-height: inherit !important;
    cursor: pointer !important;

    > div {
      padding: 0 !important;
      gap: 4px !important;
      display: inline-flex !important;
      align-items: center !important;
    }

    /* Make icon color match text color */
    svg,
    .anticon {
      margin-inline-start: 2px;
      width: 20px;
      height: 20px;
      transform: scale(1.08);
      html[dir='rtl'] & {
        margin-inline-start: 2px;
        width: 20px;
        height: 20px;
        transform: scale(1.01);
      }
    }

    &:hover {
      --nav-link-color: ${tenantTheme['primary-color']};
      border-color: transparent !important;

      svg,
      .anticon {
        color: ${tenantTheme['primary-color']} !important;
        fill: ${tenantTheme['primary-color']} !important;
      }
    }
  }
`;
NavbarLinks.displayName = 'NavbarLinks';

export const FAB = styled((props) => <Button {...props} />)`
  &.ant-btn {
    --btn-bg-color: ${tenantTheme['success-color']};
    --btn-content-color: #fff;

    position: fixed;
    inset-inline-end: 8vmin;
    bottom: 8vmin;
    box-shadow: 0 4px 8px rgba(28, 28, 28, 0.1);
    z-index: calc(infinity);

    &:hover,
    &:focus {
      --btn-bg-color: ${tenantTheme['success-color']};
      --btn-content-color: #fff;
    }
  }
`;

export const ModalPopupStyle = styled((props) => <Modal {...props} />)`
  .ant-modal-close-x {
    margin-block-start: 2px;
    .anticon {
      background-color: #e3e3e3;
      border-radius: 4px;
      height: 24px;
      width: 24px;
      &:hover {
        background-color: #cecece;
      }
      svg {
        color: #000;
      }
    }
  }

  .ant-btn:not(.ant-btn-link) {
    &:hover {
      --btn-bg-color: #1c7c4c;
    }
  }

  .ant-modal-content {
    border-radius: 4px;
  }

  .ant-modal-title {
    h2 {
      font-size: 21px;
      font-weight: 700;
    }
  }

  .ant-modal-header {
    box-shadow: 0 0.3rem 0.6rem 0 rgba(0, 0, 0, 0.08);
    padding: 9px 24px;
    border-radius: 0;
  }
  .ant-modal-body {
    padding: 29px 40px 10px;
  }

  .unitSelectDropdown {
    .ant-select-selector {
      margin-bottom: 10px;
      border: 1px solid #e5e5e5;
      border-radius: 2px;
    }
    /* .ant-select-arrow {
      display: none;
    } */

    .ant-select-arrow {
      right: 5px;
      height: 7px;
      svg {
        color: #000;
        width: 28px;
        height: 28px;
      }
    }
    .ant-select {
      &:hover {
        .ant-select-selector {
          border-color: #e5e5e5;
        }
      }
    }
  }

  .ant-select-rtl .ant-select-arrow {
    right: auto;
    left: 11px;
  }

  .saveBtn {
    border-radius: 2px;
    height: 40px;
    font-size: 13px;
  }

  @media only screen and (max-width: 767px) {
    .ant-modal-content {
      border-top: 5px solid #28b16d;
      border-radius: 4px;
      border-left: none;
      border-right: none;
    }
    .ant-modal-title {
      font-size: 30px;
      margin-block-start: 25px;
      margin-block-end: 0;
      text-align: center;
      font-weight: 400;
    }
    .ant-modal-body {
      padding: 20px;
    }
    .ant-modal-header {
      box-shadow: none;
      border-radius: 0;
      border-bottom: none;
      padding-bottom: 0;
    }
    .ant-modal-close-x {
      margin-block-start: 0;
      .anticon {
        background-color: transparent;
        margin-inline-start: 12px;
        &:hover {
          background-color: #cecece;
        }
      }
    }

    .unitSelectDropdown {
      .ant-select {
        font-size: 13px;
      }
    }
  }
`;

export const ModalLangPopup = styled((props) => <Modal {...props} />)`
  .languageSwitchPill {
    .ant-radio-wrapper-checked {
      font-weight: 700;
    }
    .ant-radio-wrapper {
      font-size: 16px;
      &:not(.ant-radio-wrapper-checked) {
        background-color: #fff;
        border: 1px solid #dbdbdb;
        &:hover {
          border: 1px solid #dbdbdb;
          background-color: #f5f5f5;
        }
      }
    }
  }

  .ant-modal-close-x {
    margin-block-start: 2px;
    .anticon {
      border-radius: 4px;
      height: 24px;
      width: 24px;
      &:hover {
        background-color: #cecece;
      }
    }
  }
`;

export const SideMenuContainer = styled((props) => <Drawer {...props} />)`
  .ant-drawer-header {
    padding-inline: 8px;
    padding-block: 14px;
    border-bottom: none;
  }
  .ant-drawer-body {
    padding: 14px;
    .ant-divider {
      margin-inline: -14px;
      width: unset;
      margin-block: 0;
    }
  }
`;

export const PillStyled = styled.div`
  &.mainContainer {
    margin-bottom: 24px;
  }
  .languageSwitchPill {
    .ant-radio-wrapper-checked {
      font-weight: 700 !important;
    }
    .ant-radio-wrapper {
      font-size: 16px;
      &:not(.ant-radio-wrapper-checked) {
        background-color: #fff;
        border: 1px solid #dbdbdb;
        &:hover {
          border: 1px solid #dbdbdb;
          background-color: #f5f5f5;
        }
      }
    }
  }
`;

export const CountryDropdown = styled((props) => <Flex {...props} />)`
  &.countrydropdown {
    &.countryDropDownBtn {
      line-height: 48px;
      flex-direction: row-reverse;
      justify-content: space-between;
      font-weight: 700;
      &.active {
        svg {
          transform: rotate(180deg);
        }
      }
      > div {
        font-size: 18px;
      }
    }
    .countryMap {
      svg {
        width: 32px;
        box-shadow: 0 0 0 0.5px #000;
      }
      margin-block: 8px;
    }
  }
`;
export const CompanyInfo = styled((props) => <Flex {...props} />)`
  &.active {
    svg {
      transform: rotate(180deg);
    }
  }
`;
export const DropdownCountry = styled((props) => <Dropdown {...props} />)`
  .ant-dropdown-menu {
    box-shadow: 0 0.2rem 0.4rem rgba(0, 0, 0, 0.16);
    border: 1px solid #c1bfbf;
    border-radius: 8px;
    min-width: 160px;
    padding-block: 8px;

    .ant-dropdown-menu-item {
      padding: 0;

      a {
        color: #222;
        padding: 4px 16px;
        text-decoration-color: transparent;

        &:hover {
          text-decoration: underline;
          text-decoration-color: #dedede;
        }
      }

      .anticon {
        svg {
          box-shadow: 0 0 0 0.5px #000;
          border-radius: 2px;
          // filter: grayscale(1);
          width: 16px;
          height: 11px;
        }
      }

      &:hover {
        .anticon {
          svg {
            filter: none;
          }
        }
      }
    }
  }
`;

export const UserDetail = styled.div``;

export const DrawerContainer = styled.div`
  .ant-drawer-body {
    padding: 0;
  }

  .sideBarIcon {
    position: absolute;
    inset-inline-start: 10px;
    inset-block-start: 15px;
  }
`;

export const DropdownItemUpsell = styled.li`
  && {
    padding: initial;
  }

  a {
    background-color: #e5eff0;
    cursor: pointer;

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: url('${getBaseURL()}/profolio-assets/images/user-profile.svg');
      opacity: 0.4;
      background-repeat: no-repeat;
      background-position: top 11px right 0px;
      background-size: 40px;
      html[dir='rtl'] & {
        transform: scaleX(-1);
      }
    }
    color: ${tenantTheme['base-color']} !important;
    margin-block-start: -4px;
    flex-wrap: wrap;
    max-width: var(--dropdown-width);
    transition: background-color 0.2s;

    &:hover {
      text-decoration: underline;
    }

    html[dir='rtl'] & {
      background-position: bottom left;
    }

    svg {
      margin: initial;
      margin-inline-start: 4px;
    }
  }
`;

export const LiteDropdownItems = styled.div`
  .items {
    padding: 0;
    flex-grow: 1;
    font-size: 14px;
    &:hover {
      text-decoration: underline;
    }
  }
`;
