import TenantComponents from '@components';
import tenantConstants from '@constants';
import tenantTheme from '@theme';
import tenantUtils from '@utils';
import { Divider, Row } from 'antd';
import React, { useMemo, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useDeleteAgencyUserMutation } from '../../../apis/agency';
import AgencyHeader from '../../../components/agency-staff-header/agancy-staff-header';
import {
  Avatar,
  Button,
  Card,
  ConfirmationModal,
  DataTable,
  Dropdown,
  Flex,
  Group,
  Heading,
  Icon,
  Tag,
  TextWithIcon,
  notification,
} from '../../../components/common';
import MultiPlatform from '../../../components/common/multiplatform';
import { UserForm } from '../../../components/forms/AgencyUserForm';
import { InviteUser } from '../../../components/invite-user/inviteUser';
import RenderTextLtr from '../../../components/render-text/render-text';
import SetCreditsLimit from '../../../components/set-credit-limit/set-credit-limit';
import { TruBrokerScore } from '../../../components/table/table-components/tru-broker-score';
import TruBrokerActivityDrawer from '../../../components/tru-broker/tru-broker-activity-drawer';
import TruBrokerLeaderBoard from '../../../components/tru-broker/tru-broker-leaderboard';
import TruBrokerTag from '../../../components/tru-broker/tru-broker-tag';
import { setUsersList } from '../../../store/appSlice';
import { TENANT_KEY } from '../../../utility/env';
import { formatNumberString } from '../../../utility/utility';
import { ActionButton } from '../user-settings/style';

const AgencyStaffMobilePage = ({ agencyStaff, title, loading }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [showUserForm, setShowUserForm] = useState(false);
  const [showInviteUser, setShowInviteUser] = useState(false);
  const [showAssignCredits, setShowAssignCredits] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [item, setItem] = useState(false);
  const confirmationModalRef = useRef();
  const user = useSelector((state) => state.app.loginUser.user);
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const truBrokerLeaderBoardRef = useRef();
  const truBrokerActivityDrawerRef = useRef();
  const ManageQuota = TenantComponents.ManageQuota;
  const [deleteAgencyUser] = useDeleteAgencyUserMutation();
  const { rtl } = useSelector((state) => ({ rtl: state.app.AppConfig.rtl }));
  const handleEdit = (item) => {
    setShowEditForm(true);
    setItem(item);
  };

  const handleAssignCredits = (item) => {
    setShowAssignCredits(true);
    setItem(item);
  };

  const handleDeleteUser = (item) => {
    setItem(item);
    confirmationModalRef?.current && confirmationModalRef.current.showModal();
  };

  const deleteModalData = useMemo(
    () => ({
      table: [
        {
          title: t('Name'),
          dataIndex: 'name',
          key: 'name',
          component: 'String',
        },
        {
          title: t('Email'),
          dataIndex: 'email',
          key: 'email',
          component: 'String',
        },
      ],
      list: [{ key: 0, name: tenantUtils.getLocalisedString(item, 'name'), email: item.email }],
      onDelete: async () => {
        const response = deleteAgencyUser({ agencyId: user?.agency?.id, userId: item?.id });
        if (response) {
          if (response?.error) {
            return { error: response.error };
          } else {
            return { id: item?.id };
          }
        }
      },
    }),
    [item],
  );

  const renderTruPointsScoreAndRank = (item) => {
    return (
      <>
        <TruBrokerScore
          {...item?.tru_points}
          scoreTitle={
            <>
              <span className="color-gray-dark">{t('TruPoints')}</span>
              {''}
              <span className="px-2">{item?.tru_points?.scoreTitle}</span>
            </>
          }
          subKey={'tru_points'}
          textSize="12px"
          style={{ '--svg-color': tenantTheme['primary-color'] + 'aa' }}
          iconProps={{ size: 12 }}
        />
        <TruBrokerScore
          {...item?.agent_rank}
          scoreTitle={
            <>
              <span className="color-gray-dark"> {t('Rank ')}</span>
              {item?.agent_rank?.scoreTitle}
            </>
          }
          subKey={'agent_rank'}
          textSize="12px"
          style={{ '--svg-color': tenantTheme['primary-color'] + 'aa', lineHeight: 'normal' }}
          iconProps={{ size: 12 }}
        />
      </>
    );
  };

  const onDeleteUser = async () => {
    confirmationModalRef.current.setLoading(true);
    const deletedUser = await deleteModalData?.onDelete();
    confirmationModalRef.current.setLoading(false);
    if (deletedUser) {
      if (deletedUser.error) {
        confirmationModalRef.current.setError(deletedUser.error);
      } else {
        notification.success(t('User Deleted Successfully'));
        confirmationModalRef?.current && confirmationModalRef.current.hideModal();
        dispatch(setUsersList(user?.agency?.id));
      }
    }
  };

  const onAction = (value) => {
    value.key === 'edit'
      ? handleEdit(item)
      : value.key === 'transfer'
        ? handleAssignCredits(item)
        : value.key === 'delete'
          ? handleDeleteUser(item)
          : () => {};
  };

  const onUser = () => {
    tenantConstants.INVITE_USER_TO_AGENCY_ENABLED ? setShowInviteUser(true) : setShowUserForm(true);
  };

  return (
    <>
      <AgencyHeader user={user} agencyStaff={agencyStaff} loading={loading} isMobile={isMobile} />
      <Flex align="center" justify="space-between" className="px-16">
        <Heading as="h5">{title}</Heading>
        {!!user?.is_credit_user &&
          user?.user_role_within_agency == 'owner' &&
          agencyStaff?.cappedUsersList?.length > 0 &&
          tenantConstants?.ALLOW_CREDITS_TOPTUP && (
            <Button
              type="primary"
              icon="IconCreditLimit"
              iconSize="16px"
              size="small"
              outlined
              onClick={() => setShowCreditModal(true)}
            >
              {t('Set Credits Limit')}
            </Button>
          )}
      </Flex>
      <UserForm isVisible={showUserForm} setIsVisible={setShowUserForm} agencyId={user?.agency?.id} userId={user?.id} />

      <InviteUser isVisible={showInviteUser} setIsVisible={setShowInviteUser} agencyId={user?.agency?.id} />
      <SetCreditsLimit isVisible={showCreditModal} setIsVisible={setShowCreditModal} data={agencyStaff} />
      {agencyStaff?.list?.map((item, i) => (
        <Card key={i} bodyStyle={{ padding: 16 }}>
          <Flex justify="space-between" align="start" className="mb-12">
            <Flex gap="18px" align="center">
              <div>
                <Avatar iconSize={20} size={34} src={item?.profile_image} />
              </div>

              <div>
                <Flex align="baseline" gap="4px">
                  <Flex vertical align="start" gap="0px">
                    <div>
                      {tenantConstants?.SHOW_PLATFORM_LOGO &&
                        (['bayut', 'dubizzle'].every((platform) => item?.user_details?.platforms.includes(platform)) ? (
                          <MultiPlatform style={{ height: '20px' }} />
                        ) : item?.user_details?.platforms.includes('bayut') ? (
                          <Icon size="55px" icon={rtl ? 'BayutLogoAr' : 'BayutLogoEn'} style={{ height: '20px' }} />
                        ) : item?.user_details?.platforms.includes('dubizzle') ? (
                          <Icon size="55px" icon={rtl ? 'DubizzleLogoAr' : 'DubizzleLogo'} style={{ height: '20px' }} />
                        ) : null)}
                    </div>
                    <Flex align="center" gap="4px">
                      <Heading className="mb-4" as="h6">
                        {tenantUtils.getLocalisedString(item, 'name')}
                      </Heading>
                      {item?.user_role_within_agency == 'owner' && (
                        <Tag
                          color="#28B16D"
                          textColor="#fff"
                          gradient
                          style={{ fontSize: '10px', '--line-height': 1.8 }}
                        >
                          {t('Owner')}
                        </Tag>
                      )}
                    </Flex>
                  </Flex>

                  {tenantConstants?.TRU_BROKER_ENABLED && item?.is_tru_broker && (
                    <TruBrokerTag
                      tagText={
                        <Trans i18nKey={'truBroker'} components={{ span: <span className="fw-700" />, sup: <sup /> }} />
                      }
                      padding={'3px 8px'}
                      tagFontSize={'10px'}
                    />
                  )}
                </Flex>

                {item.mobile && (
                  <TextWithIcon
                    icon="MdPhone"
                    iconProps={{ color: tenantTheme['primary-color'] + 'aa', size: '12px' }}
                    value={<RenderTextLtr text={item.mobile} />}
                    textColor={tenantTheme['gray700']}
                    textSize="12px"
                  />
                )}
                {item.email && (
                  <TextWithIcon
                    icon="MdEmail"
                    iconProps={{ color: tenantTheme['primary-color'] + 'aa', size: '12px' }}
                    value={item.email}
                    textColor={tenantTheme['gray700']}
                    textSize={'12px'}
                  />
                )}
              </div>
            </Flex>

            {!item?.is_admin && item?.id != user?.id && (
              <Dropdown
                placement="bottomRight"
                options={[
                  { key: 'edit', name: t('Edit') },
                  // user?.is_credit_user && { key: 'transfer', name: t('Assign Credits') },
                  { key: 'delete', name: t('Delete') },
                ]}
                getOptionLabel={(e) => e?.name}
                getOptionValue={(e) => e?.id}
                //   getOptionIcon={e => getIcon(e?.iconType)}
                suffixIcon={false}
                arrow={false}
                onChange={(e) => {
                  onAction(e);
                  setItem(item);
                }}
                style={{ padding: 4, border: 'none' }}
              >
                <Icon icon="FiMoreVertical" size="1.6em" color="#272b41" />
              </Dropdown>
            )}
          </Flex>

          {!isMobile && <Divider type="horizontal" orientation="center" style={{ marginBlock: 12 }} />}
          {tenantConstants?.ALLOW_CREDITS_TOPTUP &&
            (user?.is_credit_user ? (
              <Card
                style={{ borderRadius: isMobile && '4px', backgroundColor: tenantTheme['primary-light-4'] }}
                bodyStyle={{ padding: '10px 8px' }}
              >
                <Group template="repeat(2,1fr)" gap="6px">
                  <TextWithIcon
                    iconProps={{ size: 12, color: tenantTheme['primary-color'] + 'aa' }}
                    icon="IconCreditLimit"
                    textSize="12px"
                    value={
                      <div style={{ color: tenantTheme['gray700'] }}>
                        {t('Credits Limit')}{' '}
                        <span style={{ color: '#222' }}>{formatNumberString(item?.credits?.ksa?.total)}</span>
                      </div>
                    }
                  />
                  <TextWithIcon
                    iconProps={{ size: 12 }}
                    icon="IconUsedCredit"
                    value={
                      <div style={{ color: tenantTheme['gray700'] }}>
                        {t('Used Credits')}{' '}
                        <span style={{ color: '#222' }}>{formatNumberString(item?.credits?.ksa?.used)}</span>
                      </div>
                    }
                    textSize="12px"
                  />
                  {item?.tru_broker_start_date &&
                    tenantConstants.TRU_BROKER_ENABLED &&
                    renderTruPointsScoreAndRank(item)}
                  {/* {!item?.is_admin && item?.id != user?.id && (
                <Button
                  style={{
                    '--btn-bg-color': tenantTheme['primary-light-3'],
                    '--btn-content-color': tenantTheme['primary-color'],
                    border: 0,
                  }}
                  type="primary"
                  onClick={() => {
                    setItem(item);
                    setShowAssignCredits(true);
                  }}
                >
                  {t('Assign Credits')}
                </Button>
              )} */}
                </Group>
              </Card>
            ) : (
              <Row justify="space-between" align="middle">
                <div>
                  <div className="text-muted">{t('Quota Available')}</div>
                  <strong className="fs16">
                    {item?.quotas?.available ? formatNumberString(item.quotas.available) : 0}
                  </strong>
                </div>
              </Row>
            ))}
        </Card>
      ))}
      <UserForm
        isVisible={showEditForm}
        setIsVisible={setShowEditForm}
        agencyId={user?.agency?.id}
        userId={item?.id}
        isAdmin={item?.is_admin}
      />
      {ManageQuota && (
        <TenantComponents.ManageQuota
          isVisible={showAssignCredits}
          setIsVisible={setShowAssignCredits}
          agencyId={user?.agency?.id}
          userId={item?.id}
          name={tenantUtils.getLocalisedString(item, 'name')}
          creditsAvailable={item?.credits?.ksa?.available}
        />
      )}
      <ConfirmationModal ref={confirmationModalRef} title={t('Delete User')} onSuccess={onDeleteUser}>
        <p>{t('The following User will be deleted')}</p>
        <DataTable data={deleteModalData?.list} columns={deleteModalData?.table} />
      </ConfirmationModal>
      {tenantConstants.INVITE_USER_TO_AGENCY_ENABLED && (
        <ActionButton>
          <Button icon="MdPersonAddAlt" type="primary" size="large" style={{ paddingInline: 64 }} onClick={onUser}>
            {TENANT_KEY === 'zameen' ? t('Add User') : t('Invite User')}
          </Button>
        </ActionButton>
      )}
      {<TruBrokerLeaderBoard ref={truBrokerLeaderBoardRef} />}
      {<TruBrokerActivityDrawer ref={truBrokerActivityDrawerRef} />}
    </>
  );
};
export default AgencyStaffMobilePage;
