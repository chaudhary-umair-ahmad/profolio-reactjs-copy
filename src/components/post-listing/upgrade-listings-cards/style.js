import Styled from 'styled-components';
import { getBaseURL } from '../../../utility/env';

// import { Card } from '../../../components/common';

const UpgradeFree = Styled.div`

  --bg-img: url(${getBaseURL()}/profolio-assets/images/Building-Image@2x.png);
  background: var(--bg-img) no-repeat right bottom;

  border: 1px solid ${({ theme }) => theme['border-color-normal']};
  border-radius: 6px;

  padding: 24px;
  
  @media only screen and (max-width: 767px){
    padding: 16px 16px 140px;
    background-size: auto 130px !important;
    background-position: bottom center;
  }

  h3 {
    font-size: 1.25rem;
  }

  .textIcon {
    flex-wrap: nowrap;
    align-items: start;

    > div > span {

      font-weight: 400;
    }
  }

  .or {
    padding-inline: 1.125rem;
  }

  .btnArea {
    @media only screen and (max-width: 767px){
      text-align: center;
      > * {
        display: block;
        margin-block: 8px;
      }
    }
  }


`;

export { UpgradeFree };
