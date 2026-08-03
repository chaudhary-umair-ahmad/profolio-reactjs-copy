import { Button, Card, Group, Heading, TextWithIcon } from '../../common';
import { IconAdSubmit } from '../../svg';

import tenantRoutes from '@routes';
import React from 'react';
import { useRouteNavigate } from '../../../hooks';
import { CardFirstVisitTitle } from '../../common/dashboard/styled';
import { UpgradeFree } from './style';
import { getBaseURL } from '../../../utility/env';

const FreeListingStatusCard = ({ listing, platform, isMobile, call }) => {
  const navigate = useRouteNavigate();
  return (
    <>
      <Card className="mb-16" style={{ borderColor: '#E3E6EF' }}>
        <Group className="align-items-center" template={isMobile ? 'max-content auto' : 'max-content auto'} gap="24px">
          <IconAdSubmit />
          <div>
            <Heading as="h5" className="fw-medium">
              Ad submitted but not live!
            </Heading>
            <p className="color-gray-light mb-0">
              Your property details have been submitted, please purchase ad slot to make it visible to users!
            </p>
          </div>
        </Group>
      </Card>
      <UpgradeFree
        style={{
          '--bg-img': `url("${getBaseURL()}/profolio-assets/images/Building-Image@2x.png")`,
          backgroundSize: 'auto 220px',
        }}
      >
        <CardFirstVisitTitle className="mb-24">{'Benefits of listing your property on Zameen.com'}</CardFirstVisitTitle>
        <Group gap="12px" className="mb-32">
          {[
            'Reach over a million active users on Pakistan’s #1 property portal',
            'Get quality leads & sell or rent out your property faster',
            'Reuse the same slot for your next property ad',
          ].map((item) => (
            <TextWithIcon
              className="textIcon"
              icon={'HiCheckCircle'}
              iconProps={{ size: '1.2em', color: '#009f2b' }}
              title={item}
              textSize="15px"
              textColor="#707070"
            />
          ))}
        </Group>
        <div className="btnArea mb-20">
          <Button
            onClick={() => navigate(tenantRoutes.app().prop_shop.path)}
            type="primary"
            style={{ '--btn-padding-y': 0 }}
          >
            Buy Now
          </Button>
          <span className="or color-gray-lighter">{'OR'}</span>
          <Button href={`tel:${call?.number}`} type="primary" outlined="true" icon="MdPhone">
            Call Now {call?.title}
          </Button>
        </div>
        <TextWithIcon
          className="textIcon"
          icon={'AiFillInfoCircle'}
          iconProps={{ size: '1em', color: '#BDBDBD' }}
          title={`Your ad ID is: ${listing.id}. Refer it while talking to our sales rep`}
          textSize="14px"
          textColor="#707070"
        />
      </UpgradeFree>
    </>
  );
};

export default FreeListingStatusCard;
