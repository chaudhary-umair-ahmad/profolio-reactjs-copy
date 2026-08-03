import tenantData from '@data';
import tenantRoutes from '@routes';
import { Space } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { strings } from '../../../constants/strings';
import { useRouteNavigate } from '../../../hooks';
import { Button, Card, Group, Heading, TextWithIcon } from '../../common';
import { IconPropertyPosted } from '../../svg';

const ListingStatusCard = ({ listing, listingId, isMobile }) => {
  const navigate = useRouteNavigate();
  const { t } = useTranslation();

  return listing?.listingHasUpgrades ? (
    <Card>
      <Group template={isMobile ? 'initial' : 'max-content auto max-content'}>
        <IconPropertyPosted />
        <div>
          <Heading as="h5">{t(strings.msg_listing_posted)}</Heading>
          <div className="mb-4 color-gray-light">
            {t('ID')}: {listingId}
          </div>
          <Space size="large">
            {listing &&
              Object.keys(listing?.platforms).map((e, i) => {
                return (
                  <div key={i} style={{ display: 'flex', justifyContent: 'normal' }}>
                    <TextWithIcon
                      icon="MdCheck"
                      iconProps={{
                        hasBackground: true,
                        color: tenantData.platformList.filter((p) => p.key === e)[0].brandColor,
                        style: { padding: 3 },
                        iconContainerSize: 18,
                      }}
                      textSize="12px"
                      title={t('Posted To') + ` ${e.toUpperCase()}`}
                    />
                  </div>
                );
              })}
            {listing &&
              Object.keys(listing?.platforms).map((e) => {
                const products = listing?.platforms?.[e]?.products;
                return (
                  products?.length > 0 &&
                  products.map((product) => {
                    return (
                      product.applied && (
                        <TextWithIcon
                          icon={product.icon}
                          iconProps={{ hasBackground: true, color: product.color, style: { padding: 3 }, size: 12 }}
                          textSize="12px"
                          title={t('Property Made') + ` ${product.name}`}
                        />
                      )
                    );
                  })
                );
              })}
          </Space>
        </div>
        <div className={`flex x-center y-center ${isMobile && ' span-all'}`}>
          <Button onClick={() => navigate(tenantRoutes.app()?.dashboard?.path)}>{t('Go To Dashboard')}</Button>
          {!listing?.listingHasUpgrades && (
            <Button style={{ marginInlineStart: 10 }} onClick={() => navigate(tenantRoutes.app()?.listings?.path)}>
              {t('Go To My Listings')}
            </Button>
          )}
        </div>
      </Group>
    </Card>
  ) : (
    <Card className="text-center p-16">
      <Group style={{ justifyItems: 'center' }} gap="28px" template={'1fr'}>
        <IconPropertyPosted size={isMobile ? 90 : 140} />
        <div className="mb-20">
          <Heading as="h5">{strings.msg_listing_posted}</Heading>
          <div className="mb-4 color-gray-light mb-40">
            {t('ID')}: {listingId}
          </div>
          <Space size="large">
            {listing &&
              Object.keys(listing.platforms).map((e) => {
                return (
                  <TextWithIcon
                    icon="MdCheck"
                    iconProps={{
                      hasBackground: true,
                      color: tenantData.platformList.filter((p) => p.key === e)[0].brandColor,
                      style: { padding: 6 },
                      size: 20,
                    }}
                    textSize="16px"
                    textColor="#1F1F1F"
                    title={t('Posted To') + `  ${e.toUpperCase()}`}
                  />
                );
              })}
            {listing &&
              Object.keys(listing.platforms)?.map((e) => {
                const product = listing.platforms[e].products;
                return product.map((e) => {
                  if (e.applied) {
                    return (
                      <TextWithIcon
                        icon={e.icon}
                        iconProps={{ hasBackground: true, color: e.color, style: { padding: 6 }, size: 20 }}
                        textSize="16px"
                        textColor="#1F1F1F"
                        title={t('Property Made') + ` ${e.name}`}
                      />
                    );
                  }
                });
              })}
          </Space>
        </div>
        <div className="text-center">
          <Button
            size="large"
            type="primary"
            style={{ padding: isMobile ? '7px 20px' : '12px 50px', margin: 4 }}
            onClick={() => navigate(tenantRoutes.app()?.dashboard?.path)}
          >
            {t('Go To Dashboard')}
          </Button>
          {!listing?.listingHasUpgrades && (
            <Button
              size="large"
              type="primary"
              style={{
                margin: 4,
                padding: isMobile ? '7px 20px' : '12px 50px',
                '--btn-bg-color': '#fff',
                '--btn-content-color': '#009f2b',
              }}
              onClick={() => navigate(tenantRoutes.app()?.listings?.path)}
            >
              {t('Go To My Listings')}
            </Button>
          )}
        </div>
      </Group>
    </Card>
  );
};

export default ListingStatusCard;
