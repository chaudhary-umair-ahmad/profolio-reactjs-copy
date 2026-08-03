import tenantTheme from '@theme';
import chroma from 'chroma-js';
import PhoneInput from 'react-phone-number-input';
import Styled from 'styled-components';

const PhoneInputStyle = Styled(({ isMobile, mobileList, ...rest }) => <PhoneInput {...rest} />)`
  --PhoneInputCountryFlag-height: 1.2em;
  --PhoneInputCountryFlag-borderColor: rgba(0,0,0,0.3);
  --PhoneInputCountryFlag-borderColor--focus: rgba(0,0,0,0.3);

  // .PhoneInputInput {
  //   width: 100%;
  // }

  .PhoneInputCountry:hover,
  .PhoneInputInput:hover {
    border-color: ${tenantTheme['primary-color']};
  }

  .PhoneInputInput:focus {
    outline:none;
    border-color: ${tenantTheme['primary-color']};
    box-shadow: 0 0 0 2px ${chroma(tenantTheme['primary-color']).alpha(0.2)};
  }

  @media screen and (max-width: 991px) {
    border: 1px solid ${({ theme }) => theme['border-color-normal']};
    padding: 7px 11px;
    border-radius: 6px;
    > * {
      border: none;
    }
  }

  @media screen and (min-width: 992px) {
    > * {
      border: 1px solid ${({ theme }) => theme['dash-color']};
      padding: 11px 16px;
      border-radius: 6px;
    }
  }

  .PhoneInputCountryIcon {
    border-radius: 2px;
    overflow: hidden;
  }

  &.rtlPhone {
    .PhoneInputInput {
      text-align: end;
    }
    .PhoneInputCountrySelectArrow {
      margin-inline-start: 10px;
      margin-inline-end: 0;
    }
  }

  .PhoneInputCountrySelect[disabled] {
    opacity: 0;
  }

  &.PhoneInput--disabled {
    @media screen and (max-width: 991px) {
      background: #f5f5f5;
    }

    .PhoneInputInput[disabled] {
      opacity: 1;  
    }
    .PhoneInputCountryIcon {
      opacity: .4;  
    }
    .PhoneInputInput[disabled],
    .PhoneInputCountry {
      color: rgba(0, 0, 0, 0.25);
      background: #f5f5f5;
      border-color: ${({ theme }) => theme['border-color-normal']};
    }
  }

`;

export { PhoneInputStyle };
