import cx from 'clsx';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Modal } from '..';
import { BottomSheetDrawer } from '../drawerPopover/styled';

const DrawerModal = forwardRef(
  ({ children, title, height = 'auto', placement, visible, width, className, onCancel = () => {}, ...rest }, ref) => {
    const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
    const drawerRef = useRef();

    const onShowModalDrawer = () => {
      isMobile && drawerRef.current?.openDrawer();
    };

    const onHideModalDrawer = () => {
      isMobile && drawerRef.current?.closeDrawer();
      onCancel();
    };

    useImperativeHandle(ref, () => ({
      show: onShowModalDrawer,
      close: onHideModalDrawer,
    }));

    return isMobile ? (
      <BottomSheetDrawer
        rootClassName="bottom-sheet"
        ref={drawerRef}
        title={title || ' '}
        placement={placement || 'bottom'}
        onCloseDrawer={onCancel}
        onCancel={onCancel}
        open={visible}
        className={cx('drawer-container', className)}
        height={height}
        {...rest}
      >
        {children}
      </BottomSheetDrawer>
    ) : (
      <Modal className={className} width={width} title={title} visible={visible} onCancel={onHideModalDrawer} {...rest}>
        {children}
      </Modal>
    );
  },
);

export default DrawerModal;
