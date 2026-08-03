import tenantData from '@data';
import tenantConstants from '@constants';
import React, { forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { CustomCard, DrawerModal, LinkWithIcon, Icon } from '../../../../components/common';
import AccountManager from '../../../../components/manager-info/manager-info.js';
import {
  faqSectionClickEvent,
  profolioButtonClickEvent,
  regaComplianceClickEvent,
} from '../../../../services/analyticsService/index.js';
import { IconSwitch } from '../../../../components/svg.js';
import tenantTheme from '@theme';
import useGetLocation from '../../../../hooks/useGetLocation';
import TenantComponents from '@components';

export const HelpAndSupport = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const { isMobile, isMemberArea, locale } = useSelector((state) => state.app.AppConfig);
  const { user } = useSelector((state) => state.app.loginUser);
  const { t } = useTranslation();
  const location = useGetLocation();
  const isListingsPage = location.pathname.includes('/listings');

  useImperativeHandle(ref, () => ({
    show: (value) => {
      setVisible(value);
    },
  }));

  const cardData = useMemo(
    () => [
      {
        avatarIcon: 'ProfileIcon',
        title: t('Profolio'),
        description: t('Discover more about Profolio. Our best-in-class listings management software.'),
        link: `${tenantData.helpAndSupportUrls?.aboutProfolio?.[locale]}?webview=1`,
        onClick: profolioButtonClickEvent,
      },
      ...(tenantConstants.SHOW_REGA_DETAIL
        ? [
            {
              avatarIcon: 'SecurityIcon',
              title: t('REGA Compliance'),
              description: t('Discover more about REGA and real estate regulations.'),
              link: `${tenantData.helpAndSupportUrls?.aboutRega?.[locale]}?webview=1`,
              onClick: regaComplianceClickEvent,
            },
          ]
        : []),
      {
        avatarIcon: 'FAQIcon',
        title: t("FAQ's"),
        description: t('Explore answers to frequently asked questions and have your issues resolved.'),
        link: `${tenantData.helpAndSupportUrls?.faqs?.[locale]}?webview=1`,
        onClick: faqSectionClickEvent,
      },
      ...(tenantConstants.SHOW_REPORT_TO_REGA 
        ? [
            {
              avatarIcon: 'ReportToRegaIcon',
              title: t('Report to REGA'),
              description: t('Report issues so we can review this listing.'),
              link: null,
              onClick: () => {
                setVisible(false);
                setReportModalVisible(true);
              },
              showChevron: true,
            },
          ]
        : []),
    ],
    [locale, isListingsPage],
  );

  return (
    <>
      <DrawerModal
        title={t('Help & Support')}
        visible={visible}
        onCancel={() => setVisible(false)}
        bodyStyle={{ padding: isMobile ? 12 : 24 }}
        footer={null}
        {...props}
      >
        <div>
          {cardData.map((card, i) => (
            <React.Fragment key={i}>
              <CustomCard
                // key={card?.title}
                avatarIcon={card.avatarIcon}
                title={card.title}
                description={card.description}
                link={card.link}
                onClick={card.onClick}
                cursor="pointer"
                extraContent={
                  card.link ? (
                    <LinkWithIcon
                      as="a"
                      icon={<IconSwitch color={tenantTheme['primary-color']} />}
                      href={card?.link}
                      className="btnLink"
                      target="_blank"
                    />
                  ) : card.showChevron ? (
                    <Icon icon="FiArrowRight" color={tenantTheme['primary-color']} />
                  ) : null
                }
              />
            </React.Fragment>
          ))}
          {tenantConstants.SHOW_ACCOUNT_MANAGER && !isMemberArea && <AccountManager user={user} />}
        </div>
      </DrawerModal>
      {tenantConstants.SHOW_REPORT_TO_REGA && (
        <TenantComponents.ReportUnwantedContactModal
          visible={reportModalVisible}
          onCancel={() => setReportModalVisible(false)}
        />
      )}
    </>
  );
});
