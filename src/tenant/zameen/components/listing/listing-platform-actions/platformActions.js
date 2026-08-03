import cx from 'clsx';
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { ActionPopOver, Button, ConfirmationModal, Group, Icon } from '../../../../../components/common';
import RenderUpgradeIcons from '../../../../../components/common/upgrade-icons/upgrade-icons';
import { TIME_DATE_FORMAT } from '../../../../../constants/formats';
import { useApplyListingUpgradesZameen } from '../../../../../hooks';
import { getTimeDateString } from '../../../../../utility/date';
import { QuotaCreditModal } from './quotaCreditModal';
import { VideoGraphyModal } from './videoGraphyModal';
import { PostStoryModal } from '../../../../common/components/listing/post-story/post-story';

const PlatformActions = (props) => {
  const { t } = useTranslation();
  const { data = [], stories = {}, location, purpose, stats, ...rest } = props;
  const postStoryRef = useRef();
  const adminCreditModal = useRef();
  const deductionModalRef = useRef();
  const videoGraphyModalRef = useRef();
  const { user } = useSelector((state) => state.app.loginUser);

  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);

  const {
    deduction,
    actionLoading,
    selectedAction,
    storyModalOpen,
    consumeAdminCredits,
    footerButtonLoading,
    setFooterButtonLoading,
    setSelectedAction,
    setActionLoading,
    setStoryModalOpen,
    setStoryCreditDeduction,
    applyProductThroughAdminCredits,
    getAdminCreditsDeduction,
    getDeduction,
    onApplyProduct,
  } = useApplyListingUpgradesZameen(deductionModalRef, postStoryRef, adminCreditModal, videoGraphyModalRef);

  return (
    <Group
      className={cx(rest.className)}
      gap={!isMobile && '15px'}
      template="repeat(5, minmax(0, 32px))"
      style={rest.style}
    >
      <PostStoryModal
        ref={postStoryRef}
        isModalOpen={storyModalOpen}
        setIsModalOpen={setStoryModalOpen}
        userId={selectedAction?.listing?.listingOwner?.id}
        property_id={selectedAction?.listing?.property_id}
        price={selectedAction?.listing?.price}
        location={location}
        purpose={purpose}
        setStoryCreditDeduction={setStoryCreditDeduction}
        totalCredits={deduction?.[selectedAction?.listing?.slug]?.available}
        isMobile={isMobile}
        setActionLoading={setActionLoading}
      />

      <ConfirmationModal
        key={'admin'}
        width={'708px'}
        ref={adminCreditModal}
        onCancel={() => {
          setActionLoading(false);
          adminCreditModal?.current && adminCreditModal?.current?.hideModal();
        }}
        footer={
          <>
            <Button
              onClick={() => {
                setActionLoading(false);
                adminCreditModal?.current && adminCreditModal?.current?.hideModal();
              }}
            >
              Cancel
            </Button>
            <Button
              loading={footerButtonLoading}
              type="primary"
              onClick={() => {
                setFooterButtonLoading(true);
                getAdminCreditsDeduction();
              }}
            >
              Use Admin Credits
            </Button>
          </>
        }
      >
        <div>
          Staff member {selectedAction?.listing?.listingOwner?.name} does not have enough credits. Do you want to use
          admin credits to perform this action?
        </div>
      </ConfirmationModal>

      <QuotaCreditModal
        ref={deductionModalRef}
        action={selectedAction?.product}
        listing={selectedAction?.listing}
        deduction={deduction}
        onSuccess={(option) => {
          if (consumeAdminCredits) {
            applyProductThroughAdminCredits();
          } else {
            deductionModalRef?.current && deductionModalRef?.current?.setLoading(true);
            onApplyProduct(option);
          }
        }}
        onCancel={() => {
          setActionLoading(false);
          deductionModalRef?.current && deductionModalRef.current.hideQuotaCreditModal();
        }}
      />

      <VideoGraphyModal
        ref={videoGraphyModalRef}
        action={selectedAction}
        user={user}
        onCancel={() => {
          setActionLoading(false);
          setSelectedAction(null);
          videoGraphyModalRef?.current && videoGraphyModalRef.current.hideVideoGraphyModal();
        }}
        onSuccess={(option) => {
          onApplyProduct(option);
          videoGraphyModalRef?.current && videoGraphyModalRef.current.hideVideoGraphyModal();
        }}
      />

      {data &&
        data.map((item) => {
          const { stories: listingStories = [] } = item;
          return (
            <React.Fragment key={item?.id}>
              {!!item?.listingPlatformActions && !!item.listingPlatformActions?.length > 0 ? (
                item?.listingPlatformActions.map((e, index) => {
                  const actionStyles =
                    !!e?.applied || !!e?.canApply || !!e?.pending
                      ? {
                          opaque: e.opaque,
                          color: e?.slug === 'property_videography' ? '#0793ea14' : e?.color || e?.iconProps?.color,
                          iconColor: e?.slug === 'property_videography' ? '#0793ea' : e.iconColor,
                        }
                      : !e?.canApply
                        ? { enableOnHover: false }
                        : {};
                  return (
                    <React.Fragment key={index}>
                      {e?.type === 'icon' ? (
                        <>
                          <RenderUpgradeIcons
                            selectedProduct={e}
                            toolTipTitle={
                              <ActionPopOver
                                title={
                                  !!e?.applied ? t(e?.appliedTitle) : e?.pending ? t(e?.pendingTitle) : t(e?.title)
                                }
                                appliedDescription={!!e?.applied ? t(e?.appliedDescription) : undefined}
                                expiryTime={getTimeDateString(e?.time_to_expiry, TIME_DATE_FORMAT)}
                                color={e?.color || e?.iconProps?.color}
                                stories={listingStories}
                                listing={item}
                                stats={stats}
                              />
                            }
                            deductionType={'credit'}
                            actionStyles={actionStyles}
                            listing={item}
                            loading={actionLoading?.[`${item?.slug}${e?.name}`]}
                            disabled={(!e?.applied && !e?.canApply && !e?.pending) || e?.applied}
                            index={index}
                            onIconClick={getDeduction}
                            hasVerifiedService={e?.slug === 'property_videography'}
                            //applyMediaQueries={true}
                          />
                        </>
                      ) : (
                        <div className="span-all">
                          <Button
                            key={item?.slug + index}
                            onClick={() => {
                              getDeduction('quota', item, e);
                            }}
                            block
                            style={{ padding: '4px 8px' }}
                            {...actionStyles}
                            loading={actionLoading?.[`${item?.slug}${e?.name}`]}
                          >
                            {e?.title}
                            <Icon icon={e?.icon} size="1.4em" style={{ verticalAlign: 'text-bottom' }} />
                          </Button>
                        </div>
                      )}
                    </React.Fragment>
                  );
                })
              ) : (
                <div class="span-all"></div>
              )}
            </React.Fragment>
          );
        })}
    </Group>
  );
};

export default PlatformActions;
