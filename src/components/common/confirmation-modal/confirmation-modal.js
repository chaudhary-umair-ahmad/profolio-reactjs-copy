import React, { forwardRef, useImperativeHandle, useState } from 'react';

import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ErrorMessage, Modal } from '..';
import { DrawerModal } from '..';
import { useRef } from 'react';

const ConfirmationModal = forwardRef((props, ref) => {
  const { t } = useTranslation();
  const {
    title,
    onSuccess,
    children,
    onCancel = () => {},
    type,
    visible,
    okText,
    footer,
    footerError,
    ...rest
  } = props;
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const drawerRef = useRef();

  useImperativeHandle(ref, () => ({
    showModal() {
      setShowModal(true);
    },
    hideModal() {
      setShowModal(false);
    },
    getModalVisiblity() {
      return showModal;
    },
    setLoading,
    setError,
  }));

  const handleOk = () => {
    onSuccess();
  };

  const handleCancel = () => {
    onCancel();
    setShowModal(false);
  };

  return (
    <DrawerModal
      ref={drawerRef}
      title={t(title)}
      visible={visible || showModal}
      okText={okText}
      onOk={handleOk}
      onCancel={handleCancel}
      loading={loading}
      footer={footer}
      {...rest}
    >
      {children}
      <ErrorMessage message={error} asAlert />
      <ErrorMessage message={footerError} asAlert />
    </DrawerModal>
  );
});

ConfirmationModal.propTypes = {
  title: PropTypes.string,
  onSuccess: PropTypes.func,
  children: PropTypes.node,
  onCancel: PropTypes.func,
  type: PropTypes.string,
  okText: PropTypes.string,
};

export default ConfirmationModal;
