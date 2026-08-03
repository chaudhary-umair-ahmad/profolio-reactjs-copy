import React, { useEffect, useRef } from 'react';
import { Modal } from '../modals/antd-modals';
import Icon from '../icon/icon';
import Flex from '../flex';
import cx from 'clsx';
import { useSelector } from 'react-redux';
import { Drawer } from '../drawer/drawer';
import { Button } from '../button/button';
import { useTranslation } from 'react-i18next';

const LiteNoDataModalUi = ({ visible, onCancel, icon, title, subtitle }) => {
  const { isMobile } = useSelector((state) => state.app.AppConfig);
  const noDataRef = useRef();
  const { t } = useTranslation();

  useEffect(() => {
    if (isMobile && !!visible) noDataRef?.current && noDataRef?.current?.openDrawer();
  }, [visible, isMobile]);

  return isMobile ? (
    <Drawer
      placement={'bottom'}
      ref={noDataRef}
      onCloseDrawer={onCancel}
      height="45vh"
      bodyStyle={{ padding: 20 }}
      headerStyle={{ '--ant-padding': '20px 20px', '--ant-line-width': 0, paddingBottom: 0 }}
      style={{ '--ant-line-width': 0, borderTopLeftRadius: '28px', borderTopRightRadius: '28px' }}
      footer={
        <Button
          block
          type="primaryOutlined"
          onClick={() => {
            noDataRef?.current && noDataRef?.current?.closeDrawer(false);
          }}
          // borderWidth={0}
          style={{ '--btn-bg-color': '#e5eff0', fontSize: '14px', '--btn-border-color': 'transparent' }}
        >
          {t('Close')}
        </Button>
      }
    >
      <Flex
        vertical
        align="center"
        gap="16px"
        className="text-center"
        style={{ paddingBlockStart: '16px', width: '270px', margin: 'auto' }}
      >
        {icon && <Icon size="48px" icon={icon} className="mb-8" />}
        {title && (
          <p className="fw-700 fz-20 mb-0" style={{ lineHeight: '30px', maxWidth: '172px' }}>
            {title}
          </p>
        )}
        {subtitle && (
          <p className={cx('color-gray-dark fz-16 mb-0')} style={{ lineHeight: '24px' }}>
            {subtitle}
          </p>
        )}
      </Flex>
    </Drawer>
  ) : (
    <Modal
      visible={visible}
      style={{ overlay: { zIndex: 1000 }, '--ant-color-icon': '#222', '--ant-font-size-lg': '18px' }}
      footer={null}
      className="favouritePropertiesModal"
      onCancel={onCancel}
      width={322}
    >
      <Flex vertical align="center" gap="16px" className="text-center" style={{ paddingBlockStart: '16px' }}>
        {icon && <Icon size="48px" icon={icon} className="mb-8" />}
        {title && (
          <p className="fw-700 fz-20 mb-0" style={{ lineHeight: '30px' }}>
            {title}
          </p>
        )}
        {subtitle && (
          <p className={cx('text-muted fz-16')} style={{ lineHeight: '24px' }}>
            {subtitle}
          </p>
        )}
      </Flex>
    </Modal>
  );
};

export default LiteNoDataModalUi;
