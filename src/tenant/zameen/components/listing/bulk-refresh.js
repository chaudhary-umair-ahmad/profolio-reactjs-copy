import { Card, Col, Row, Tag } from 'antd';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Button, ConfirmationModal, Icon } from '../../../../components/common';
import ProgressBar from '../../../../components/common/progress-bar/ProgressBar';
import { usePostPackageOnListingMutation } from '../../../../apis/listings';
const ApplyBulkRefresh = ({ fetchData, selectedListings, updateSelectedListings }) => {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.app.loginUser);

  const [postPackageOnListing, {}] = usePostPackageOnListingMutation();

  const [applied, setApplied] = useState(0);
  const [refreshCalled, setRefreshCalled] = useState(0);
  const [selectedPlatorm, setSeletedPlatform] = useState(null);
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);

  const bulkRefreshRef = useRef();
  const progressBarRef = useRef();

  const applyBulkRefresh = async (userId, listings, platform, setApplied, setRefreshCalled) => {
    let successfullyApplied = 0;
    let promiseArray = listings?.map(async (e) => {
      const response = await postPackageOnListing({
        listingId: e?.id,
        action: {
          slug: platform === 'zameen' ? 'refresh_listing' : 'olx_refresh_listing',
        },
        data: { user_id: !!e?.listingOwner ? e?.listingOwner?.id : !!e?.user ? e?.user?.id : userId },
      });
      if (response) {
        setRefreshCalled((prev) => prev + 1);
        if (!response?.error) {
          successfullyApplied++;
          setApplied((prev) => prev + 1);
        }
      }
    });
    const response = await Promise.all(promiseArray);
    if (response) {
    }
  };

  const renderApplyRefreshConfirmation = () => {
    return (
      <>
        {isMobile ? (
          !selectedListings?.length ? (
            <></>
          ) : (
            <Card className={'selectedRowsMobile'} style={{ body: { padding: 20 } }}>
              <div className="flex justify-content-between align-items-center mb-16">
                <div>
                  <Tag color="#00A4D1">{selectedListings.length}</Tag>
                  {t('Listings Selected')}
                </div>
                <Button
                  onClick={() => {
                    updateSelectedListings({
                      listings: [],
                      selected: false,
                      multiple: false,
                      clearSelectedItems: true,
                    });
                  }}
                  transparented
                  block={false}
                  style={{ borderColor: '#fff', padding: '4px 8px' }}
                >
                  {t('Cancel')}
                </Button>
              </div>
              <div className="flex justify-content-between align-items-center">
                {user?.platforms?.map((e) => {
                  return (
                    <Button
                      key={e?.slug}
                      onClick={() => {
                        setSeletedPlatform(e?.slug);
                        bulkRefreshRef?.current && bulkRefreshRef?.current?.showModal();
                      }}
                      style={{ padding: '4px 8px' }}
                    >
                      <Icon icon={e?.icon} size="1.4em" style={{ verticalAlign: 'text-bottom' }} />
                      {e?.slug === 'zameen' ? t('Refresh Listings') : t('Boost To Top')}
                    </Button>
                  );
                })}
              </div>
            </Card>
          )
        ) : (
          !!selectedListings.length && (
            <Card className={isMobile ? 'selectedRowsMobile' : 'selectedRows'} style={{ body: { padding: 20 } }}>
              <Row gutter={48} className="pi-32">
                <Col>
                  <Tag color="#00A4D1">{selectedListings.length}</Tag>
                  {t('Listings Selected')}
                </Col>
                {user?.platforms?.map((e) => {
                  return (
                    <Col key={e?.slug}>
                      <div className="span-all">
                        <Button
                          onClick={() => {
                            setSeletedPlatform(e?.slug);
                            bulkRefreshRef?.current && bulkRefreshRef?.current?.showModal();
                          }}
                          block
                          style={{ padding: '4px 8px' }}
                        >
                          <Icon icon={e?.icon} size="1.4em" style={{ verticalAlign: 'text-bottom' }} />
                          {e?.slug === 'zameen' ? t('Refresh Listings') : t('Boost To Top')}
                        </Button>
                      </div>
                    </Col>
                  );
                })}
                <Col style={{ marginInlineStart: 'auto' }}>
                  <Button
                    onClick={() => {
                      updateSelectedListings({
                        listings: [],
                        selected: false,
                        multiple: false,
                        clearSelectedItems: true,
                      });
                    }}
                    transparented
                    block
                    style={{ borderColor: '#fff', padding: '4px 8px' }}
                  >
                    {t('Cancel')}
                  </Button>
                </Col>
              </Row>
            </Card>
          )
        )}
      </>
    );
  };

  return (
    <>
      <ConfirmationModal
        ref={bulkRefreshRef}
        onCancel={() => {
          updateSelectedListings({ listings: [], selected: false, multiple: false, clearSelectedItems: true });
          bulkRefreshRef?.current && bulkRefreshRef?.current?.hideModal();
        }}
        onSuccess={async () => {
          progressBarRef?.current && progressBarRef?.current?.showModal();
          bulkRefreshRef?.current && bulkRefreshRef?.current?.hideModal();
          await applyBulkRefresh(user?.id, selectedListings, selectedPlatorm, setApplied, setRefreshCalled);
        }}
      >
        <div>
          {`${t('Do you want to apply')} ${selectedPlatorm === 'zameen' ? t('Refresh') : t('Boost')} ${t(
            'Credits to the selected',
          )}
          ${selectedListings?.length} ${t('Listings')}?`}
        </div>
        <div>
          {t(
            'Zone factor and other cases will be handled in the background and the process will stop if the credits are exhausted.',
          )}
        </div>
      </ConfirmationModal>

      <ConfirmationModal
        ref={progressBarRef}
        onCancel={() => {
          fetchData();
          updateSelectedListings({ listing: [], selected: false, multiple: false, clearSelectedItems: true });
          setApplied(0);
          setRefreshCalled(0);
          progressBarRef?.current && progressBarRef?.current?.hideModal();
        }}
        title={selectedPlatorm === 'zameen' ? t('Refresh Progress') : t('Boost to Top Progress')}
        footer={<></>}
      >
        <ProgressBar
          done={refreshCalled}
          successfull={applied}
          total={selectedListings?.length}
          selectedPlatorm={selectedPlatorm}
        />
      </ConfirmationModal>
      {renderApplyRefreshConfirmation()}
    </>
  );
};
export default ApplyBulkRefresh;
