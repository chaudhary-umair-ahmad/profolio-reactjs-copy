import { Typography } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';
import { DrawerModal, Modal } from '../common';
import SuccessModalContent from './successModalContent';
const { Text } = Typography;

const SuccessModal = ({ visible, handleCancel = () => {}, hideCloseIcon, width = 510,  ...rest }) => {
  return (
    <DrawerModal
      type="primary"
      visible={visible}
      okButtonProps={{ type: 'primary' }}
      onCancel={handleCancel}
      width={width}
      footer={null}
      hideCloseIcon={hideCloseIcon}
    >
      <SuccessModalContent {...rest} />
    </DrawerModal>
  );
};

export default SuccessModal;
