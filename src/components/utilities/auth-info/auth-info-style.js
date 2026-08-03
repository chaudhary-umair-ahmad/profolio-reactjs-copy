import React from 'react';
import Styled from 'styled-components';
import { Link } from 'react-router-dom';

const InfoWraper = Styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 16px;
    /* padding: 16px 0; */

    .head-example {
        text-decoration: none;
        color: ${({ theme }) => theme['text-color-secondary']};
        box-shadow: none;
        padding-inline: 0px 8px;
        ${({ darkMode }) => (darkMode ? `color: #A8AAB3;` : '')};
    }

    .name-avatar {
        display: flex;
        height: auto;
        align-items: center;
        padding: 0 !important;
    }

    .user-data {
        display: flex;
        align-items: center;
        gap: 4px;
    }

    .message {
        margin-inline-start: 0;
        .head-example {
            margin: 0;
            padding: 0;
        }
        .ant-badge-dot{
            background: green

        }
    }
    .ant-badge{
        .ant-badge-dot{
          inset-inline-end: 50% !important;
        }
    }
    .flag-select{
        padding-bottom: 0;
        .flag-select__option{
            margin: 0;
            img{
                top: 0;
            }
        }
        .flag-select__btn{
            line-height: 0;
            padding-inline-end: 0;
            cursor: pointer;
        }
        .flag-select__btn:after{
            content: none;
        }
        .flag-select__options{
            width: 120px;
            padding-top: 0;
            margin: 0;
            right: 0;
            top: 30px;
            display: block;
            .flag-select__option{
                line-height: normal;
                display: block;
                padding: 5px 10px;
                span{
                    width: auto !important;
                    height: auto !important;
                    display: block;
                }
            }
        }
    }
    .message, .notification, .settings, .support, .flag-select, .nav-author{
        display: flex;
        > span, a{
            display: block;
            line-height: normal;
            margin: 0 3px;
        }
    }
    .nav-author{
        a.ant-dropdown-trigger{
            img{
                max-width: 20px;
            }
        }
    }

    .flag-select {
        ul{
            width: 170px !important;
            padding: 12px 0;
            background: #fff;
            border: 0 none;
            box-shadow: 0 5px 30px ${({ theme }) => theme['gray-solid']}15;
            li{
                &:first-child{
                    margin-top: 12px;
                }
                &:hover{
                    background: ${({ theme }) => theme['primary-color']}05;
                }
                span{
                    display: flex !important;
                    align-items: center;
                    padding: 2px 10px;
                    img{
                        border-radius: 50%;
                    }
                    span{
                        font-weight: 500;
                        color: ${({ theme }) => theme['gray-color']};
                        padding: 0;
                        margin-inline-start: 10px;
                    }
                }
            }
        }
    }
`;

const SettingDropdwon = Styled.div`
    .setting-dropdwon{
        max-width: 700px;
        padding: 4px 0;
        .setting-dropdwon__single{
            align-items: flex-start;
            padding: 16px 20px;
            margin-bottom: 0;
            position: relative;
            &:after{
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                box-shadow: 0 5px 20px ${({ theme }) => theme['gray-solid']}15;
                z-index: 1;
                content: '';
                opacity: 0;
                visibility: hidden;
            }
            &:hover{
                &:after{
                    opacity: 1;
                    visibility: visible;
                }
            }
            h1{
                font-size: 15px;
                font-weight: 500;
                margin: -4px 0 2px;
            }
            p{
                margin-bottom: 0;
                color: ${({ theme }) => theme['gray-solid']};
            }
            img{
                margin-inline-end: 16px;
                transform: ${({ theme }) => (theme.rtl ? 'rotatey(180deg)' : 'rotatey(0deg)')};
            }
            figcaption{
                text-align: start;
            }
        }
    }
`;

const NestedDropdwon = Styled.div`
    .support-dropdwon{
        padding: 10px 15px;
        text-align: start;
        ul{
            &:not(:last-child){
                margin-bottom: 16px;
            }
            h1{
                font-size: 14px;
                font-weight: 400;
                color: ${({ theme }) => theme['light-color']};
            }
            li{
                a{
                    font-weight: 500;
                    padding: 4px 16px;
                    color: ${({ theme }) => theme['dark-color']};
                    &:hover{
                        background: #fff;
                        color: ${({ theme }) => theme['primary-color']};
                    }
                }
            }
        }
    }
`;

const UserDropdown = Styled.div`
    .user-dropdwon {
        width: 300px;
        @media screen and (max-width: 768px) {              
          width: initial;
        }

        @media screen and (min-width: 992px) {              
          width: 400px;
        }

        // .user-dropdwon__info{
        //     display: flex;
        //     align-items: center;
        //     padding: 19px 16px;
        //     border-radius: 8px;
        //     margin-bottom: 12px;
        //     background: ${({ theme }) => theme['bg-color-normal']};
        //     img{
        //         margin-inline-end: 15px;
        //         width: 40px;
        //         height: 40px;
        //         border-radius: 50%;
        //     }
        //     figcaption {
        //         overflow: hidden;

        //         h5 {
        //             font-size: 14px;
        //             margin-bottom: 0px !important;
        //             color:  ${({ theme }) => theme['dark-color']};
        //         }
        //         p {
        //             margin-bottom: 0px;
        //             font-size: 13px;
        //             color: ${({ theme }) => theme['gray-solid']};
        //             text-overflow: ellipsis;
        //             overflow: hidden;
        //         }
        //     }
        // }

        .user-info {
            // background-color: #f7f8fa;
            padding-inline: 16px;
            padding-block: 12px 0px;

            .user-meta-column {
                min-width: 0;
                overflow: hidden;
            }

            .account-type-email-line {
                display: flex;
                align-items: center;
                gap: 4px;
                min-width: 0;
                flex-wrap: nowrap;
            }

            .account-email-part {
                min-width: 0;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .shrink-0 {
                flex-shrink: 0;
            }
        }

        .dropdwon-links {
            > li {
             
                    border-top: 1px solid ${({ theme }) => theme['gray400']};
                
            }

            a {
                // width: calc(100% + 30px);
                // left: -15px;
                // right: -15px;
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 12px 4px;
                font-weight: 600;
                font-size: 16px;

                  @media screen and (max-width: 992px) {     
                   
                     padding: 12px 12px;
                     font-size: 14px;
                   }
                // font-size: 14px;
                // transition: .3s;
                color: ${({ theme }) => theme['text-color-secondary']};
                &:hover{
                    background: ${({ theme }) => theme['primary-color']}05;
                    color: ${({ theme }) => theme['primary-color']};
                    // padding-inline-start: 22px;
                }
                svg {
                   font-size: 14px;
                //     transform: ${({ theme }) => (theme.rtl ? 'rotateY(180deg)' : 'rotateY(0deg)')};
                //     margin-inline-end: 14px;
                }

            }
            
        }
        // .user-dropdwon__bottomAction{
        //     display: inline-flex;
        //     align-items: center;
        //     justify-content: center;
        //     font-size: 14px;
        //     font-weight: 500;
        //     text-align: center;
        //     position: relative;
        //     width: calc(100% + 30px);
        //     left: -15px;
        //     right: -15px;
        //     height: calc(100% + 15px);
        //     bottom: -15px;
        //     border-radius: 0 0 6px 6px;
        //     padding: 15px 0;
        //     background: ${({ theme }) => theme['bg-color-light']};
        //     color: ${({ theme }) => theme['error-color']};
        //     svg{
        //         width: 24px;
        //         height: 24px;
        //         margin-inline-end: 8px;
        //     }
        // }
    }
`;

const AtbdTopDropdwon = Styled.div``;

const NavAuth = Styled.span`
    i, svg, img {
        margin-inline-end: 8px;
    }
`;

export const LinkStyle = Styled((props) => <Link {...props} />)`
  a& {
    color: ${({ theme }) => theme['success-color']} !important;
    display: inline-flex;
    padding: 0;
    gap: 6px;
    > span {
        padding-inline-start: 0;
    }
    &:hover {
        background: none;
    }
  }
`;

export { InfoWraper, SettingDropdwon, NestedDropdwon, UserDropdown, AtbdTopDropdwon, NavAuth };
