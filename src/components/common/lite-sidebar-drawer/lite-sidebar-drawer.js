import React from 'react';
import { Drawer } from '../drawer/drawer';
import Icon from '../icon/icon';
import { getClassifiedBaseURL } from '../../../utility/env';
import { useSelector } from 'react-redux';

const LiteSidebarDrawer = ({ title, placement, options, sidebarDrawerRef, icon = null, onIconClick, ...iconProps }) => {
  const locale = useSelector((state) => state.app.AppConfig.locale);

  return (
    <Drawer
      title={title}
      placement={placement}
      className="saved-search"
      ref={sidebarDrawerRef}
      onCloseDrawer={() => {}}
      width="100vw"
      footer={null}
      bodyStyle={{ padding: 20, paddingTop: 0 }}
      headerStyle={{
        '--ant-padding': '20px 20px',
        '--ant-line-width': 0,
        paddingBottom: 10,
        '--ant-font-size-lg': '18px',
      }}
    >
      <div style={{ border: '1px solid #dedede', borderRadius: 4, height: '100%', padding: '12px' }}>
        {options?.length > 0 &&
          options?.map((item) => (
            <div
              className="flex"
              style={{ justifyContent: 'space-between', padding: '10px 10px', marginBottom: '16px' }}
              key={item?.id}
            >
              <a
                style={{ color: 'black', fontWeight: 700, width: '100%' }}
                href={`${getClassifiedBaseURL()}${locale === 'en' ? '/en' : ''}${item?.url}`}
              >
                {item?.name}
              </a>
              {icon && <Icon icon={icon} onClick={() => onIconClick(item)} {...iconProps} />}
            </div>
          ))}
      </div>
    </Drawer>
  );
};

export default LiteSidebarDrawer;
