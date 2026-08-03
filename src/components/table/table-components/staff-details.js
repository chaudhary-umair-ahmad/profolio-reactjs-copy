import tenantConstants from '@constants';
import tenantTheme from '@theme';
import { Typography } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Flex, Icon, Tag, TextWithIcon } from '../../common';
import { IconStyled } from '../../common/icon/IconStyled';
import RenderTextLtr from '../../render-text/render-text';
import TruBrokerTag from '../../tru-broker/tru-broker-tag';
import { useSelector } from 'react-redux';
import tenantData from '@data';
import { BayutLogoEn, DubizzleLogo, BayutSmallLogo, BayutLogoAr, MultiPlatformIcon } from '../../svg';
import MultiPlatform from '../../common/multiplatform';
const { Text } = Typography;

export const StaffDetails = (props) => {
  const { t } = useTranslation();
  const { name, email, phone, user_role, image, user_agency_name, is_tru_broker, platforms } = props;
  const { rtl } = useSelector((state) => ({ rtl: state.app.AppConfig.rtl }));
  return (
    <>
      <Flex gap="10px" align="center">
        <div>
          {image ? (
            <Avatar size={34} src={image} style={{ margin: 0, padding: 1 }} />
          ) : (
            <IconStyled style={{ '--icon-styled-width': '40px' }}>
              <Icon size={16} icon="FiUser" />
            </IconStyled>
          )}
        </div>

        <div>
          <Flex align="start" vertical>
            {tenantConstants?.SHOW_PLATFORM_LOGO && platforms && (
              <>
                {['bayut', 'dubizzle'].every((platform) => platforms.includes(platform)) ? (
                  <MultiPlatform style={{ height: '20px' }} />
                ) : platforms.includes('bayut') ? (
                  <Icon size="55px" icon={rtl ? 'BayutLogoAr' : 'BayutLogoEn'} style={{ height: '20px' }} />
                ) : platforms.includes('dubizzle') ? (
                  <Icon
                    size="55px"
                    icon={rtl ? 'DubizzleLogoAr' : 'DubizzleLogo'}
                    style={{ marginBottom: '-1px', height: '20px' }}
                  />
                ) : null}
              </>
            )}

            <div>
              {name && (
                <Text className="fw-700" style={{ paddingInlineEnd: '8px' }}>
                  {name}
                </Text>
              )}

              {user_role == 'owner' && (
                <Tag
                  color="#28B16D"
                  textColor="#fff"
                  gradient
                  style={{ '--tag-font-size': '12px', '--line-height': 1.6 }}
                >
                  {t('Owner')}
                </Tag>
              )}
            </div>
          </Flex>

          {tenantConstants.TRU_BROKER_ENABLED && is_tru_broker && (
            <TruBrokerTag
              tagText={<Trans i18nKey={'truBroker'} components={{ span: <span className="fw-700" />, sup: <sup /> }} />}
              style={{ marginInlineStart: '8px' }}
              padding={'3px 8px'}
              tagFontSize={'10px'}
            />
          )}

          {email && (
            <TextWithIcon
              icon="MdMail"
              iconProps={{ size: '12px', color: tenantTheme.gray500 }}
              textColor={tenantTheme.gray700}
              value={email}
              textSize={'12px'}
            />
          )}
          {phone && (
            <TextWithIcon
              icon="MdPhone"
              iconProps={{ size: '12px', color: tenantTheme.gray500 }}
              textColor={tenantTheme.gray700}
              value={<RenderTextLtr text={phone} />}
              textSize={'12px'}
            />
          )}
          {user_agency_name && (
            <Text type="secondary" className="fw-400 fz-12 d-block">
              {user_agency_name}
            </Text>
          )}
        </div>
      </Flex>
    </>
  );
};
