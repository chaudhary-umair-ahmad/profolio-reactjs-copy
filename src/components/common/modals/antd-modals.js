import PropTypes, { object } from 'prop-types';

import React from 'react';
import { Button } from '../button/button';
import Icon from '../icon/icon';
import { ModalStyled } from './styled';
import { useTranslation } from 'react-i18next';

const Modal = (props) => {
  const {
    onCancel,
    className,
    onOk,
    visible,
    title,
    type = 'primary',
    color,
    footer,
    width = 620,
    children,
    okText,
    cancelText,
    loading,
    bodyStyle,
    hideCloseIcon = false,
    closeIcon,
    okButtonProps,
    ...rest
  } = props;
  const { t } = useTranslation();

  return (
    <ModalStyled
      title={title}
      open={visible}
      okText={okText ?? t('Confirm')}
      cancelText={cancelText}
      onOk={onOk}
      onCancel={onCancel}
      type={color ? type : false}
      width={width}
      className={className}
      centered
      closeIcon={hideCloseIcon ? null : closeIcon ? closeIcon : <Icon icon="IoMdClose" />}
      styles={{
        body: bodyStyle,
      }}
      footer={
        footer || footer === null
          ? footer
          : [
              <Button type="default" key="back" onClick={onCancel}>
                {t('Cancel')}
              </Button>,
              <Button type={type} key="submit" onClick={onOk} loading={loading} disabled={loading} {...okButtonProps}>
                {okText ? t(okText) : t('Confirm')}
              </Button>,
            ]
      }
      {...rest}
    >
      {children}
    </ModalStyled>
  );
};

Modal.propTypes = {
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
  visible: PropTypes.bool,
  title: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  okText: PropTypes.string,
  cancelText: PropTypes.string,
  className: PropTypes.string,
  type: PropTypes.string,
  footer: PropTypes.oneOfType([PropTypes.arrayOf(object), PropTypes.object]),
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  color: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.node]),
  okButtonProps: PropTypes.object,
};

const alertModal = ModalStyled;
export { Modal, alertModal };
