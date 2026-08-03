import tenantData from '@data';
import tenantTheme from '@theme';
import tenantUtils from '@utils';
import cx from 'clsx';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { ImageWrapper, UserCard } from '../../container/pages/agancy-staff/styled';
import { getBaseURL } from '../../utility/env';
import { Card, Flex, Group, Heading, Icon, Image, Skeleton, TextWithIcon } from '../common';
import QuotaCreditsStatsWidget from '../widgets/QuotaCreditsStatWidget';
import AgencyInfoCard from './agency-info-card';

const AgencyCardSkeleton = () => {
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);

  return (
    <Flex vertical={!!isMobile} justify="space-between" align="center" gap={isMobile ? '10px' : undefined}>
      <Skeleton style={{ height: isMobile ? '50px' : '72px', width: '315px' }} />
      <Skeleton style={{ height: isMobile ? '30px' : '46px', width: '310px' }} />
    </Flex>
  );
};

const AgencyHeader = ({ user, agencyStaff, loading, isMobile }) => {
  const { t } = useTranslation();
  const platformColor = tenantData.platformList[0]?.brandColor;

  return (
    <UserCard className={isMobile ? 'mb-8' : 'mb-24'} style={{ borderWidth: 0 }} bodyStyle={{ paddingInline: 16 }}>
      {loading ? (
        <AgencyCardSkeleton />
      ) : (
        <Group gap={isMobile ? '12px' : undefined} template={isMobile ? 'initial' : '1fr 550px'} className="align-items-center">
          <AgencyInfoCard agencyData={agencyStaff} isMobile={isMobile} user={user} />
          <Card style={{ borderWidth: 1, borderRadius: isMobile && '4px' }} className="creditCard">
            <Group template={'initial'} gap={isMobile ? '12px' : '10px'}>
              <QuotaCreditsStatsWidget
                available={agencyStaff?.agency_available_credits}
                used={agencyStaff?.agency_used_credits}
                total={agencyStaff?.total_agency_credits}
                loading={loading}
                currencyType={!!user?.isCurrencyUser ? 'credits' : 'quota'}
                brandColor={platformColor}
                showPackage={true}
              />
            </Group>
          </Card>
        </Group>
      )}
    </UserCard>
  );
};
export default AgencyHeader;
