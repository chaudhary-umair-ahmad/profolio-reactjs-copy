import React from 'react';
import tenantConstants from '@constants';
import { useTranslation } from 'react-i18next';
import { Divider } from 'antd';
import Flex from '../../../../components/common/flex';
import Image from '../../../../components/common/image/image';
import { Modal } from '../../../../components/common/modals/antd-modals';
import { BayutAppStoreArabicIcon, BayutPlayStoreArabicIcon } from '../../../../components/svg';
import { BayutAppStoreIcon, PlayStoreBadgeIcon } from '../../../../components/utilities/icons';
import { downloadAppActionEvent } from '../../../../services/analyticsService';
import { useSelector } from 'react-redux';
import AppLink from '../layout/app-link';

const DownloadAppModal = ({ visible, onClose }) => {
  const { t } = useTranslation();
  const locale = useSelector((state) => state.app.AppConfig.locale);
  const { user } = useSelector((state) => state.app.loginUser);

  return (
    <Modal
      width={360}
      title={<span className="fw-600 fs20">{t(`Get the ${tenantConstants.TITLE} App`)}</span>}
      visible={visible}
      onCancel={onClose}
      footer={null}
    >
      <div>
        <Flex vertical align="center" gap="8px">
          <div className="fz-16 fw-600">{t('Scan the QR code to download the app')}</div>
          <Image
            width={166}
            src={tenantConstants?.APP_LOGO?.qrCodeSrc}
            size={166}
            preview={false}
            onClick={() => downloadAppActionEvent(user, 'qr_code')}
          />
        </Flex>

        <Divider type="horizontal">{t('OR')}</Divider>

        <Flex className="badges" align="center" justify="center" gap="10px">
          <AppLink
            link={tenantConstants?.APP_LOGO?.linkIos?.[locale]}
            IconEn={BayutAppStoreIcon}
            IconAr={BayutAppStoreArabicIcon}
            height="33"
            locale={locale}
            onClick={() => downloadAppActionEvent(user, 'app_store')}
            target="_blank"
            rel="noreferrer"
          />
          <AppLink
            link={tenantConstants?.APP_LOGO?.linkPlayStore?.[locale]}
            IconEn={PlayStoreBadgeIcon}
            IconAr={BayutPlayStoreArabicIcon}
            height="34.8"
            locale={locale}
            onClick={() => downloadAppActionEvent(user, 'play_store')}
            target="_blank"
            rel="noreferrer"
          />
        </Flex>
      </div>
    </Modal>
  );
};

export default DownloadAppModal;
