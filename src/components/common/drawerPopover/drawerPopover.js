import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Popover } from '..';
import { BottomSheetDrawer } from './styled';
import cx from 'clsx';

const DrawerPopover = forwardRef(
  (
    {
      children,
      content,
      height = 'auto',
      footer,
      title,
      placement,
      visible,
      width,
      onCancel = () => {},
      action = 'hover',
      gradientBackground = false,
      className,
      style,
      ...rest
    },
    ref,
  ) => {
    const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
    const drawerRef = useRef();

    const onShowPopoverDrawer = () => {
      isMobile && drawerRef.current?.openDrawer();
    };
    const onHidePopoverDrawer = () => {
      isMobile && drawerRef.current?.closeDrawer();
      onCancel();
    };

    useImperativeHandle(ref, () => ({
      show: onShowPopoverDrawer,
      close: onHidePopoverDrawer,
    }));
    useImperativeHandle(ref, () => ({
      show: onShowPopoverDrawer,
      close: onHidePopoverDrawer,
    }));

    return isMobile ? (
      <>
        <div onClick={onShowPopoverDrawer}>{children}</div>
        <BottomSheetDrawer
          rootClassName="bottom-sheet"
          className={cx('drawer-container', className)}
          ref={drawerRef}
          footer={footer}
          title={title || null}
          onCloseDrawer={onCancel}
          onCancel={onCancel}
          visible={visible}
          placement={placement || 'bottom'}
          {...rest}
          gradientBackground={gradientBackground}
          height={height}
          style={{ ...style }}
        >
          {content}
        </BottomSheetDrawer>
      </>
    ) : (
      <Popover content={content} placement={placement} action={action || 'hover'} visible={visible} {...rest}>
        {children}
      </Popover>
    );
  },
);

export default DrawerPopover;
