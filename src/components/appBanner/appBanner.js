import tenantConstants from '@constants';
import tenantUtils from '@utils';
import tenantTheme from '@theme';

import { Typography } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { LinkWithIcon } from '../common';
import { Button } from '../common/button/button';
import Flex from '../common/flex';
import Icon from '../common/icon/icon';
import Rate from '../common/rate/rate';
import { isAndroid } from '../../utility/general';
const { Title, Text } = Typography;

const AppBanner = (props) => {
  const { style, handleClose } = props;
  const IS_ANDROID = isAndroid();
  const { t } = useTranslation();
  const { locale, rtl } = useSelector((state) => state.app.AppConfig);
  const link = IS_ANDROID ? tenantConstants.APP_LOGO.linkPlayStore : tenantConstants.APP_LOGO.linkIos;

  return (
    <Flex
      justify="space-between"
      align="center"
      className="p-8"
      style={{ lineHeight: 1.3, backgroundColor: '#fff', ...style }}
    >
      <Icon size="20px" icon="IoMdClose" onClick={handleClose} style={{ marginInlineEnd: '8px' }} />
      <LinkWithIcon
        as="a"
        href={tenantUtils.getLocalisedString({ link }, 'link')}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: 'none', gap: '10px', width: '100%' }}
        linkTitle={
          <Flex justify="space-between" className="w-100" align="center">
            <div>
              <Title level={5} className="fz-16 mb-4" style={{ fontWeight: '700' }}>
                {t(tenantConstants.APP_LOGO.title)}
              </Title>
              <Text className="fz-10 color-gray-dark">{t('1 Million + Installs')}</Text>
              <Rate disabled allowHalf value={4.5} />
            </div>
            <Button href={link[locale]} type="success" className="px-24" style={{ '--btn-bg-color': '#28b16d' }}>
              {t('Install')}
            </Button>
          </Flex>
        }
        icon={<Icon icon={rtl ? tenantConstants.APP_LOGO.icon.rtl : tenantConstants.APP_LOGO.icon.ltr} size="50px" />}
      />
    </Flex>
  );
};

AppBanner.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  href: PropTypes.string,
  setVisible: PropTypes.func.isRequired,
};

export default AppBanner;
