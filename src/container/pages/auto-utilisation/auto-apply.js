import tenantTheme from '@theme';
import { Col, Divider, Row } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { AppliedCriteria, UtilisationRows } from '../../../components/auto-utilisation';
import {
  Alert,
  Button,
  Card,
  ConfirmationModal,
  DataTable,
  EmptyState,
  Icon,
  notification,
  Popover,
  RadioButtons,
  Skeleton,
} from '../../../components/common';
import Group from '../../../components/common/group/group';
import { IconStyled } from '../../../components/common/icon/IconStyled';
import ListItem from '../../../components/common/ListItem';
import WarningNotice from '../../../components/warning-notice';
import { PERMISSIONS_TYPE } from '../../../constants/permissions';

import tenantApi from '@api';
import { formatNumberString } from '../../../utility/utility';
import { useLazyGetAppliedAutoPlanQuery, useApplyUtilizationPlanMutation } from '../../../apis/listings';

function AutoApply({ credits }) {
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const user = useSelector((state) => state.app.loginUser.user);
  const [selections, setSelections] = useState([{ value: null, percentage: null, error: false }]);
  const [creditsFor, setCreditsFor] = useState(0);
  const { t } = useTranslation();

  const [autoPlan, setAutoPlan] = useState(null);
  const [error, setError] = useState('');

  const [loadingApplying, setLoadingApplying] = useState(false);

  const [getAppliedAutoPlan, { isLoading: loading }] = useLazyGetAppliedAutoPlanQuery();
  const [applyUtilizationPlan, { isLoading, error: errorApplying }] = useApplyUtilizationPlanMutation();

  useEffect(() => {
    fetchAppliedPlan();
  }, []);

  const confirmApplyRef = useRef();

  const fetchAppliedPlan = async () => {
    const response = await getAppliedAutoPlan({ userId: user?.id });
    if (response) {
      if (response.error) {
        setError(response.error);
      } else {
        setAutoPlan(response?.data?.plan);
      }
    }
  };

  const postPlan = async () => {
    confirmApplyRef?.current && confirmApplyRef.current.hideModal();
    setLoadingApplying(true);
    const response = await applyUtilizationPlan({
      credit_utilisation_plan: {
        user_id: user?.id,
        plan_type: 'auto',
        status: 'active',
        plan_execution_date: new Date().toISOString().slice(0, 10),
        agency_wide: !!creditsFor ? 1 : 0,
        utilisation_details_attributes: selections.map((e) => ({
          product_id: e.value,
          percentage: Number(e.percentage),
        })),
      },
    });
    if (response) {
      setLoadingApplying(false);
      if (response.error) {
        // setErrorApplying(response.error);
      } else {
        fetchAppliedPlan();
        // setAutoPlan(prevState => [...(prevState ? prevState : []), response.data.data]);
        notification.success(t('Plan Applied Successfully'));
      }
    }
  };

  const onSubmit = () => {
    let error = false;
    const newSelections = selections?.map((item) => {
      if (item.value && item?.percentage > 0 && item?.percentage <= 100) {
        return { ...item };
      } else {
        error = true;
        return { ...item, error: true };
      }
    });
    if (error) {
      setSelections(newSelections);
    } else {
      confirmApplyRef?.current && confirmApplyRef.current.showModal();
    }
  };

  const content = (
    <ol type="1">
      <li>{t("By selecting the 'Credit Type' you are choosing those credits which you want to utilise")}</li>
      <li>
        {t(
          "The 'Percentage' is to select exactly how much (quantity in percent) of your chosen credits you wish to utilise",
        )}
      </li>
      <li>{t("The 'Utilised Credits' shows the exact amount of credits that will be used.")}</li>
      <li>{t("'Add Credit' adds another Row.")}</li>
    </ol>
  );

  return loading && !autoPlan && !error ? (
    <AutoApplySkeleton />
  ) : (
    <Card bodyStyle={{ padding: 24 }}>
      <Group template="max-content auto" gap="16px">
        <IconStyled color={tenantTheme['primary-color']}>
          <Icon icon="FiSettings" size="1rem" />
        </IconStyled>
        <Group template="initial" gap="4px">
          <h2>{t('Auto Apply Credits')}</h2>

          <ul className="color-gray-dark">
            <ListItem>{t('Auto update your listings in a hassle-free manner')}</ListItem>
            <ListItem>{t('Get 400% extra traffic and exposure for your listings and get more leads')}</ListItem>
          </ul>
        </Group>
      </Group>
      <Divider />
      {error ? (
        <EmptyState message={error} onClick={fetchAppliedPlan} buttonLoading={loading} />
      ) : autoPlan && autoPlan?.id && autoPlan?.status != 'inactive' ? (
        <AppliedCriteria
          plan={autoPlan}
          credits={credits}
          fetchAppliedPlan={fetchAppliedPlan}
          onStopPlan={() => setAutoPlan(null)}
        />
      ) : (
        <Row align="bottom">
          <Col xs={24} xl={{ span: 20, offset: 2 }}>
            {!credits?.filter((e) => e?.available >= 1)?.length && (
              <WarningNotice
                style={{ marginTop: 8, '--warning-notice-bg': '#FCEAEA' }}
                className={'mb-16'}
                title={t(
                  'You do not have any credits available in your account right now to use this feature. Please purchase credits to continue.',
                )}
              />
            )}
            <h3 style={{ fontWeight: '400', fontSize: '1rem' }} className="mb-20">
              {t('Select the percentage credits to be used')}{' '}
              <Popover placement="bottom" title={t('How this works')} content={content} action="hover">
                <Icon icon="AiOutlineInfoCircle" color="#a3a3a3" />
              </Popover>
            </h3>
            <div className={isMobile ? 'mb-54' : 'mb-24'}>
              <UtilisationRows
                credits={credits ? credits.filter((e) => e?.available >= 1) : []}
                maxRows={credits?.filter((e) => e?.available >= 1)?.length}
                selections={selections}
                setSelections={setSelections}
                isMobile={isMobile}
              />
            </div>

            {user?.permissions?.[PERMISSIONS_TYPE.LISTINGS] && (
              <div className="mb-16">
                <p>{t('This credits criteria has been applied for')}</p>
                <RadioButtons
                  value={creditsFor}
                  handleChange={(e) => {
                    setCreditsFor(e.target.value);
                  }}
                  shape="round"
                  buttonList={[
                    { id: 1, label: t('Agency Wide') },
                    { id: 0, label: t('My Self') },
                  ]}
                  valueKey="id"
                />
              </div>
            )}
            <Alert message={loadingApplying ? '' : errorApplying} />
            <div className="text-center">
              <Button
                type="primary"
                size="large"
                style={{ paddingInline: 50 }}
                onClick={onSubmit}
                loading={loadingApplying}
                disabled={loadingApplying || !credits?.filter((e) => e?.available >= 1)?.length}
                block={isMobile ? true : false}
              >
                {t('Apply Criteria')}
              </Button>
            </div>
          </Col>
        </Row>
      )}

      <ConfirmationModal
        ref={confirmApplyRef}
        onSuccess={postPlan}
        onCancel={() => setLoadingApplying(false)}
        title={t('Apply Plan')}
        type="danger"
      >
        <>
          <DataTable
            columns={[
              { title: 'Product', dataIndex: 'product', key: 'product' },
              {
                title: 'Credits Available',
                dataIndex: 'credits_available',
                key: 'credits_available',
                Component: 'Number',
              },
              { title: 'Credits Used', dataIndex: 'credits_used', key: 'credits_used', Component: 'Number' },
            ]}
            data={selections.map((item) => {
              const selectedItem = credits?.length && credits.find((e) => e.id == item.value);
              return {
                product: selectedItem?.title,
                credits_available: formatNumberString(selectedItem?.available),
                credits_used: formatNumberString(selectedItem?.available * (Number(item.percentage) / 100)),
              };
            })}
          />
        </>
      </ConfirmationModal>
    </Card>
  );
}

const AutoApplySkeleton = () => {
  return (
    <Card bodyStyle={{ padding: 24 }}>
      {[1].map((item) => (
        <React.Fragment key={item}>
          <Row gutter={16} style={{ marginBottom: '16px' }}>
            <Col>
              <Skeleton type="paragraph" avatar paragraph={{ rows: 2 }} style={{ width: 400 }} />
            </Col>
          </Row>

          <Divider />

          <Row align="bottom" className="mb-40">
            <Col xs={24} xl={{ span: 20, offset: 2 }}>
              <Row className="mb-20">
                <Col>
                  <Skeleton type="title" size="small" style={{ minWidth: 320, maxWidth: '100%' }} />
                </Col>
              </Row>
              <Row gutter={16} style={{ width: '100%' }}>
                {[1, 2, 3, 4].map((item) => (
                  <Col key={item} xs={24} lg={12} xl={6}>
                    <Skeleton type="button" size="large" block />
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>

          <Row align="bottom" justify="center">
            <Col xs={24} lg={12} xl={4}>
              <Skeleton type="button" size="large" block />
            </Col>
          </Row>
        </React.Fragment>
      ))}
    </Card>
  );
};

export default AutoApply;
