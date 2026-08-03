import React, { forwardRef, useImperativeHandle, useState } from 'react';

import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Button } from '../button/button';
import Icon from '../icon/icon';
import { DrawerStyle } from './style';
import { Row } from 'antd';

const Drawer = forwardRef((props, ref) => {
  const {
    width,
    height,
    title,
    placement,
    children,
    render,
    onOk,
    okText,
    childDrawer,
    childTitle,
    bodyStyle,
    onCancel,
    loading,
    footer,
    onCloseDrawer = () => {},
    stopPropagation,
    headerStyle,
    visible,
    ...rest
  } = props;

  const [state, setState] = useState({
    visible: false,
    placement: placement || 'right',
    childrenDrawer: false,
  });
  const { t } = useTranslation();

  useImperativeHandle(ref, () => ({
    openDrawer() {
      showDrawer();
    },
    closeDrawer() {
      onClose();
    },
    isOpen() {
      return state.visible;
    },
  }));

  const showDrawer = () => {
    setState({
      ...state,
      visible: true,
    });
  };

  const onClose = () => {
    onCloseDrawer();
    setState({
      ...state,
      visible: false,
    });
  };

  const onChange = (e) => {
    setState({
      ...state,
      placement: e.target.value,
    });
  };

  const showChildrenDrawer = () => {
    setState({
      ...state,
      childrenDrawer: true,
    });
  };

  const onChildrenDrawerClose = () => {
    setState({
      ...state,
      childrenDrawer: false,
    });
  };
  return (
    <>
      <DrawerStyle
        title={title}
        placement={state.placement}
        closable={false}
        onClose={onClose}
        open={state.visible}
        // style={{ position: !render ? 'fixed' : 'absolute' }}
        width={width}
        height={height}
        extra={
          <Icon
            icon="IoMdClose"
            onClick={(e) => {
              stopPropagation && e.stopPropagation();
              onClose();
            }}
          />
        }
        styles={{
          body: bodyStyle,
          header: headerStyle,
        }}
        footer={
          footer || footer === null ? (
            footer
          ) : (
            <Row justify="end" style={{ gap: '10px' }}>
              <Button type="default" key="back" onClick={onCancel}>
                {t('Cancel')}
              </Button>
              <Button type="primary" key="submit" onClick={onOk} loading={loading} disabled={loading}>
                {okText ? t(okText) : t('Confirm')}
              </Button>
            </Row>
          )
        }
        {...rest}
      >
        {!childDrawer ? (
          children
        ) : (
          <>
            <Button type="primary" onClick={showChildrenDrawer}>
              Two-level drawer
            </Button>

            <DrawerStyle
              title={childTitle}
              width={width}
              closable={false}
              onClose={onChildrenDrawerClose}
              visible={state.childrenDrawer}
            >
              {childDrawer}
            </DrawerStyle>
            {children}

            <div
              style={{
                position: 'absolute',
                bottom: 0,
                width: '100%',
                borderTop: '1px solid #e8e8e8',
                padding: '10px 16px',
                textAlign: 'right',
                left: 0,
                background: '#fff',
                borderRadius: '0 0 4px 4px',
              }}
            >
              <Button
                style={{
                  marginInlineEnd: 8,
                }}
                onClick={onClose}
              >
                {t('Cancel')}
              </Button>
              <Button onClick={onClose} type="primary">
                {t('Submit')}
              </Button>
            </div>
          </>
        )}
      </DrawerStyle>
    </>
  );
});

Drawer.defaultProps = {
  width: 320,
};

Drawer.propTypes = {
  title: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  placement: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.node, PropTypes.array]),
  customPlacement: PropTypes.bool,
  render: PropTypes.bool,
  childDrawer: PropTypes.object,
  childTitle: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  bodyStyle: PropTypes.object,
};

export { Drawer };
