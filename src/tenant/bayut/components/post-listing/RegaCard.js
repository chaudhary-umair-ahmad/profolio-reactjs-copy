import tenantTheme from '@theme';
import tenantUtils from '@utils';
import tenantConstants from '@constants';
import { Collapse, Space, Typography } from 'antd';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import QRCode from 'react-qr-code';
import { useSelector } from 'react-redux';
import { Button, Card, Flex, Group, LinkWithIcon, TextWithIcon } from '../../../../components/common';
import { regaInformationClickEvent, regaQRCodeClickEvent } from '../../../../services/analyticsService';
import { formatNumberString, hasRegaDetailsContent, isHttpUrl } from '../../../../utility/utility';
import ListingDetailModal from './listingDetailModal';
import RegaDetailFields from './RegaDetailFields';
import { RegaCardStyle } from '../../../common/components/post-listing/styled';

const RegaCard = ({ listing }) => {
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const { Panel } = Collapse;
  const { user } = useSelector((state) => state.app.loginUser);

  const regaLoacation = useMemo(
    () =>
      [
        listing?.rega_details?.location?.district,
        listing?.rega_details?.location?.city,
        listing?.rega_details?.location?.region,
      ]
        .filter((e) => !!e)
        .join(', '),
    [listing?.rega_details?.location],
  );

  if (!hasRegaDetailsContent(listing?.rega_details)) return null;

  const regaMobile = () => {
    return (
      <Card className="rega-card-container">
        <Group template={'initial'} className="justify-content-between" style={{ alignItems: 'start' }} gap="0">
          <Group template="initial" gap="16px" className="mb-16">
            <Group gap="8px" template="1fr auto" className="align-items-center">
              <div className="fs12">
                <div className="fw-700 text-muted mb-4">{t('REGA Details')}</div>
                <div className="fw-600">
                  {tenantUtils.getLocalisedString(listing?.rega_details?.property_specs, 'listing_type')}{' '}
                  {tenantUtils.getLocalisedString(listing?.rega_details?.property_specs, 'advertisement_type')}
                </div>
                <Space size={8}>
                  <span className="color-gray-dark">{t('Ad License:')}</span>
                  {listing?.rega_details?.license_info?.ad_license_number}
                </Space>
              </div>

              <Typography.Paragraph className="color-primary fs16 mb-0">
                {tenantConstants.CURRENCY_SYMBOL()}
                <span className="fw-700" style={{ paddingInlineStart: 4 }}>
                  {formatNumberString(listing?.rega_details?.property_specs?.price, { maximumFractionDigits: 0 })}
                </span>
              </Typography.Paragraph>
            </Group>

            <Group gap="4px">
              <TextWithIcon
                icon="FaMapMarkerAlt"
                iconProps={{ color: tenantTheme['primary-color'], size: 16 }}
                textColor={tenantTheme['base-color']}
                title={`${regaLoacation}`}
              />

              <TextWithIcon
                icon="PiStackSimpleFill"
                iconProps={{ color: tenantTheme['primary-color'], size: 16 }}
                textColor={tenantTheme['base-color']}
                title={`${listing?.rega_details?.property_specs?.area_size} ${t('Sq. M.')}`}
              />
            </Group>
          </Group>

          <div>
            <Button
              type="primary"
              size="small"
              // style={{
              //   '--btn-bg-color': theme['primary-light-2'],
              //   '--btn-content-color': theme['primary-color'],
              //   border: 0,
              // }}
              onClick={() => {
                setModalVisible(true);
                regaInformationClickEvent(user);
              }}
            >
              {t('View Details')}
            </Button>
          </div>
        </Group>
      </Card>
    );
  };

  const regaDesktop = () => {
    return (
      <>
        <Collapse className="arrowIcon" collapsible={'icon'} ghost expandIconPosition="bottom">
          <Panel
            header={
              <Group
                template={isMobile ? 'initial' : 'repeat(3, auto)'}
                className="justify-content-between align-items-center"
              >
                <Group template="auto" gap="0" className="align-items-center">
                  <div className="bold color-gray-dark fs12 mb-8">{t('REGA Details')}</div>
                  <div className="bold">
                    {tenantUtils.getLocalisedString(listing?.rega_details?.property_specs, 'listing_type')}{' '}
                    {tenantUtils.getLocalisedString(listing?.rega_details?.property_specs, 'advertisement_type')}
                  </div>
                  <Typography.Paragraph className="color-primary fs24 mb-0">
                    {tenantConstants.CURRENCY_SYMBOL()}
                    <span className="bold px-8">
                      {formatNumberString(listing?.rega_details?.property_specs?.price, { maximumFractionDigits: 0 })}
                    </span>
                  </Typography.Paragraph>
                </Group>

                <Group template="initial" gap="4px">
                  <TextWithIcon
                    icon="PiSealCheckFill"
                    iconProps={{ color: tenantTheme['primary-color'], size: 16 }}
                    textColor={tenantTheme['base-color']}
                    title={
                      <Space size={8}>
                        <span className="color-gray-dark">{t('Ad License:')}</span>
                        {listing?.rega_details?.license_info?.ad_license_number}
                      </Space>
                    }
                  />

                  <TextWithIcon
                    icon="FaMapMarkerAlt"
                    iconProps={{ color: tenantTheme['primary-color'], size: 16 }}
                    textColor={tenantTheme['base-color']}
                    title={`${regaLoacation}`}
                  />

                  <TextWithIcon
                    icon="PiStackSimpleFill"
                    iconProps={{
                      color: tenantTheme['primary-color'],
                      size: 16,
                    }}
                    textColor={tenantTheme['base-color']}
                    title={`${listing?.rega_details?.property_specs?.area_size} ${t('Sq. M.')}`}
                  />
                </Group>

                <Group
                  template="initial"
                  gap="10px"
                  className={'text-right'}
                  style={{ alignSelf: 'stretch', alignContent: 'space-between' }}
                >
                  <Group template="auto auto" gap="12px" style={{ alignItems: 'end' }}>
                    <Flex vertical align="center" gap="10px">
                      {isHttpUrl(listing?.rega_details?.url) && (
                        <a
                          href={listing?.rega_details?.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex"
                          onClick={() => {
                            regaQRCodeClickEvent(user, false, listing?.rega_details?.license_info);
                          }}
                        >
                          <QRCode
                            size={56}
                            value={listing?.rega_details?.url}
                            viewBox={`0 0 256 256`}
                            onClick={() => {
                              regaQRCodeClickEvent(user, true, listing?.rega_details?.license_info);
                            }}
                          />
                        </a>
                      )}
                      <div style={{ width: '75px' }}>
                        <LinkWithIcon
                          showIconBeforeText={false}
                          as="a"
                          linkTitle={t('View Details on REGA')}
                          href={isHttpUrl(listing?.rega_details?.url) ? listing?.rega_details?.url : undefined}
                          target="_blank"
                          rel="noopener noreferrer"
                          className=" text-primary regaLink fz-12 fw-700"
                          style={{ color: tenantTheme['primary-color'] }}
                        />
                      </div>
                    </Flex>
                  </Group>

                  {isMobile && (
                    <div>
                      <Button
                        type="primary"
                        size="small"
                        style={{
                          '--btn-bg-color': tenantTheme['primary-color'],
                          '--btn-content-color': '#fff',
                          height: 30,
                        }}
                        onClick={() => {
                          setModalVisible(true);
                          regaInformationClickEvent(user);
                        }}
                      >
                        {t('View Details')}
                      </Button>
                    </div>
                  )}
                </Group>
              </Group>
            }
          >
            <RegaDetailFields listing={listing} />
          </Panel>
        </Collapse>
      </>
    );
  };

  return (
    <>
      <RegaCardStyle className={isMobile ? 'p-8' : 'p-12 mb-16'}>
        {isMobile ? regaMobile() : regaDesktop()}
      </RegaCardStyle>
      <ListingDetailModal visible={modalVisible} setModalVisible={setModalVisible} listing={listing} />
    </>
  );
};

export default RegaCard;
