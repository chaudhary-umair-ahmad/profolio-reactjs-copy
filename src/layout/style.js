import Styled from 'styled-components';

const Div = Styled.div`
    position: relative;

    .container {
      width: min(100%, var(--container-width, 78.571428em));
      margin-inline: auto;

      @media (min-width: 85.4375rem) {
        --container-width: 75rem;
      }
    }

    header{
        box-shadow: 0 2px 30px ${({ theme }) => theme['gray-solid']}10;
        ${({ darkMode }) => (darkMode ? `background: #272B41;` : '')};
        z-index: 999;

        @media print {
            display: none;
        }

        .ant-btn-link{
            ${({ darkMode }) =>
              darkMode ? `background: #272B41;border-color: #272B41;color: #7D808D !important` : ''};
        
        }

        .head-example{
            ${({ darkMode }) => (darkMode ? `color: #A8AAB3;` : '')};
        }
        .ant-menu-sub.ant-menu-vertical{
            .ant-menu-item{
                a{
                    color: ${({ theme }) => theme['gray-color']};
                }
            }
        }
        .ant-menu.ant-menu-horizontal{
            display: flex;
            align-items: center;
            margin: 0 -16px;
            li.ant-menu-submenu{
                margin: 0 16px;
            }
            .ant-menu-submenu{
                &.ant-menu-submenu-active,
                &.ant-menu-submenu-selected,
                &.ant-menu-submenu-open {
                    .ant-menu-submenu-title {
                        color: ${({ darkMode }) => (darkMode ? `#fff;` : '#5A5F7D')};

                        svg,
                        i{
                            color: ${({ darkMode }) => (darkMode ? `#fff;` : '#5A5F7D')};
                        }
                    }
                }
                .ant-menu-submenu-title{
                    font-weight: 500;
                    color: ${({ darkMode }) => (darkMode ? `#ffffff90;` : '#5A5F7D')};
                    svg,
                    i{
                        color: ${({ darkMode }) => (darkMode ? `#ffffff90;` : '#5A5F7D')};
                    }
                    .ant-menu-submenu-arrow{
                        font-family: "FontAwesome";
                        font-style: normal;
                        margin-inline-start: 6px;
                        &:after{
                            color: ${({ darkMode }) => (darkMode ? `#ffffff90;` : '#9299B8')};
                            content: '\f107';
                            background-color: transparent;
                        }
                    }
                }
            }
        }


    }
    .header-more{
        .head-example{
            ${({ darkMode }) => (darkMode ? `color: #A8AAB3;` : '')};
        }
    }
    .striking-logo {
        @media only screen and (max-width: 875px){
            margin-inline-end: 4px;
        }
        @media only screen and (max-width: 767px){
            margin-inline-end: 0;
        }
        img, svg {
            max-width: ${({ theme }) => (theme.topMenu ? '140px' : '250px')};
            vertical-align: middle;
            width: 100%;
            @media only screen and (max-width: 767px){
                max-width: ${({ theme }) => (theme.topMenu ? '140px' : '150px')};
            }
        }
        &.top-menu{
            margin-inline-start: 15px;
        }
    }
    .certain-category-search-wrapper{
         border-inline-end: 1px solid ${({ darkMode }) => (darkMode ? '#272B41' : '')};
         @media only screen and (max-width: 767px){
            padding: 0 15px;
        }
        input{
            max-width: 350px;
            ${({ darkMode }) => (darkMode ? `background: #272B41;` : '')};
            ${({ darkMode }) => (darkMode ? `color: #fff;` : '#5A5F7D')};
            @media only screen and (max-width: 875px){
              padding-inline-start: 5px;
            }
        }
    }

    .navbar-brand{
        button{
            padding-block: 0;
            padding-inline: 10px 30px;
            line-height: 0;
            color: ${({ theme }) => theme['dark-color']};
            @media only screen and (max-width: 875px){
              padding-block: 0;
              padding-inline: 25px 10px;
            }
            @media only screen and (max-width: 767px){
              padding-block: 0;
              padding-inline: 0 15px;
            }
        }
    }

    /* Sidebar styles */
    .ant-layout-sider{
        overflow: visible;
        box-shadow: 0 0 30px #9299B810;
        border-inline-end: 1px solid ${({ theme }) => theme['gray400']};
        padding-inline: 0 15px;
        --sidebar-brand-inset: 29px;
        transition:
          width 220ms ease,
          min-width 220ms ease,
          max-width 220ms ease,
          flex-basis 220ms ease,
          padding-inline 220ms ease;
        will-change: width, min-width, max-width, flex-basis;
        .ant-menu{
         .ant-menu-item{
         --ant-menu-item-height: 36px;
        }
        }
       


        @media (max-width: 991px){
            box-shadow: 0 0 10px #00000020;
            box-shadow: none;
        }
        @media print {
            display: none;
        }
        &.ant-layout-sider-dark{
            background: ${({ theme }) => theme['dark-color']};
            .ant-layout-sider-children{
                .ant-menu{
                    .ant-menu-submenu-inline{
                        > .ant-menu-submenu-title{
                            padding: 0 30px !important;
                        }
                    }
                    .ant-menu-item {
                        padding: 0 30px !important;
                    }
                }
            }
        }

        .ant-layout-sider-children {
					padding-bottom: 10px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    position: relative;
                    overflow: visible;
                    min-height: 0;

                    .sidebar-menu-scroll {
                      flex: 1;
                      min-height: 0;
                      overflow-x: hidden;
                      overflow-y: auto;
                      display: flex;
                      flex-direction: column;

                      /* 24px gap from Profolio / market title to menu: spacing lives on logo block; menu root has no extra top inset */
                      > .ant-menu {
                        margin-block-start: 0;
                        padding-block-start: 0;
                        // display:flex;
                        // flex-direction: column;
                        // gap: 14px;
                         > li{
                          margin-bottom: 14px !important;
                         }
                      }
                    }

                    .sidebar-menu-scroll > div:has(> .sidebar-bottom-actions),
                    .sidebar-menu-scroll .sidebar-bottom-actions {
                      margin-top: auto;
                    }

					> .sidebar-nav-title{
						margin-top: 8px;
					}

					.ant-menu-item,
					.ant-menu-submenu {
						.ant-menu-item-icon {
							color: ${({ theme }) => theme['gray-lightest-color']};
							font-size: 20px;
							width: 20px;
							height: 20px;
							min-width: 20px;
							line-height: 1;
							svg {
								width: 20px;
								height: 20px;
							}
						}
					}

					.ant-menu-item,
					.ant-menu-submenu-title {
						border-radius: 6px;

            &:hover {
              background-color: ${({ theme }) => theme['gray200']};
            }

            &:active {
              background-color: ${({ theme }) => theme['primary-light']};
            }
					}

					.ant-menu {
						overflow-x: hidden;
						border-inline-end: 0;

						/* Keep first menu column aligned with logo row (no extra ul horizontal padding) */
						&.ant-menu-inline:not(.ant-menu-inline-collapsed):not(.sidebar-menu--mobile) {
							padding-inline: 0;
						}

						/* 8px vertical gap between all sidebar menu rows (antd uses marginBlock; override for consistent spacing) */
						.ant-menu-item,
						.ant-menu-submenu-title {
							margin-block: 0 !important;
						}

						&.ant-menu-inline > .ant-menu-item:not(:last-child),
						&.ant-menu-inline > .ant-menu-submenu:not(:last-child) {
							margin-block-end: 0px;
						}

						.ant-menu-submenu-open.ant-menu-submenu-inline > .ant-menu-sub.ant-menu-inline {
							margin-block-start: 8px;
							padding-block: 0;
						}

						.ant-menu-sub.ant-menu-inline > .ant-menu-item:not(:last-child),
						.ant-menu-sub.ant-menu-inline > .ant-menu-submenu:not(:last-child) {
							margin-block-end: 8px;
						}

						.ant-menu-item,
						.ant-menu-submenu {
							.anticon,
							.ant-menu-item-icon {
								color: ${({ theme }) => theme['gray700']};
								font-size: 20px;
								width: 20px;
								height: 20px;
								min-width: 20px;
								line-height: 1;
								svg {
									width: 20px;
									height: 20px;
								}
							}

							.anticon {
								display: flex;
								align-items: center;
								justify-content: center;
								flex: none;
							}

							.ant-badge .anticon {
								font-size: 20px;
								width: 20px;
								height: 20px;
								min-width: 20px;
								svg {
									width: 20px;
									height: 20px;
								}
							}
						}

						.ant-menu-sub.ant-menu-inline{
							background-color: #fff;
						}

						&.ant-menu-inline-collapsed > .ant-menu-item,
						&.ant-menu-inline-collapsed > .ant-menu-submenu > .ant-menu-submenu-title {
							display: flex;
							align-items: center;
							margin-inline: auto;
							padding-inline: ${({ theme }) => (theme.rtl ? '14px' : '10px')};
							text-align: center;
							width: 70%;

							.ant-menu-item-icon,
							.anticon {
								font-size: 20px !important;
								width: 20px;
								height: 20px;
								min-width: 20px;
								svg {
									width: 20px;
									height: 20px;
								}
							}
						}



						/* Expanded: align first-column icons with .sidebar-overview-icon (same inset); !important beats antd padding-inline */
						&.ant-menu-inline:not(.ant-menu-inline-collapsed) > .ant-menu-item,
						&.ant-menu-inline:not(.ant-menu-inline-collapsed) > .ant-menu-submenu > .ant-menu-submenu-title {
							margin-inline-start: 0;
							padding-inline-start: var(--sidebar-brand-inset) !important;
							width: 100%;
						}

            .ant-menu-submenu .ant-menu-item {
              margin-inline-start: 16px;

              a {
                color: #a3a3a3;
              }
            }

						.ant-menu-item-selected {
							&::after {
								content: none;
							}
						}

            .ant-menu-item,
            .ant-menu-submenu-title {
              color: ${({ theme }) => theme['gray700']};
              font-weight: 500;

              .ant-menu-title-content {
                color: inherit;
              }
            }

            .ant-menu-item-selected,
            .ant-menu-submenu-selected > .ant-menu-submenu-title {
              background-color: ${({ theme }) => theme['primary-light-4']};
              font-weight: 600;
              color: ${({ theme }) => theme['primary-color']};

              .ant-menu-item-icon {
                color: ${({ theme }) => theme['primary-color']};
              }
            }

            .ant-menu-submenu-selected .ant-menu-item-selected {
              background-color: transparent;
              font-weight: 600;

              a {
                color: ${({ theme }) => theme['primary-color']};
              }
            }

            /* Reports: gray panel inset left/right (Figma); rows stay on same padding/margins as other submenus */
            .ant-menu-submenu.ant-menu-submenu-inline.ant-menu-submenu-open:has(.reports-submenu-child)
              > .ant-menu-sub.ant-menu-inline {
              width: auto;
              margin-inline: 0px;
              box-sizing: border-box;
              background-color: ${({ theme }) => theme['gray200']};
              border-radius: 6px;
            }

            .ant-menu-submenu-open:has(.reports-submenu-child) .reports-submenu-child {
              background-color: transparent;
              border-radius: 0;
              margin-block: 0;
              --sidebar-brand-inset: 34px;
            }

            .ant-menu-submenu-open:has(.reports-submenu-child) .reports-submenu-child.ant-menu-item-selected {
              background-color: ${({ theme }) => theme['primary-light-4']};
              border-radius: 0;
              margin-block: 0;
              --sidebar-brand-inset: 34px;
            }
					}
        }

        .sidebar-nav-title{
            font-size: 12px;
            font-weight: 500;
            text-transform: uppercase;
            ${({ darkMode }) => (darkMode ? `color: rgba(255, 255, 255, .38);` : 'color: #9299B8;')};
            padding: 0 ${({ theme }) => (theme.rtl ? '20px' : '15px')};
            display: flex;
        }
        &.ant-layout-sider-collapsed{
            padding-inline: 0;
            .sidebar-nav-title{
                display: none;
            }
            .ant-menu-item{
                color: #333;
                .badge{
                    display: none;
                }
            }
        }

        .sidebar-expand-btn{
            position: absolute;
            top: 45px;
            inset-inline-end: -12px;
            width: 32px;
            height: 32px;
            padding: 0;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background: #fff;
            border: 1px solid #e6e6e6;
            border-radius: 50%;
            box-shadow: none;
            cursor: pointer;
            color: #707070;
            opacity: 0;
            transform: scale(0.9);
            transition: opacity 0.2s ease, transform 0.2s ease, background 0.2s ease, color 0.2s ease;
            z-index: 10;

            svg{
                transform: rotate(180deg);
                transition: transform 0.2s ease;
            }

            &.rtl svg{
                transform: rotate(0deg);
            }

            &:hover{
                background: ${({ theme }) => theme['primary-color']};
                color: #fff;
                border-color: ${({ theme }) => theme['primary-color']};
            }

            &:hover svg path{
                stroke: #fff;
            }

            &:focus-visible{
                outline: 2px solid ${({ theme }) => theme['primary-color']};
                outline-offset: 2px;
            }
        }

        .sidebar-collapse-btn{
            inset-inline-end: -28px;
            opacity: 1;
            transform: scale(1);

            svg{
                transform: rotate(0deg);
            }

            &.rtl svg{
                transform: rotate(180deg);
            }
        }

        .sidebar-overview-icon{
            display: flex;
            align-items: center;
            justify-content: flex-start;
            padding-block: 8px 24px;
            padding-inline-start: var(--sidebar-brand-inset);
            padding-inline-end: 0;
            flex: none;
            overflow: hidden;
            white-space: nowrap;
            max-width: 240px;
            transition: max-width 220ms ease;
        }
        .sidebar-overview-icon > svg{
            flex: none;
        }
        &.ant-layout-sider-collapsed .sidebar-overview-icon{
            max-width: 52px;
        }

        &:hover .sidebar-expand-btn,
        .sidebar-expand-btn:hover,
        .sidebar-expand-btn:focus-visible{
            opacity: 1;
            transform: scale(1);
        }

        /* —— Mobile drawer (≤991px): gutters, full-width Bayut row, chevron aligned to pill band —— */
        @media (max-width: 991px) {
            /* Drawer wide enough for 246px Bayut CTA (Ant Sider inline width is 240px otherwise) */
            &:not(.ant-layout-sider-collapsed) {
                flex: 0 0 270px !important;
                max-width: 270px !important;
                min-width: 270px !important;
                width: 270px !important;
                padding-top: 0px !important;
            }

            &:not(.ant-layout-sider-collapsed) .sidebar-overview-icon {
                max-width: none;
                padding-block: 16px 12px;
                padding-inline: var(--sidebar-brand-inset);
                box-sizing: border-box;
            }

            &:not(.ant-layout-sider-collapsed) .sidebar-mobile-classified-wrap {
                display: flex;
                justify-content: center;
                width: 100%;
                box-sizing: border-box;
                padding: 0 0 24px;
            }

            &:not(.ant-layout-sider-collapsed) .sidebar-mobile-classified-wrap a {
                box-sizing: border-box;
                width: 246px;
                min-width: 246px;
                max-width: none;
            }

            /* Menu: no extra ul padding — row inset matches logo row (16px), same as .sidebar-overview-icon */
            &:not(.ant-layout-sider-collapsed) .sidebar-menu-scroll .sidebar-menu--mobile.ant-menu.ant-menu-inline {
                padding-inline: 0;
                box-sizing: border-box;
            }

            &:not(.ant-layout-sider-collapsed)
                .sidebar-menu-scroll
                .sidebar-menu--mobile.ant-menu-inline:not(.ant-menu-inline-collapsed)
                > .ant-menu-item {
                margin-inline-start: 0;
                padding-inline-start: var(--sidebar-brand-inset) !important;
                padding-inline-end: 12px !important;
            }

            /* Submenu row (e.g. Reports): same icon–label spacing as web — use Ant defaults, not flex+gap */
            &:not(.ant-layout-sider-collapsed)
                .sidebar-menu-scroll
                .sidebar-menu--mobile.ant-menu-inline:not(.ant-menu-inline-collapsed)
                > .ant-menu-submenu
                .ant-menu-submenu-title {
                margin-inline-start: 0;
                padding-inline-start: var(--sidebar-brand-inset) !important;
                padding-inline-end: 44px !important;
            }

            &:not(.ant-layout-sider-collapsed)
                .sidebar-menu-scroll
                .sidebar-menu--mobile
                .ant-menu-submenu
                .ant-menu-item {
                margin-inline-start: 16px;
            }

            /* Chevron: ~half in / half out (32px control → −16px straddles drawer edge) */
            &:not(.ant-layout-sider-collapsed) .sidebar-expand-btn.sidebar-collapse-btn {
                top: 48px;
                inset-inline-end: -29px;
                opacity: 1;
                transform: scale(1);
                z-index: 20;
            }
        }
    }
    @media only screen and (max-width: 1150px){
        .ant-layout-sider.ant-layout-sider-collapsed{
            inset-inline-start: -80px !important;
        }

    }

    ${({ mobileSidebarOpen }) =>
      mobileSidebarOpen
        ? `
      header, .atbd-main-layout {
        filter: blur(2px);
        transition: filter 220ms ease;
      }
    `
        : ''}

    .atbd-main-layout{
        margin-inline-start: ${({ theme }) => (theme.topMenu || theme.isMobile ? 'initial' : 'var(--sidebar-offset, 80px)')};
        margin-block-start: ${({ theme }) => (theme.topMenu ? 'initial' : 'var(--min-height-offset)')};
        min-height: calc(100dvh - var(--min-height-offset));
        transition: margin-inline-start 220ms ease;

        @media print {
          width: 100%;
          margin-inline-start: 0;
          margin-inline-end: 0;
        }
    }

    @media (prefers-reduced-motion: reduce) {
      .atbd-main-layout {
        transition: none;
      }
    }

    /* Mobile Actions */
    .mobile-action{
        position: absolute;
        inset-inline-end: 20px;
        top: 50%;
        transform: translateY(-50%);
        display: inline-flex;
        align-items: center;
        @media only screen and (max-width: 767px){
            inset-inline-end: 0;
        }
        a{
            display: inline-flex;
            color: ${({ theme }) => theme['light-color']};
            &.btn-search{
                margin-inline-end: 18px;
            }
            svg{
                width: 20px;
                height: 20px;
            }
        }
    }
    .admin-footer{
        @media print {
            display: none;
        }
        .admin-footer__copyright{
            display: inline-block;
            width: 100%;
            color: ${({ theme }) => theme['light-color']};
            @media only screen and (max-width: 767px){
                text-align: center;
            }
        }
        .admin-footer__links{
            text-align: end;
            @media only screen and (max-width: 767px){
                text-align: center;
            }
            a{
                color: ${({ theme }) => theme['light-color']};
                &:not(:last-child){
                    margin-inline-end: 15px;
                }
                &:hover{
                    color: ${({ theme }) => theme['primary-color']};
                }
            }
        }
    }
`;

export { Div };
