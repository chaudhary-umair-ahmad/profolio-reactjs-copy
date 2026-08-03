import tenantConstants from '@constants';
import tenantUtils from '@utils';
import { Typography } from 'antd';
import { t } from 'i18next';
import React from 'react';
import QRCode from 'react-qr-code';
import { useSelector } from 'react-redux';
import { DrawerModal, Flex, Group, LinkWithIcon } from '../../../../components/common';
import { formatNumberString, isHttpUrl } from '../../../../utility/utility';
import RegaDetailFields from './RegaDetailFields';

const ListingDetailModal = ({ setModalVisible, visible, listing }) => {
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);

  const RenderHeading = () => {
    return (
      <Group template="1fr auto" gap={'0px'}>
        <Group template="initial" gap={'0px'}>
          <Typography.Text className="color-gray-dark fs12 mb-8">
            {t('Ad License:')}{' '}
            <span className="color-primary">{listing?.rega_details?.license_info?.ad_license_number}</span>
          </Typography.Text>
          <strong className="fs14">
            {tenantUtils.getLocalisedString(listing?.rega_details?.property_specs, 'listing_type')}{' '}
            {tenantUtils.getLocalisedString(listing?.rega_details?.property_specs, 'advertisement_type')}
          </strong>
          <Typography.Text className="color-primary">
            {tenantConstants.CURRENCY_SYMBOL()}{' '}
            <span className="fw-700">{formatNumberString(listing?.price, { maximumFractionDigits: 0 })}</span>
          </Typography.Text>
        </Group>
        <Group
          template="auto auto"
          gap="6px"
          style={{
            alignItems: 'end',
          }}
        >
          <Flex vertical align="start" gap="4px">
            {isHttpUrl(listing?.rega_details?.url) && (
              <a href={listing?.rega_details?.url} target="_blank" rel="noopener noreferrer" className="inline-flex">
                <QRCode size={46} value={listing?.rega_details?.url} viewBox={`0 0 256 256`} />
              </a>
            )}
            <div style={{ width: '85px' }}>
              <LinkWithIcon
                showIconBeforeText={false}
                as="a"
                linkTitle={'View Details on REGA'}
                href={isHttpUrl(listing?.rega_details?.url) ? listing?.rega_details?.url : undefined}
                target="_blank"
                rel="noopener noreferrer"
                className=" text-primary regaLink fz-12 fw-700"
                style={{ alignItems: 'flex-start' }}
              />
            </div>
          </Flex>
        </Group>
      </Group>
    );
  };
  const setFalse = () => {
    props.cancel(false);
  };

  //const [showModal, setShowModal] = useState(true);
  return (
    <>
      <DrawerModal
        visible={visible}
        onCancel={() => setModalVisible(false)}
        title={RenderHeading()}
        width="700px"
        bodyStyle={{
          maxHeight: 590,
          overflowY: 'scroll',
          paddingBottom: 8,
        }}
        footer={null}
        height={'600px'}
      >
        <RegaDetailFields listing={listing} />
      </DrawerModal>
    </>
  );
};

export default ListingDetailModal;
