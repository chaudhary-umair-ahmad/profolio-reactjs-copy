import tenantConstants from '@constants';
import tenantTheme from '@theme';
import tenantUtils from '@utils';
import cx from 'clsx';
import React from 'react';
import { ImageWrapper } from '../../container/pages/agancy-staff/styled';
import { getBaseURL } from '../../utility/env';
import { Flex, Heading, Icon, Image, Skeleton, Tag, TextWithIcon } from '../common';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

const AgencyInfoCard = ({ agencyData, loading }) => {
  const { t } = useTranslation();
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const user = useSelector((state) => state.app.loginUser?.user);

  return loading ? (
    <Skeleton style={{ height: isMobile ? '50px' : '72px', width: '315px' }} />
  ) : (
    <Flex gap="16px" align="center">
      <ImageWrapper>
        <Image
          src={agencyData?.agency_logo}
          fallback={`${getBaseURL()}/profolio-assets/images/real-estate-placeholder.png`}
          wrapperStyle={{ overflow: 'hidden' }}
          style={{ objectFit: 'cover', width: '100%' }}
          wrapperClassName={cx('align-center-v imageContainer')}
        />
      </ImageWrapper>
      <div>
        <Flex gap="8px" align="center" wrap className="mb-4">
          <Heading as={isMobile ? 'h5' : 'h2'} style={{ margin: 0 }}>
            {tenantUtils.getLocalisedString(user?.agency, 'name')}
          </Heading>
          {tenantConstants.SHOW_VERIFIED_ICON && user?.agency?.is_verified && (
            <Tag
              style={{
                backgroundColor: '#E6F4FF',
                borderRadius: '4px',
                border: 'none',
                padding: '4px 8px',
                fontSize: '12px',
                color: '#000',
              }}
            >
              <Flex gap="4px" align="center">
                <Icon icon="PiSealCheckFill" color={tenantTheme['info-color-alt']} size="14px" />
                {t('Verified Agency')}
              </Flex>
            </Tag>
          )}
        </Flex>
        <Flex
          align={isMobile ? 'start' : 'center'}
          className="fs14 color-gray-dark"
          gap={isMobile ? '2px' : '6px'}
          vertical={isMobile}
        >
          {user?.agency?.email && (
            <TextWithIcon
              icon="MdEmail"
              iconProps={{ color: tenantTheme['gray600'], size: '12px' }}
              textColor={tenantTheme['text-color-secondary']}
              fontWeight={400}
              value={user?.agency?.email}
              textSize={isMobile ? '12px' : undefined}
            />
          )}

          {!isMobile && user?.agency?.email && (
            <Icon icon="GoDotFill" color={tenantTheme['gray500']} size={isMobile ? '12px' : undefined} />
          )}
          <TextWithIcon
            icon="MdPerson"
            iconProps={{ color: tenantTheme['gray600'], size: isMobile ? '12px' : undefined }}
            textColor={tenantTheme['text-color-secondary']}
            value={(agencyData?.list?.length || agencyData?.users?.length) + t(' Users')}
            fontWeight={400}
            textSize={isMobile ? '12px' : undefined}
          />
        </Flex>
      </div>
    </Flex>
  );
};

export default AgencyInfoCard;
