import tenantTheme from '@theme';
import { Alert, Col, Row } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  ConfirmationModal,
  DataTable,
  DrawerModal,
  EmptyState,
  Group,
  Icon,
  Number,
  Skeleton,
  notification,
} from '../../../../components/common';
import { DetailInput } from './DetailInput';
import { ManageQuotaList, ManageQuotaTable, QuotaBlock } from './styled';
import {
  useGetQuotaCreditsForTransferQuery,
  useTransferCreditsMutation,
  useTransferQuotaMutation,
} from '../../../../apis/quotaCredits';
import { capitalizeFirstLetter } from '../../../../utility/utility';
const columns = [
  { title: 'Zone', dataIndex: 'zone' },
  { title: 'Platform', dataIndex: 'platform' },
  { title: 'Product', dataIndex: 'title' },
  { title: 'Value', dataIndex: 'value' },
];

const ManageQuota = (props) => {
  const { t } = useTranslation();
  const { isVisible, setIsVisible, userId, name, agencyId } = props;
  const [userProductsData, setProducts] = useState(null);
  const [quotaCreditChange, setQuotaCreditChange] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const loggedUser = useSelector((state) => state.app.loginUser.user);
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);

  const confirmationModalRef = useRef();
  const dispatch = useDispatch();

  const { data: userData } = useGetQuotaCreditsForTransferQuery(
    { [`q[user_id_eq]`]: userId },
    { skip: !isVisible, refetchOnMountOrArgChange: true },
  );
  const { data: loggedInUserData } = useGetQuotaCreditsForTransferQuery(
    { [`q[user_id_eq]`]: loggedUser?.id },
    { skip: !isVisible, refetchOnMountOrArgChange: true },
  );

  const [updateCredits] = useTransferCreditsMutation();
  const [updateQuota] = useTransferQuotaMutation();

  useEffect(() => {
    if (isVisible && loggedInUserData && userData) {
      let updatedData = { ...loggedInUserData };
      //remove Olx from LoggedInUser if selected user is not mapped on Olx So olx Part does not show in Modal
      if (!userData?.olx?.zones?.all?.length && loggedInUserData?.olx) delete updatedData?.olx;
      setProducts({ loggedInUserData: updatedData, userData });
      setLoading(false);
    }
  }, [isVisible, loggedInUserData, userData]);

  const onCancel = () => {
    setIsVisible(false);
    setProducts(null);
    setQuotaCreditChange(null);
  };

  const handleOk = async () => {
    if (quotaCreditChange) {
      const errors = [];
      const quotaProducts = [],
        creditProducts = [];
      Object.keys(quotaCreditChange).forEach((e) => {
        quotaCreditChange[e].quota.forEach((it) => {
          const { error, title, ...product } = it;
          quotaProducts.push(product);
          if (error) {
            // errors.push(`Please fix ${title} value in ${ZONES.find((el) => el.tier_id == it.tier_id).title}`);
          }
        });
        quotaCreditChange[e].credit.forEach((it) => {
          const { error, title, ...product } = it;
          creditProducts.push(product);
          if (error) {
            // errors.push(`Please fix ${title} value in ${ZONES.find((el) => el.tier_id == it.tier_id).title}`);
          }
        });
      });
      if (errors.length) {
      } else {
        setSubmitLoading(true);
        let updates = [
          { data: quotaProducts, hit: () => updateQuota(quotaProducts) },
          { data: creditProducts, hit: () => updateCredits(creditProducts) },
        ];
        let promises = updates.filter((e) => !!e?.data?.length).map((e) => e?.hit());

        const response = await Promise.all(promises);
        if (response) {
          confirmationModalRef?.current && confirmationModalRef.current.hideModal();
          setSubmitLoading(false);
          setIsVisible(false);
          setQuotaCreditChange(null);
          response.map((res) => {
            const message = res?.data?.message;
            message && notification.success(message);
          });

          // if (response.quotaResponse) {
          //   if (!!response.quotaResponse.error) {
          //     notification.error(response.quotaResponse.error);
          //   } else {
          //     notification.success(t('Quota transferred successfully'));
          //     dispatch(setAgencyStaffList(loggedUser, agencyId));
          //   }
          // }
          // if (response.creditsResponse) {
          //   if (!!response.creditsResponse.error) {
          //     notification.error(response.creditsResponse.error);
          //   } else {
          //     notification.success(t('Credits transferred successfully'));
          //   }
          // }
          // if (!response.quotaResponse.error || !response.creditsResponse.error) {
          //   dispatch(fetchUserProducts());
          //   getProductData();
          //   setIsVisible(false);
          //   setQuotaCreditChange(null);
          // }
        }
      }
    }
  };

  const onQuotaCreditChange = (value, userProduct, zone, error) => {
    const transferValue = value;
    const quotaCreditList = quotaCreditChange?.[zone]
      ? { ...quotaCreditChange }
      : { ...quotaCreditChange, [zone]: { quota: [], credit: [] } };
    const index = quotaCreditList[zone][userProduct.type].findIndex((item) => {
      return item.product_id === userProduct.id;
    });
    const userIdsObj =
      transferValue >= 0
        ? { from_user_id: loggedUser.id, to_user_id: userId }
        : { to_user_id: loggedUser.id, from_user_id: userId };
    if (index !== -1) {
      quotaCreditList[zone]._products[quotaCreditList[zone][userProduct.type][index].product_id] = {
        value: error || !transferValue ? 0 : transferValue >= 0 ? `+${transferValue}` : `${transferValue}`,
        color: transferValue > 0 ? tenantTheme['primary-color'] : tenantTheme['error-color'],
      };
      quotaCreditList[zone][userProduct.type][index] = {
        ...quotaCreditList[zone][userProduct.type][index],
        ...userIdsObj,
        quantity: error ? 0 : Math.abs(transferValue),
        signedValue: transferValue,
        error,
      };
    } else {
      if (!quotaCreditList[zone]._products) quotaCreditList[zone]._products = {};
      quotaCreditList[zone]._products[userProduct.id] = {
        value: error || !transferValue ? 0 : transferValue > 0 ? `+${transferValue}` : `${transferValue}`,
        color: transferValue > 0 ? tenantTheme['primary-color'] : tenantTheme['error-color'],
      };
      quotaCreditList[zone][userProduct.type].push({
        product_id: userProduct.id,
        quantity: error ? 0 : Math.abs(transferValue),
        signedValue: transferValue,
        tier_id: userProduct.tier_id,
        title: userProduct.title,
        platform: userProduct.platform,
        currentQuantity: userProduct.available,
        error,
        ...userIdsObj,
      });
    }
    setQuotaCreditChange(quotaCreditList);
  };

  const pushTableData = (el, list, e) => {
    el.signedValue &&
      list.push({
        zone: capitalizeFirstLetter(e),
        title: el.title,
        platform: el.platform.toUpperCase(),
        value: el.currentQuantity + '' + (el.signedValue >= 0 ? `+${el.signedValue}` : el.signedValue),
      });
  };

  const getTableData = () => {
    const list = [];
    if (quotaCreditChange) {
      const zones = Object.keys(quotaCreditChange);
      zones.forEach((e) => {
        quotaCreditChange[e].quota.forEach((el) => pushTableData(el, list, e));
        quotaCreditChange[e].credit.forEach((el) => pushTableData(el, list, e));
      });
    }
    return list;
  };

  const renderDataTable = (label, data, columns) => (
    <>
      <DataTable columns={columns} data={data} />
      <div>{label}</div>
    </>
  );

  const renderDetail = (zone) => {
    const productsAssignedFrom = userProductsData?.loggedInUserData;
    const platforms =
      !!userProductsData?.userData && !!Object?.keys(userProductsData?.userData)?.length
        ? Object?.keys(userProductsData?.userData).filter((e) => !!productsAssignedFrom[e])
        : [];
    return platforms.map((platform) => {
      const { title, zones, icon, platformText } = userProductsData?.userData?.[platform];
      const productsList = zones[zone];
      const columns = productsAssignedFrom?.[platform]?.zones?.[zone].map((e) => {
        return { title: t(e.title), key: e.id, dataIndex: e.id };
      });
      const tableData = {};
      productsAssignedFrom?.[platform]?.zones?.[zone]?.forEach((e, i) => {
        tableData[e.id] = <Number key={i} value={e.available} compact={false} />;
      });

      return (
        <QuotaBlock
          key={platform}
          style={{ '--table-header-bg-color': platform === 'zameen' ? tenantTheme['primary-light'] : '#e4f3fc' }}
        >
          <ManageQuotaTable className="p-12 mb-20">
            <p className="flex align-item-center">
              <Icon icon={icon} size="1.4em" />
              {' '}
              <span>{t(platformText)}</span>
            </p>
            <strong>{t('Available to be assigned')}</strong>

            <DataTable tableClass="mb-0" data={[tableData]} columns={columns} />
          </ManageQuotaTable>
          <Group gap={'0'}>
            <Row>
              <Col xs={{ span: 12 }} lg={{ span: 9 }} className="semiBold">
                {t('Current ' + `${title}`)}
              </Col>
              <Col xs={{ span: 12 }} lg={{ span: 15 }} className="semiBold">
                {t('Add or remove')}
              </Col>
            </Row>
            {productsList.map((product) => {
              return (
                <React.Fragment key={product?.id}>
                  <ManageQuotaList>
                    <Col xs={{ span: 12 }} lg={{ span: 9 }} className="title">
                      <label className="color-gray-light">
                        {t(`${product.title}`)}
                        <span
                          style={
                            !!Number(quotaCreditChange?.[zone]?._products?.[product.id]?.value || 0)
                              ? { color: quotaCreditChange?.[zone]?._products?.[product.id]?.color }
                              : {}
                          }
                        >
                          *
                        </span>
                      </label>
                      <div>
                        {product.available}
                        {!!Number(quotaCreditChange?.[zone]?._products?.[product.id]?.value || 0) && (
                          <span style={{ color: quotaCreditChange?.[zone]?._products?.[product.id]?.color }}>
                            {quotaCreditChange?.[zone]?._products?.[product.id]?.value}
                          </span>
                        )}
                      </div>
                    </Col>

                    <Col xs={{ span: 12 }} lg={{ span: 15 }}>
                      <DetailInput
                        quotaCreditObj={product}
                        totalQuotaCredit={productsAssignedFrom[platform]?.zones?.[zone]?.find(
                          (e) => e.id === product.id,
                        )}
                        onChange={onQuotaCreditChange}
                        zone={zone}
                        clearInputs={!quotaCreditChange}
                        isMobile={isMobile}
                      />
                    </Col>
                  </ManageQuotaList>
                </React.Fragment>
              );
            })}
          </Group>
        </QuotaBlock>
      );
    });
  };

  const renderTabs = () => {
    return (
      <>
        {renderDetail('all')}
        <ConfirmationModal
          ref={confirmationModalRef}
          title={t('Products to assign')}
          onSuccess={handleOk}
          loading={submitLoading}
          onCancel={() => {
            confirmationModalRef?.current && confirmationModalRef.current.hideModal();
          }}
        >
          {renderDataTable(t('These changes will be made to quota and credits'), getTableData(), columns)}
          {error && <Alert message={error} />}
        </ConfirmationModal>
      </>
    );
  };

  return (
    <DrawerModal
      type="primary"
      title={t('Manage Products for ') + `${name}`}
      visible={isVisible}
      okText="Confirm"
      okButtonProps={{ type: 'primary' }}
      width={840}
      onOk={() => confirmationModalRef?.current && confirmationModalRef.current.showModal()}
      onCancel={onCancel}
    >
      {loading ? <ManageQuotaSkeleton /> : error ? <EmptyState message={error} /> : userProductsData && renderTabs()}
    </DrawerModal>
  );
};

const ManageQuotaSkeleton = () => {
  return (
    <QuotaBlock style={{ '--table-header-bg-color': '#e4f3fc' }}>
      <Skeleton />
      <DataTable loading columns={[]} data={[]} />

      <Group gap={'0'}>
        <Row className="mb-16">
          <Col xs={{ span: 12 }} lg={{ span: 9 }}>
            <Skeleton type="title" size="small" />
          </Col>
          <Col xs={{ span: 12 }} lg={{ span: 15 }}>
            <Skeleton type="title" size="small" />
          </Col>
        </Row>

        {[1, 2, 3, 4].map((e) => {
          return (
            <Row key={e} className="mb-16">
              <Col xs={{ span: 12 }} lg={{ span: 9 }}>
                <Skeleton type="title" size="small" />
              </Col>
              <Col xs={{ span: 12 }} lg={{ span: 15 }}>
                <Row gutter={[8]}>
                  <Col>
                    <Skeleton type="title" size="small" block />
                  </Col>
                  <Col flex="auto" xs={13}>
                    <Skeleton type="title" size="small" block />
                  </Col>
                  <Col>
                    <Skeleton type="title" size="small" block />
                  </Col>
                </Row>
              </Col>
            </Row>
          );
        })}
      </Group>
    </QuotaBlock>
  );
};

export default ManageQuota;
