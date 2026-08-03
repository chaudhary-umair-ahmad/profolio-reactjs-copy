import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useRouteNavigate } from '../../hooks';
import SuccessModal from '../success-modal/success-modal';
import { Button, Flex, Group, Heading, Icon, Text } from '../common';
import tenantConstants from '@constants';
import { contactClickEvent, viewRequestConfirmationEvent } from '../../services/analyticsService';
import { useEffect } from 'react';

const AdLicenseSuccessModal = ({ data, setData, requestId }) => {
  const { t } = useTranslation();
  const { isMobile } = useSelector((state) => state.app.AppConfig);
  const user = useSelector((state) => state.app.loginUser.user);
  const navigate = useRouteNavigate();

  useEffect(() => {
    viewRequestConfirmationEvent(user);
  }, []);

  const onCloseModal = () => {
    setData(null);
    navigate('/listings?tab=ad_licenses');
  };

  const handleContactAction = (type) => {
    contactClickEvent(user);
    const contactInfo = {
      phone: tenantConstants.CONTACT_PHONE,
      email: tenantConstants.CONTACT_EMAIL,
      whatsapp: tenantConstants.WHATSAPP_NUMBER,
    };

    switch (type) {
      case 'call':
        window.open(`tel:${contactInfo.phone}`);
        break;
      case 'email':
        window.open(`mailto:${contactInfo.email}`);
        break;
      case 'whatsapp':
        window.open(`https://wa.me/${contactInfo.whatsapp.replace('+', '')}`);
        break;
      default:
        break;
    }
  };

  const renderContent = () => (
    <Group gap="24px" style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
      <Heading as={isMobile ? 'h5' : 'h4'} className="fw-700">
        {t('Your request has been submitted successfully')}
      </Heading>

      <Text type="secondary" style={{ fontSize: '16px', lineHeight: '1.5' }}>
        {t(
          "Our agent will contact you for any additional information, We've also send a confirmation message to your mobile number",
        )}
      </Text>

      {requestId && (
        <Text strong style={{ fontSize: '14px' }}>
          {t('Request ID')}: <span className="text-primary">{requestId}</span>
        </Text>
      )}

      <Text type="secondary" style={{ fontSize: '14px' }}>
        {t('For any queries regarding your request, Contact us')}
      </Text>

      <Group template="repeat(3, 1fr)" gap="12px" style={{ marginTop: '16px' }}>
        <Button
          type="primaryOutlined"
          size={isMobile ? 'medium' : 'large'}
          icon={'MdPhone'}
          onClick={() => handleContactAction('call')}
        >
          {t('Call')}
        </Button>

        <Button
          type="primaryOutlined"
          size={isMobile ? 'medium' : 'large'}
          icon={'MdEmail'}
          onClick={() => handleContactAction('email')}
        >
          {t('Email')}
        </Button>

        <Button
          type="primaryOutlined"
          size={isMobile ? 'medium' : 'large'}
          icon={'RiWhatsappFill'}
          onClick={() => handleContactAction('whatsapp')}
        >
          {t('WhatsApp')}
        </Button>
      </Group>

      <Button type="link" onClick={onCloseModal} style={{ marginTop: '16px' }}>
        {t('Go to Ad License Requests')}
      </Button>
    </Group>
  );

  return (
    <SuccessModal
      visible={!!data}
      successImage={'AdLicenseRequestSuccess'}
      handleCancel={onCloseModal}
      renderContent={renderContent}
      width={764}
      hideCloseIcon={false}
    />
  );
};

export default AdLicenseSuccessModal;
