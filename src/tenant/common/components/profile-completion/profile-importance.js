import tenantTheme from '@theme';
import React, { forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { CustomCard, DrawerModal } from '../../../../components/common';

const ProfileImportanceModal = forwardRef((props, ref) => {
  const { t } = useTranslation();
  const [visible, setIsVisible] = useState(false);
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);

  const showModal = () => {
    setIsVisible(true);
  };

  useImperativeHandle(ref, () => ({
    showModal,
  }));

  const profileImportanceSteps = useMemo(
    () => [
      {
        avatarIcon: 'SvgBuildTrust',
        title: t('Build Trust with Clients'),
        description: t('A complete, verified profile reassures clients of your credibility and professionalism.'),
        bgColor: tenantTheme['primary-light-4'],
      },
      {
        avatarIcon: 'SvgMaximise',
        title: t('Maximize your Leads'),
        description: t(
          'Agents with a 100% profile completion are more visible to clients, helping you get noticed faster.',
        ),
        bgColor: '#FCFAED',
      },
      {
        avatarIcon: 'SvgListingRank',
        title: t('Get Higher Listing Rank'),
        description: t(
          'Profile with 100% completeness get rewarded with higher placement in listings over users with incomplete profiles',
        ),
        bgColor: '#F4FAFE',
      },
      {
        avatarIcon: 'TruBrokerBadge',
        title: <Trans i18nKey="trubroker_title" components={{ sup: <sup />, span: <span className="" /> }} />,
        description: t('You get one step closer to becoming a TruBroker'),
        bgColor: '#F4FAFE',
      },
    ],
    [],
  );

  return (
    <DrawerModal
      title={t('Why is Profile Completion important?')}
      visible={visible}
      onCancel={() => setIsVisible(false)}
      footer={null}
      bodyStyle={{ '--ant-modal-body-padding': isMobile ? '8px' : '24px' }}
      width={650}
    >
      {profileImportanceSteps.map((card, i) => (
        <React.Fragment key={i}>
          <CustomCard
            avatarIcon={card?.avatarIcon}
            title={card?.title}
            description={card?.description}
            cardBackground={card?.bgColor}
            borderWidth={0}
          />
        </React.Fragment>
      ))}
    </DrawerModal>
  );
});
export default ProfileImportanceModal;
