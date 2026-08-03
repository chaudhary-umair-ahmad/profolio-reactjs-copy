import styled from 'styled-components';
import SuccessModal from '../success-modal/success-modal';
import SuccessModalContent from '../success-modal/successModalContent';

export const TrueCheckModal = styled(SuccessModalContent)`
  &.statuses {
    position: relative;

    .ant-image {
      margin-bottom: 22px;
    }

    .status-icon {
      position: absolute;
      right: 25%;
      top: 30%;
      transform: translateY(-50%);

      @media only screen and (max-width: 400px) {
        right: 6%;
        top: 28%;
      }
      @media only screen and (min-width: 400px) and (max-width: 768px) {
        right: 12%;
      }
    }
  }
`;
