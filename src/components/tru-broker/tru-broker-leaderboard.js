import tenantTheme from '@theme';
import { Typography } from 'antd';
import cx from 'clsx';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLazyGetTruBrokerLeaderboardDataQuery } from '../../apis/user';
import { Alert, Avatar, Card, DataTable, DrawerModal, Flex, Icon } from '../../components/common';
import { CardMetaStyled } from '../../container/pages/user-settings/style';
import { useTableData } from '../../hooks';
import { getPositionSuffix } from '../../utility/utility';
import tenantUtils from '@utils';
const { Text } = Typography;

const TruBrokerLeaderBoard = forwardRef((props, ref) => {
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const { user } = useSelector((state) => state.app.loginUser);
  const { t } = useTranslation();

  const [getTruBrokerLeaderboardData, { isLoading: loading, data: truBrokerDetails, error }] =
    useLazyGetTruBrokerLeaderboardDataQuery();

  const [data, columns] = useTableData(truBrokerDetails?.list, truBrokerDetails?.table || [], []);

  const [leaderBoardModalVisible, setLeaderBoardModalVisible] = useState(false);
  const [userData, setUserData] = useState();

  const showLeaderBoard = ({ scoreTitle, ...data }) => {
    setUserData(data);
    !truBrokerDetails && getTruBrokerLeaderboardData({ page: 1, limit: 10 });
    setLeaderBoardModalVisible(true);
  };

  useImperativeHandle(ref, () => ({
    showLeaderBoard,
  }));
  return (
    <DrawerModal
      title={<Trans i18nKey={'truBrokerLeaderBoard'} components={{ sup: <sup /> }} />}
      footer={null}
      onCancel={() => {
        setLeaderBoardModalVisible(false);
      }}
      visible={leaderBoardModalVisible}
      type="primary"
    >
      <Card
        style={{
          '--ant-color-bg-container': tenantTheme['primary-light-4'],
          borderColor: tenantTheme['primary-light-2'],
        }}
        className="mb-8"
      >
        <Flex justify="space-between" align="center">
          <CardMetaStyled
            avatar={<Avatar src={userData?.profile_image} size={30} iconSize={25} />}
            title={
              <div className={cx('fw-700', isMobile ? 'fz-14' : 'fz-16')}>
                {tenantUtils.getLocalisedString(user, 'name')}
              </div>
            }
            description={<Text type="secondary fz-12">{userData?.agency_name}</Text>}
            style={{
              padding: 0,
              '--ant-color-text-heading': tenantTheme['primary-color'],
              alignItem: 'center',
              '--card-height': '45px',
            }}
          />
          <div>
            <Flex align="center" gap="4px" className="fz-16 fw-600 text-primary">
              {userData?.scoreValue ? (
                <span className="fw-700">
                  {userData?.scoreValue}
                  <sup>{getPositionSuffix(userData?.scoreValue)}</sup>
                </span>
              ) : (
                '-'
              )}
              {' ' + t('Position')}
            </Flex>
            <Flex align="center" gap="4px" className="fz-12">
              <div>{userData?.score ? userData?.score : '-'}</div>
              <Trans
                i18nKey={'truPoints'}
                components={{ div: <div className="fw-500 fz-12" />, sup: <sup />, span: <span /> }}
              />
            </Flex>
          </div>
        </Flex>
      </Card>

      <DataTable className="tru-broker-table" data={data} columns={columns} loading={loading} />
      <div className="mb-16">
        <Alert
          style={{ '--ant-color-text-heading': tenantTheme['gray900'] }}
          showIcon
          icon={<Icon icon="InfoIcon" size={18} style={{ marginTop: '2px' }} />}
          type=""
          message={t('Ranks are updated at the 1st of every month and this data is based on last 90 days')}
        />
      </div>
    </DrawerModal>
  );
});
export default TruBrokerLeaderBoard;
