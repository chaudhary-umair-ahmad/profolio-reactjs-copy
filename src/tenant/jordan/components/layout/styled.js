import { Drawer } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { Button, Dropdown, Flex, Modal } from '../../../../components/common';

import tenantTheme from '@theme';
import { ButtonStyled } from '../../../../components/common/button/styled';
import { getBaseURL, TENANT_KEY } from '../../../../utility/env';

const screenXsMax = 640;

export const FooterStyled = styled.footer`
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;

  &.footer {
    background: url('${getBaseURL()}/profolio-assets/${TENANT_KEY}/lite/footer-bayut.svg');
    background-size: 28px 28px;
    background-color: ${tenantTheme['base-color']};
    color: ${tenantTheme.gray700};
    font-size: 0.875rem;
    line-height: 1.5;
    padding-block-start: 20px;
    padding-block-end: 10px;
    padding-inline: 24px;

    @media (max-width: ${screenXsMax}px) {
      padding-inline: 10px;
    }

    @media (min-width: ${screenXsMax + 1}px) {
      padding-top: 40px;
      padding-bottom: 35.5px;
      background-color: ${tenantTheme['base-color']};
    }
  }

  .footerNav {
    display: flex;
    list-style: none;
    padding-inline-start: 0;
    margin-bottom: 5px;
    flex-wrap: wrap;

    li {
      color: #dedede;
      font-weight: 700;
      line-height: 37px;
      letter-spacing: 0.053em;
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

    @media (max-width: ${screenXsMax}px) {
      margin-block-start: 10px;
      margin-inline: auto;
      padding-inline-start: 15px;
      text-indent: -15px;
      max-width: 248px;
      width: max-content;
    }
  }

  .seperator {
    &:not(:last-child) {
      &::after {
        content: '|';
        margin-inline: 12px;
      }
    }
  }

  html[dir='rtl'] {
    .seperator {
      &:not(:last-child) {
        &::after {
          content: '|';
          margin-inline: 12.5px;
        }
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

    span {
      color: #dedede;
    }

    &:hover {
      svg {
        filter: none;
      }
    }

    // svg {
    //   filter: grayscale(1);
    // }
  }

  .badges svg {
    vertical-align: middle;
  }

  .dropdownIcon {
    margin-inline-start: 1px;
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
    opacity: 0.85;

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

    .languageDropdown {
      --dropdown-width: var(--min-width, max-content);
      --top: 26px;
      --svg-margin-end: 0;
      --border-radius: 6px;
      --align: 'start';

      padding: var(--padding, 4px);
      inset-inline-end: var(--right) !important;

      div {
        padding: 0 !important;
        cursor: pointer;

        &:not(:last-child) {
          margin-bottom: 8px;
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
      > div {
        &:hover {
          text-decoration: none !important;
        }
      }

      .ant-dropdown-menu {
        outline: 1px solid #f39;
        min-width: 148px;
      }

      .ant-dropdown-menu-item {
        padding: 5px 16px;
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
    }

    .ant-btn {
      --btn-content-color: ${tenantTheme['base-color']};
      font-weight: 400;

      svg {
        color: ${tenantTheme.gray800};
      }

      &:hover {
        svg {
          color: ${tenantTheme['primary-color']};
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

    ${ButtonStyled} {
      border-radius: 8px;
      padding-block: 18px;

      width: 143px;
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
  --nav-link-color: ${tenantTheme['base-color']};

  font-size: 16px;

  a {
    display: inline-block;
    color: var(--nav-link-color);

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
    background-color: ${tenantTheme['primary-light-3']};
    background-image: url('${getBaseURL()}/profolio-assets/${TENANT_KEY}/lite/upsell.svg');
    background-repeat: no-repeat;
    background-position: bottom right;
    background-size: 36px;
    color: ${tenantTheme['base-color']} !important;
    margin-block-start: -4px;
    flex-wrap: wrap;
    max-width: var(--dropdown-width);
    transition: background-color 0.2s;

    &:hover {
      background-color: ${tenantTheme['primary-light-4']};
      box-shadow: inset 0 0 8px 1px ${tenantTheme['primary-light-3']};
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
