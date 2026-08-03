import tenantTheme from '@theme';
import React, { useState } from 'react';
import { Button } from '../button/button';
import Heading from '../heading/heading';
import Text from '../text/text';
import { t } from 'i18next';
import { Flex, Image, Tag } from '../../common';
import { IntroModal } from './styled';
import { useNavigate } from 'react-router-dom';

const SectionIntroModal = (props) => {
  const { title, description, btnText = null, redirectUrl, coverImageUrl, onClose = () => {} } = props;
  const [visible, setVisible] = useState(true);
  const navigate = useNavigate();

  const onClick = () => {
    navigate(redirectUrl);
    onClose();
  };

  return (
    <>
      <IntroModal
        title={<Image fallback={coverImageUrl} />}
        width={590}
        visible={visible}
        onCancel={() => {
          setVisible(false);
          onClose();
        }}
        footer={
          btnText && (
            <Button type="primaryOutlined" size="large" onClick={onClick} className="w-100">
              {t(btnText)}
            </Button>
          )
        }
      >
        <Flex gap="6px" align="center" className="mb-8">
          <Heading as="h6" className="mb-0">
            {t(title)}
          </Heading>
          <Tag color={tenantTheme['danger-color']} style={{ '--tag-color': '#fff', '--tag-font-size': '12px' }}>
            {t('NEW')}
          </Tag>
        </Flex>

        <Text type="secondary" className={'fz-12 color-gray-dark'}>
          {t(description)}
        </Text>
      </IntroModal>
    </>
  );
};

export default SectionIntroModal;
