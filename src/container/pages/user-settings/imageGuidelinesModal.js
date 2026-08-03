import React, { useMemo, useState } from 'react';
import { Modal, Typography, Row, Col, Image } from 'antd';
import { useTranslation } from 'react-i18next';
import { Flex, Card, Icon } from '../../../components/common';
import { useSelector } from 'react-redux';
import { DrawerModal } from '../../../components/common';
import tenantTheme from '@theme';

const { Title, Text } = Typography;

const ProfilePictureGuidelinesModal = ({ visible, onCancel }) => {
  const { t } = useTranslation();
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);

  const guidelinesContent = useMemo(() => [
    {
      id: 1,
      backgroundColor: '#F2FAFA',
      heading: t('Your Profile Picture Should'),
      icon: 'Check3DIcon',
      content: [
        { id: '1', rule: t('Be a clear, high-resolution headshot with a solid background.') },
        { id: '2', rule: t('Be front-facing for a professional appearance.') },
        { id: '3', rule: t('Be centered around your head and shoulders.') },
      ],
      images: ['accepted-guideline-img-1.png', 'accepted-guideline-img-2.png', 'accepted-guideline-img-3.png'],
    },
    {
      id: 2,
      backgroundColor: '#FFF1EE',
      heading: t('Avoid Using'),
      icon: 'Cross3DIcon',
      content: [
        { id: '1', rule: t('Selfies or casual photos') },
        { id: '2', rule: t('Group photos or full-length pictures') },
        { id: '3', rule: t('Low-quality, pixelated, or blurry images') },
        { id: '4', rule: t('Photos with distracting or cluttered backgrounds') },
        { id: '5', rule: t('Side-profile shots or pictures taken from extreme angles') },
      ],
      images: ['avoided-guideline-img-1.png', 'avoided-guideline-img-2.png', 'avoided-guideline-img-3.png'],
    },
  ]); 

  return (
    <DrawerModal
      bodyStyle={{
        maxHeight: 600,
        overflowY: 'scroll',
      }}
      title={
        <Title level={2} style={{ margin: 0, fontSize: isMobile ? '18px' : '24px' }}>
          {t('Profile Picture Guidelines')}
        </Title>
      }
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={650}
      height={'500px'}
    >
      <Flex vertical gap={isMobile ? '10px' : '16px'}>
        <Text style={{ color: tenantTheme['base-color'] }}>
          {t(
            'A high-quality profile picture enhances your credibility and helps you stand out. The better the photo, the stronger your professional presence.',
          )}{' '}
          {/* Translate this text */}
        </Text>

        {guidelinesContent.map((item) => (
          <Card
            bodyStyle={{ padding: isMobile ? '12px' : '16px' }}
            style={{
              backgroundColor: item.backgroundColor,
              border: 0,
              borderRadius: isMobile && '6px',
              marginBottom: '16px',
            }}
            key={item.id}
          >
            <Flex className="mb-16" style={{ backgroundColor: item.backgroundColor }}>
              <Icon icon={item.icon} />
              <Title
                level={5}
                style={{
                  margin: 0,
                  marginInlineStart: '8px',
                }}
              >
                {item.heading}
              </Title>
            </Flex>

            <Flex align="center" justify="center" gap="24px">
              {item.images.map((image, index) => (
                <div className="mb-8" style={{ borderRadius: '10px', overflow: 'hidden' }}>
                  <Image width={isMobile ? 90 : 150} src={`/profolio-assets/images/${image}`} preview={false} />
                </div>
              ))}
            </Flex>

            <Flex vertical align="start" style={{ marginTop: '12px' }}>
              {item.content.map((rule) => (
                <Text type="secondary" key={rule.id} className={isMobile && 'fz-12'}>
                  <ul style={{ marginBottom: '2px', listStyleType: 'disc' }}>
                    <li>{rule.rule}</li>
                  </ul>
                </Text>
              ))}
            </Flex>
          </Card>
        ))}
      </Flex>
    </DrawerModal>
  );
};

export default ProfilePictureGuidelinesModal;
