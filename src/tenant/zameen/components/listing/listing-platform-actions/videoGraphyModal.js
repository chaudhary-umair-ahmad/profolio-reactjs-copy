import tenantApi from '@api';
import tenantData from '@data';
import tenantRoutes from '@routes';
import tenantTheme from '@theme';
import moment from 'moment/moment';
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Card,
  Checkbox,
  ConfirmationModal,
  DateSelect,
  Group,
  Icon,
  Skeleton,
  notification,
} from '../../../../../components/common';
import { useRouteNavigate } from '../../../../../hooks';
import { HasVerifiedCheck } from './styled';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { useLazyGetCreditDeductionQuery } from '../../../../../apis/quotaCredits';

export const VideoGraphyModal = forwardRef((props, ref) => {
  const { t } = useTranslation();
  const { onSuccess = () => {}, onCancel = () => {}, user } = props;
  const [checkboxValue, setCheckboxValue] = useState({
    ['property_videography']: true,
    ['property_photography']: true,
  });
  const [selectedDateAndTime, setSelectedDateAndTime] = useState({ type: '25', date: { value: null, error: '' } });
  const [creditsData, setCreditsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const modalRef = useRef();
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const [getCreditDeduction, {}] = useLazyGetCreditDeductionQuery();

  const navigate = useRouteNavigate();

  const fetchCreditDetails = async () => {
    const isModalVisble = modalRef?.current?.getModalVisiblity();
    if (isModalVisble && !loading && selectedAction) {
      setLoading(true);
      const vedioGraphyCredits = await getCreditDeduction({
        platform: selectedAction?.listing?.slug,
        data: {
          listing_id: selectedAction?.listing?.property_id,
          product_id: selectedAction?.product?.id,
          subject_id: selectedAction?.listing?.listingOwner ? selectedAction?.listing?.listingOwner?.id : user?.id,
        },
      });
      const photoGraphyCredits = await getCreditDeduction({
        platform: selectedAction?.listing?.slug,
        data: {
          listing_id: selectedAction?.listing?.property_id,
          product_id: 13,
          subject_id: selectedAction?.listing?.listingOwner ? selectedAction?.listing?.listingOwner?.id : user?.id,
        },
      });

      const response = {
        ['property_videography']: vedioGraphyCredits?.data?.zameen,
        ['property_photography']: photoGraphyCredits?.data?.zameen,
      };

      if (response) {
        setLoading(false);
        if (!response?.error) {
          setCreditsData(response);
          setCheckboxValue({
            ['property_videography']:
              !!response?.['property_videography']?.available &&
              !!selectedAction?.listing?.listingPlatformActions?.find((it) => it?.slug == 'shot_listing')?.applied,
            ['property_photography']: !!response?.['property_photography']?.available,
          });
        }
      }
    }
  };

  useEffect(() => {
    fetchCreditDetails();
  }, [modalRef?.current?.getModalVisiblity(), selectedAction]);

  useImperativeHandle(ref, () => ({
    showVideoGraphyModal: (action) => {
      if (action) {
        setSelectedAction(action);
      }
      modalRef && modalRef?.current && modalRef?.current?.showModal();
    },
    hideVideoGraphyModal: () => {
      modalRef && modalRef?.current && modalRef?.current?.hideModal();
    },
    setLoading: (value) => {
      modalRef && modalRef?.current && modalRef?.current?.setLoading(value);
    },
  }));

  const serviceProducts = tenantData.products?.filter(
    (e) =>
      (!!selectedAction?.listing?.listingPlatformActions?.find((it) => it?.slug == 'shot_listing')?.applied &&
        e?.slug == 'property_videography') ||
      e?.slug == 'property_photography',
  );

  const getServiceProductIcon = (service) => {
    switch (service) {
      case 'property_videography':
        return 'HiVideoCamera';
      case 'property_photography':
        return 'HiCamera';
      default:
        break;
    }
  };

  return (
    <>
      <ConfirmationModal
        ref={modalRef}
        width={'708px'}
        height={600}
        key={'videgraphy'}
        destroyOnClose
        onSuccess={() => {
          if (
            !!creditsData?.['property_photography']?.available >= 1 ||
            !!creditsData?.['property_videography']?.available >= 1
          ) {
            if (!checkboxValue?.['property_videography'] && !checkboxValue?.['property_photography']) {
              notification.error(t('Please select one service to continue!'));
            } else if (!selectedDateAndTime?.date?.value || !!selectedDateAndTime?.date?.error) {
              notification.error(t('Please select date and time to continue!'));
            } else {
              const product_id = [];
              !!checkboxValue?.['property_photography'] && product_id.push(13);
              !!checkboxValue?.['property_videography'] && product_id.push(14);
              onSuccess({
                ...selectedAction,
                mediaDetails: {
                  product_id: product_id,
                  is_premium: 1,
                  ['request_date']: dayjs(selectedDateAndTime?.date?.value)?.format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
                },
              });
            }
          } else {
            notification.error(t('Insufficient Credits') + '!');
          }
        }}
        onCancel={() => {
          setSelectedDateAndTime({ type: '25', date: { value: null, error: '' } });
          onCancel();
        }}
        title={t('Zameen Verified Services')}
      >
        <>
          {loading ? (
            <>
              <Skeleton active type="paragraph"></Skeleton>
              <Skeleton active type="paragraph"></Skeleton>
            </>
          ) : (
            <>
              <div className="mb-8">{t('Please select the services required')}</div>
              <Group template="initial" gap="16px">
                {serviceProducts?.length &&
                  serviceProducts?.map((e, index) => {
                    return (
                      <Card
                        key={index}
                        onClick={() => {
                          if (!!creditsData?.[e?.slug]?.available >= 1) {
                            setCheckboxValue((prev) => ({ ...prev, [e?.slug]: !prev[e?.slug] }));
                          }
                        }}
                        style={
                          !!checkboxValue?.[e?.slug]
                            ? { borderColor: tenantTheme['primary-color'], backgroundColor: '#f5faf8' }
                            : {}
                        }
                      >
                        <Group template="auto 1fr auto" style={{ alignItems: 'center' }}>
                          <Checkbox
                            value={checkboxValue?.[e?.slug]}
                            disabled={!creditsData?.[e?.slug]?.available >= 1}
                          />

                          <Group template="auto 1fr" gap="16px" style={{ alignItems: 'center' }}>
                            <HasVerifiedCheck>
                              <Icon {...e.iconProps} icon={getServiceProductIcon(e.slug)} styled size="2rem" />
                              <Icon className="icon-check" icon="HiCheck" />
                            </HasVerifiedCheck>
                            <div>
                              <div>
                                <strong>{t(e?.title)}</strong>
                              </div>
                              <div className="text-muted">{t(e?.description)}</div>
                            </div>
                          </Group>

                          <div>
                            {creditsData?.[e?.slug]?.available >= 1 ? (
                              <div>{`${t('Available Credits')}: ${creditsData?.[e?.slug]?.available}`} </div>
                            ) : (
                              <Button type="primary" onClick={() => navigate(tenantRoutes.app().prop_shop.path)}>
                                {t('Buy Now')}
                              </Button>
                            )}
                          </div>
                        </Group>
                      </Card>
                    );
                  })}
                {(!!creditsData?.['property_photography']?.available >= 1 ||
                  !!creditsData?.['property_videography']?.available >= 1) && (
                  <DateSelect
                    className="w-100"
                    label={t('Please choose the date and time for these services')}
                    onChange={(date) => {
                      if (date) {
                        setSelectedDateAndTime((prevState) => ({
                          ...prevState,
                          date: { value: dayjs(date).toString(), error: '' },
                        }));
                      } else {
                        setSelectedDateAndTime({ type: '25', date: { value: null, error: '' } });
                      }
                    }}
                    errorMsg={selectedDateAndTime?.date?.error}
                    groupTemplate={isMobile ? '1fr' : '188px 1fr'}
                    labelProps={{ className: 'text-muted', style: { alignSelf: 'center' } }}
                    disabledDate={(current) => current && current < moment().endOf('day')}
                    showNow={false}
                    pickerStyle={{ width: '100%' }}
                    placeholder={t('Select desired date and time')}
                  />
                )}
              </Group>
            </>
          )}
        </>
      </ConfirmationModal>
    </>
  );
});
