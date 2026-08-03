import tenantConstants from '@constants';
import React, { useEffect } from 'react';
import { Col, Row } from 'antd';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Group } from '../../../../components/common';
import { Main } from '../../../../container/styled';
import { useGetMatch, usePageTitle } from '../../../../hooks';
import OfferedPackages from './offered-packages/offeredPackages';
import { PackageCardList } from './offered-packages/styled';
import PackageHeader from './package-header';

function PropShop(props) {
  const { t } = useTranslation();
  const { isExact } = useGetMatch();

  const { isMobile, isMemberArea } = useSelector((state) => state.app.AppConfig);
  const { user } = useSelector((state) => state.app.loginUser);

  usePageTitle(
    `${t('Advertise Your Property | ')} ${t(tenantConstants.TITLE)}`,
    `${t("Find the perfect package to boost your property's visibility among potential buyers and renters across")} ${tenantConstants.TITLE}. ${t(
      'Simple, effective, and designed to suit various budgets and goals.',
    )}`,
  );

  return (
    <Main isMemberArea={isMemberArea}>
      <PackageCardList className={isExact ? 'cartWraper' : 'checkoutWraper'}>
        <Row gutter={isMobile ? 0 : 32} justify="center" style={{ rowGap: 16 }}>
          <Col span={24} xxl={30} lg={28} xs={34}>
            <Group gap="8px">
              {/* <div
                className="stickyHeadingBorad mb-0"
                style={{ textAlign: 'end', '--top-space': '70px', '--padding': 0, marginTop: !isMobile && '-10px' }}
              >
                <PlatfromSwitch
                  section="packages"
                  platformsType="bayutDubizzle"
                  platformSwitchStyle={{
                    marginBlock: '8px',
                    width: isMobile && '100%',
                    minWidth: !isMobile && '300px',
                  }}
                />
              </div> */}

              {!isMemberArea && user?.package && <PackageHeader />}
              <OfferedPackages {...props} />
            </Group>
          </Col>
        </Row>
      </PackageCardList>
    </Main>
  );
}

export default PropShop;
