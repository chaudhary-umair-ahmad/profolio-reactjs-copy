import tenantData from '@data';
import { Col, Row } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Card,
  ConfirmationModal,
  DataTable,
  EmptyState,
  Group,
  Heading,
  Skeleton,
  Tag,
  TextWithIcon,
  notification,
} from '../../../../components/common';
import { RadioListStyled, RadioPill } from '../../../../components/common/radio-button/styled';
import { FreeListingStatusCard, ListingStatusCard } from '../../../../components/post-listing';
import { IconZoneFactor } from '../../../../components/svg';
import { Main } from '../../../../container/styled';
import { useGetLocation } from '../../../../hooks';
import { JeffiDetail } from '../../../../tenant/zameen/components/listing/listing-platform-actions/JeffiDetail';
import { formatNumberString } from '../../../../utility/utility';
import { useLazyGetUpsellDetailQuery, usePostSavedListingMutation } from '../../../../apis/postlisting';
import { usePostPackageOnListingMutation } from '../../../../apis/listings';
import { useLazyGetCreditDeductionQuery, useLazyGetQuotaDeductionApiQuery } from '../../../../apis/quotaCredits';

const creditColumns = (t) => [
  { title: t('Product'), dataIndex: 'product', key: 'product' },
  { title: t('Credits Available'), dataIndex: 'credits_available', key: 'credits_available' },
  { title: t('Credits Required'), dataIndex: 'credits_used', key: 'credits_used' },
];

const quotaColumns = (shifted, t) => {
  return [
    {
      title: shifted ? t('Quota Available') : t('Credits Available'),
      dataIndex: 'quota_available',
      key: 'quota_available',
    },
    { title: shifted ? t('Quota Required') : t('Credits Required'), dataIndex: 'quota_used', key: 'quota_used' },
  ];
};

const UpgradeListingPage = (props) => {
  const { t } = useTranslation();
  const listingId = props?.id;
  const location = useGetLocation();
  const selectedPlatforms = location?.state?.selectedPlatforms ? location?.state?.selectedPlatforms : {};
  const user = useSelector((state) => state.app.loginUser.user);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [error, setError] = useState('');
  const [creditsApplied, setCreditApplied] = useState(null);
  const [quotaApplied, setQuotaApplied] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [platformLoading, setPlatformLoading] = useState(selectedPlatforms);
  const [retryCount, setRetryCount] = useState(1);
  const factorModalRef = useRef();
  const postConfirmRef = useRef();
  const jeffiRef = useRef();
  const dispatch = useDispatch();
  const isMobile = props.isMobile;

  const [getListingDetail] = useLazyGetUpsellDetailQuery();
  const [postPackageOnListing, {}] = usePostPackageOnListingMutation();
  const [postSavedListing] = usePostSavedListingMutation();
  const [getQuotaDeductionApi] = useLazyGetQuotaDeductionApiQuery();
  const [getCreditDeduction] = useLazyGetCreditDeductionQuery();

  const fetchListing = async () => {
    const response = await getListingDetail({ listingId });
    if (response) {
      setLoading(false);
      if (response.error) {
        setError(response.error);
      } else {
        if (!!response?.data.platforms?.olx) {
          let respBoolList = [],
            loadingObj = { ...platformLoading };
          Object.keys(platformLoading).forEach((platform) => {
            respBoolList.push(!!response.data.platforms[platform]);
            if (!!response.data.platforms[platform]) {
              loadingObj[platform] = false;
            }
          });
          setRetryCount((prevCount) => (respBoolList.every((e) => e) ? 5 : prevCount + 1));
          setPlatformLoading(loadingObj);
        }
        setListing(response.data);
      }
    }
  };

  useEffect(() => {
    if (retryCount < 5) {
      if (retryCount <= 1) {
        fetchListing();
      } else {
        setTimeout(() => {
          fetchListing();
        }, 3000);
      }
    }
  }, [retryCount]);

  const onPost = useCallback(async () => {
    postConfirmRef.current.setLoading(true);
    let loadingObj = { ...platformLoading };
    tenantData.platformList.forEach((e) => {
      if (!loadingObj[e.slug] && e.slug === selectedPlatform.slug) {
        loadingObj = { ...loadingObj, [e.slug]: true };
      }
    });

    setPlatformLoading(loadingObj);
    const response = await postSavedListing({
      listingId: listing?.id,
      action: { platform: selectedPlatform?.slug },
      listingStatus: 'post_to',
      userId: listing?.listingOwner ? listing?.listingOwner?.id : user?.id,
    });
    if (response) {
      setLoading(false);
      postConfirmRef.current.setLoading(false);
      if (response.error) {
        notification.error(response.error);
      } else {
        if (response.data) {
          postConfirmRef?.current && postConfirmRef.current.hideModal();
          fetchListing();
        }
      }
    }
  }, [selectedPlatform]);

  const getQuotaDeduction = async (platform) => {
    setSelectedPlatform(platform);
    setLoadingProduct(true);
    const response = await getQuotaDeductionApi({
      subject_id: listing?.listingOwner ? listing?.listingOwner?.id : user?.id,
      location_id: listing.location?.id,
    });
    setLoadingProduct(false);
    if (response) {
      if (response?.error) {
        notification.error(response.error);
      } else if (!!response?.[platform?.slug]) {
        if (
          !!response?.[platform?.slug]?.available &&
          !!response?.[platform?.slug]?.required &&
          response?.[platform.slug]?.available > response?.[platform.slug]?.required
        ) {
          setQuotaApplied(response?.[platform.slug]);
          postConfirmRef?.current && postConfirmRef.current.showModal();
        } else {
          notification.error(
            listing?.user?.id === user?.id
              ? t('Insufficient Quota')
              : `${listing.user.name} ${t('has insufficient quota')}`,
          );
        }
      } else {
        notification.error(
          listing?.user?.id === user?.id
            ? t('Insufficient Quota')
            : `${listing.user.name} ${t('has insufficient quota')}`,
        );
      }
    }
  };

  const getCreditDeductionData = async (product, platform) => {
    setSelectedProduct(product);
    setSelectedPlatform(platform);
    setLoadingProduct(true);
    const { data, error } = await getCreditDeduction({
      platform: platform?.slug,
      data: {
        listing_id: listingId,
        product_id: user.products.platforms[platform.slug].find((e) => e.slug == product.slug)?.id,
        subject_id: listing?.listingOwner ? listing?.listingOwner?.id : user?.id,
      },
    });
    setLoadingProduct(false);
    if (error) {
      notification.error(error);
    } else if (data?.[platform?.slug]) {
      if (
        !!data?.[platform?.slug]?.available &&
        !!data?.[platform?.slug]?.required &&
        data?.[platform?.slug]?.available >= data?.[platform?.slug]?.required
      ) {
        setCreditApplied(data?.[platform?.slug]);
        factorModalRef?.current && factorModalRef.current.showModal();
      } else {
        notification.error(
          listing?.user?.id === user?.id
            ? t('Insufficient Credits')
            : `${listing?.user?.name} ${t('has insufficient credits')}`,
        );
      }
    } else {
      notification.error(
        listing?.user?.id === user?.id
          ? t('Insufficient Credits')
          : `${listing?.user?.name} ${t('has insufficient credits')}`,
      );
    }
  };

  const upgradeProperty = async (platform, product) => {
    factorModalRef.current.setLoading(true);
    const response = await postPackageOnListing({
      listingId: listingId,
      action: product,
      data: {
        ...(product?.mediaDetails && {
          ...product?.mediaDetails,
        }),
        user_id: listing?.listingOwner ? listing?.listingOwner?.id : user?.id,
      },
    });
    if (response) {
      factorModalRef.current.setLoading(false);
      factorModalRef?.current && factorModalRef.current.hideModal();
      if (response.error) {
        notification.error(response.error);
      } else {
        notification.success(t('Upgrade Successful!'));
        fetchListing();
      }
    }
  };

  const renderDataTable = (label, tableClassName, data, columns) => {
    return (
      <>
        <div className="mb-8">{t(label)}</div>
        <DataTable className={tableClassName} columns={columns} data={data} />
      </>
    );
  };

  const renderPostToPlatformCard = (platform) => {
    return (
      <Card>
        <Group>
          <div>
            <Row justify="space-between" className="mb-16">
              <TextWithIcon
                className=" color-gray-lightest"
                icon={platform.icon}
                iconProps={{ hasBackground: true, size: '1.2em', style: { padding: 6 } }}
                title={`${platform.name} ` + t('Upgrades')}
              />
            </Row>
            <RadioListStyled
              style={{
                '--upgrade-bg-color': `${platform.brandColor}21`,
                '--upgrade-border-color': platform.brandColor,
              }}
            >
              <RadioPill value={platform?.key} key={platform?.key} className="radio-list-item list-item-checked">
                <div className="radio-content color-gray-lightest">
                  <Row justify="space-between">
                    <div>
                      <Heading as="h6" className="mb-4">
                        {t('Better reach on the platform')}
                      </Heading>
                      <p className="mb-12">{`${t('Make Property')} ${
                        platform?.slug === 'zameen' ? t('Premium') : ''
                      }  ${t('Listing')}`}</p>
                    </div>
                    <div
                      className={`flex y-center ${isMobile && ' flex-grow'}`}
                      style={{
                        marginTop: isMobile ? 10 : 0,
                      }}
                    >
                      <Button
                        outlined
                        size="small"
                        style={{
                          backgroundColor: platform.brandColor,
                          color: '#fff',
                        }}
                        block={isMobile ? true : false}
                        disabled={false}
                        loading={selectedPlatform?.slug === platform.slug && loadingProduct}
                        onClick={() => {
                          getQuotaDeduction(platform);
                        }}
                      >
                        {`${t('Post to')} ${platform.name}`}
                      </Button>
                    </div>
                  </Row>
                </div>
              </RadioPill>
            </RadioListStyled>
          </div>
        </Group>
      </Card>
    );
  };

  const renderUpgradeListingCard = (platform, cardKey) => {
    return (
      <Card key={cardKey}>
        <Group>
          <div>
            <Row justify="space-between" className="mb-16">
              <TextWithIcon
                className=" color-gray-lightest"
                icon={platform.icon}
                iconProps={{ hasBackground: true, size: '1.2em', style: { padding: 6 } }}
                title={`${platform.name}  ${t('Upgrades')}`}
              />
              <Tag color={listing?.platforms?.[platform?.slug]?.status?.color} shape="round">
                {t(listing?.platforms?.[platform?.slug]?.status?.label)}
              </Tag>
            </Row>

            <RadioListStyled
              style={{
                '--upgrade-bg-color': `${platform.brandColor}21`,
                '--upgrade-border-color': platform.brandColor,
              }}
            >
              {listing?.platforms?.[platform.slug]?.products?.map((product) => {
                if (!product.applied) {
                  return (
                    <RadioPill
                      value={product.id}
                      key={product.id}
                      className="radio-list-item list-item-checked"
                      style={{ cursor: 'auto' }}
                    >
                      <div className="radio-content fw-medium color-gray-lightest">
                        <Row justify="space-between">
                          <div>
                            <Heading as="h6" className="mb-4">
                              {t(product.description)}{' '}
                              <span
                                className="product-tag"
                                style={{
                                  color: product.textColor,
                                  backgroundColor: product.color,
                                }}
                              >
                                {t(product.name)}
                              </span>
                            </Heading>
                            <p className="mb-12">{t(product.upgradeTitle)}</p>
                          </div>
                          <div
                            className={`flex y-center ${isMobile && ' flex-grow'}`}
                            style={{ marginTop: isMobile ? 10 : 0 }}
                          >
                            <Button
                              block={isMobile ? true : false}
                              style={{
                                backgroundColor: platform.brandColor,
                                color: '#fff',
                              }}
                              loading={selectedProduct?.slug === product.slug && loadingProduct}
                              onClick={() => {
                                getCreditDeductionData(product, platform);
                              }}
                            >
                              {t('Apply')}
                            </Button>
                          </div>
                        </Row>
                      </div>
                    </RadioPill>
                  );
                }
              })}
            </RadioListStyled>
          </div>
        </Group>
      </Card>
    );
  };

  return (
    <Main style={{ paddingBlock: 32 }}>
      {error ? (
        <EmptyState message={error} onClick={() => fetchListing()} buttonLoading={loading} />
      ) : (
        <Row align="center">
          <Col md={20} xxl={18}>
            <Group>
              {loading ? (
                <StatusCardSkeleton />
              ) : (
                !listing?.platforms?.['zameen']?.isFreeListing && (
                  <ListingStatusCard listingId={listing?.id} listing={listing} isMobile={isMobile} />
                )
              )}
              {loading ? (
                <ProductRowSkeleton />
              ) : (
                tenantData?.platformList?.map((platform, index) => {
                  const isPlatformLoading = platformLoading[platform.slug];
                  if (loading) {
                    return <ProductRowSkeleton />;
                  } else {
                    if (listing?.platforms?.[platform.slug]) {
                      if (listing?.platforms?.[platform.slug]?.isFreeListing) {
                        return (
                          <FreeListingStatusCard
                            listing={listing}
                            platform={tenantData?.platformList?.filter((e) => e?.slug === 'zameen')}
                            call={listing?.call}
                          />
                        );
                      } else {
                        return (
                          listing.platforms?.[platform.slug].haveUpgrades && renderUpgradeListingCard(platform, index)
                        );
                      }
                    } else if (user?.platforms?.findIndex((e) => e.slug === platform?.slug) !== -1) {
                      return renderPostToPlatformCard(platform);
                    }
                  }
                })
              )}
            </Group>
          </Col>
        </Row>
      )}

      <ConfirmationModal
        ref={factorModalRef}
        onSuccess={() => {
          const details = jeffiRef?.current && jeffiRef?.current?.getSelectionAndDate();
          if (details?.request_date == 'Invalid date' || details?.request_date == 'Invalid Date') {
            notification.error(t('Please select date and time for the service'));
          } else {
            upgradeProperty(selectedPlatform, { ...selectedProduct, mediaDetails: details });
          }
        }}
        onCancel={() => {
          setLoadingProduct(false);
        }}
      >
        <>
          {renderDataTable(
            t('Following credits will be utilized'),
            'mb-16',
            [
              {
                product: <>{t(selectedProduct?.title)}</>,
                credits_available: creditsApplied?.available,
                credits_used: creditsApplied?.required,
              },
            ],
            creditColumns(t),
          )}
          {!!creditsApplied?.isZoneArea && (
            <Row className="mb-20">
              <Col md={1} xs={2}>
                <IconZoneFactor />
              </Col>
              <Col md={23} xs={22} className="fs12">
                <strong>{t('Zone Factor Alert')}</strong>
                <p className="color-gray-dark">{`${t(
                  t('You are posting the listing to a premium location'),
                )}, ${formatNumberString(creditsApplied?.zoneFactor)} extra ${
                  selectedPlatform?.slug === 'olx' && !user.is_shifted_to_olx_quota ? 'credit' : 'quota'
                } ${t('will be deducted because of zone factor')}`}</p>
              </Col>
            </Row>
          )}
        </>
        {selectedProduct?.slug === 'shot_listing' && (
          <JeffiDetail listing={listing} ref={jeffiRef} isMobile={isMobile} />
        )}
      </ConfirmationModal>
      <ConfirmationModal
        ref={postConfirmRef}
        onSuccess={onPost}
        onCancel={() => {
          setLoading(false);
        }}
      >
        {renderDataTable(
          user?.is_shifted_to_olx_quota
            ? t('Following quota will be utilized')
            : t('Following credits will be utilized'),
          'mb-16',
          [{ quota_available: quotaApplied?.available, quota_used: quotaApplied?.required }],
          quotaColumns(user?.is_shifted_to_olx_quota, t),
        )}
        {quotaApplied?.isZoneArea && (
          <Row className="mb-20">
            <Col md={1} xs={2}>
              <IconZoneFactor />
            </Col>
            <Col md={23} xs={22} className="fs12">
              <strong>{t('Zone Factor Alert')}</strong>
              <p className="color-gray-dark">{`${t('You are posting the listing to a premium location')}, ${
                quotaApplied?.zoneFactor
              } extra ${selectedPlatform?.slug === 'olx' && !user.is_shifted_to_olx_quota ? 'credit' : 'quota'} ${t(
                'will be deducted because of zone factor',
              )}`}</p>
            </Col>
          </Row>
        )}
      </ConfirmationModal>
    </Main>
  );
};

const StatusCardSkeleton = () => (
  <Row align="center">
    <Col md={20} xxl={18}>
      <Card>
        <Skeleton />
      </Card>
    </Col>
    <Card>
      <Skeleton />
      <Skeleton />
    </Card>
  </Row>
);

const ProductRowSkeleton = () => (
  <Card>
    <Row align="center">
      <Col md={20} xxl={18}>
        <Card>
          <Skeleton />
        </Card>
      </Col>
    </Row>
  </Card>
);

export default UpgradeListingPage;
