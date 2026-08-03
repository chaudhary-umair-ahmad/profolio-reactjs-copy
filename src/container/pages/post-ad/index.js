import { Col, Row } from 'antd';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { ProfolioLogoLite, ProfolioLogoLiteAr } from '../../../components/svg';
import { Button, Flex } from '../../../components/common';
import { HeaderStyled } from '@components/layout/styled';
import SuccessModal from '@/components/success-modal/success-modal';
import PostListing from '../post-listing/post-listing';
import tenantConstants from '@constants';
import tenantTheme from '@theme';

const PostAd = () => {
  const { locale } = useSelector((state) => state?.app?.AppConfig);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [postResponse, setPostResponse] = useState(null);

  const toggleLanguage = (loc) => {
    const currentUrl = window?.location?.pathname + window?.location?.search;
    let newUrl;
    if (currentUrl.includes(`/${locale}/`)) {
      newUrl = currentUrl.replace(`/${locale}/`, `${loc == 'ar' ? '' : `/${loc}`}/`);
    } else {
      newUrl = `/${loc}${window?.location?.pathname + window?.location?.search}`;
    }
    return newUrl;
  };

  return (
    <>
      <Row align="center">
        <Col md={20} xxl={18}>
          <HeaderStyled>
            <div className="navbar-floor">
              <Flex className="container" align="center" justify="space-between" style={{ paddingBlock: '14px' }}>
                <div>
                  {locale === 'en' ? (
                    <ProfolioLogoLite
                      horizontal={tenantConstants?.APP_LOGO?.getLogoTextPlacement(true)?.[locale]?.horizontal}
                      text={tenantConstants?.APP_LOGO?.getLogoText(true)?.[locale]}
                      width={tenantConstants?.APP_LOGO?.getLogoTextPlacement(true)?.[locale]?.width}
                      height={tenantConstants?.APP_LOGO?.getLogoTextPlacement(true)?.[locale]?.height}
                    />
                  ) : (
                    <ProfolioLogoLiteAr
                      horizontal={tenantConstants?.APP_LOGO?.getLogoTextPlacement(true)?.[locale]?.horizontal}
                      text={tenantConstants?.APP_LOGO?.getLogoText(true)?.[locale]}
                      width={tenantConstants?.APP_LOGO?.getLogoTextPlacement(true)?.[locale]?.width}
                      height={tenantConstants?.APP_LOGO?.getLogoTextPlacement(true)?.[locale]?.height}
                    />
                  )}
                </div>

                <Flex gap="22px" style={{ alignItems: 'center' }}>
                  <a href={toggleLanguage(locale === 'ar' ? 'en' : 'ar')}>
                    <Button
                      style={{ fontFamily: locale === 'ar' && 'Helvetica' }}
                      className="px-0 languageSwitcher"
                      type="link"
                      icon="IconLanguageSwitcher"
                      iconSize="1.428571em"
                    >
                      {locale === 'ar' ? 'EN' : 'العربية'}
                    </Button>
                  </a>
                </Flex>
              </Flex>
            </div>
          </HeaderStyled>
        </Col>
      </Row>

      <div
        style={{
          backgroundColor: tenantTheme['layout-body-background'],
        }}
      >
        <PostListing
          handleMagicAdPost={(res) => {
            setShowSuccessModal(true);
            setPostResponse(res);
          }}
        />
      </div>
      <SuccessModal
        successImage="PackageSuccessIcon"
        visible={showSuccessModal}
        iconStyle={{ marginBottom: '30px' }}
        maxWidth={500}
        title={postResponse?.data?.message}
        hideCloseIcon
      />
    </>
  );
};

export default PostAd;
