import tenantData from '@data';
import { Form, Skeleton } from 'antd';
import dayjs from 'dayjs';
import moment from 'moment';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Checkbox, DateSelect, Group, Heading, Icon, RadioButtons, Switch } from '../../../../../components/common';
import { BasicFormWrapper } from '../../../../../container/styled';
import { useLazyGetCreditDeductionQuery } from '../../../../../apis/quotaCredits';
import { HasVerifiedCheck, JeffiContainerStyled } from './styled';

export const JeffiDetail = forwardRef((props, ref) => {
  const { t } = useTranslation();
  const { listing, isMobile } = props;
  const PHOTOGRAPHY_ID = 13;
  const VIDEOGRAPHY_ID = 14;

  const [isOn, setIsOn] = useState(false);
  const [checked, setChecked] = useState(false);
  const [credits, setCredits] = useState(null);
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({ type: VIDEOGRAPHY_ID, date: { value: null, error: '' } });

  const list = [
    { id: PHOTOGRAPHY_ID, value: PHOTOGRAPHY_ID, label: t('Photography'), name: 'Photography' },
    { id: VIDEOGRAPHY_ID, value: VIDEOGRAPHY_ID, label: t('Videography'), name: 'Videography' },
  ];

  useImperativeHandle(ref, () => ({
    getSelectionAndDate() {
      return !!credits?.available >= 1
        ? !!checked
          ? {
              request_date: dayjs(values?.date?.value)?.format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
              product_id: [VIDEOGRAPHY_ID],
              is_premium: 1,
            }
          : {}
        : isOn
          ? {
              request_date: dayjs(values?.date?.value)?.format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
              product_id: [values.type],
              is_premium: 0,
            }
          : {};
    },
  }));

  useEffect(() => {
    fetchCreditsDetails();
  }, []);

  const [getCreditDeduction] = useLazyGetCreditDeductionQuery();

  const fetchCreditsDetails = async () => {
    setLoading(true);
    const response = await getCreditDeduction({
      platform: 'zameen',
      data: {
        listing_id: listing?.id,
        product_id: 14,
        subject_id: listing?.listingOwner?.id,
      },
    });
    if (response) {
      setLoading(false);
      if (!response?.error) {
        setCredits(response?.zameen);
        setChecked(!!response?.zameen?.available);
      }
    }
  };

  return loading ? (
    <>
      <Skeleton active type="paragraph"></Skeleton>
      <Skeleton active type="paragraph"></Skeleton>
    </>
  ) : !!credits?.available >= 1 ? (
    <>
      {' '}
      {tenantData.products
        ?.filter((e) => e?.id == VIDEOGRAPHY_ID)
        ?.map((product) => {
          return (
            <Group
              className="px-24 py-16"
              style={{ margin: '0 -24px -24px', backgroundColor: '#fafafa', borderTop: '1px solid #f1f2f2' }}
            >
              <Group template="auto 1fr auto">
                <HasVerifiedCheck style={{ alignSelf: 'start' }}>
                  <Icon {...product?.iconProps} icon="HiVideoCamera" styled size="2rem" />
                  <Icon className="icon-check" icon="HiCheck" />
                </HasVerifiedCheck>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <Heading as="h5" style={{ fontSize: 16 }}>
                    Get Zameen {product?.title}
                  </Heading>
                  <div className="text-muted mb-4">
                    {t('Zameen.com provides a special videography service for properties with Super Hot Listings.')}
                  </div>
                  <div>
                    {t('Available Credits')}: {credits?.available}
                  </div>
                </div>
                <Checkbox value={checked} onChange={() => setChecked((prev) => !prev)} />
              </Group>
              <div>
                <DateSelect
                  className="w-100"
                  label={t('Please choose the date and time for these services')}
                  onChange={(date) => {
                    setValues((prevState) => ({ ...prevState, date: { value: dayjs(date).toString(), error: '' } }));
                  }}
                  errorMsg={values?.date?.error}
                  groupTemplate={isMobile ? '1fr' : '188px 1fr'}
                  labelProps={{ className: 'text-muted', style: { alignSelf: 'center' } }}
                  disabledDate={(current) => current && current < moment().endOf('day')}
                  showNow={false}
                  pickerStyle={{ width: '100%' }}
                  placeholder={t('Select desired date and time')}
                />
              </div>
            </Group>
          );
        })}
    </>
  ) : (
    <JeffiContainerStyled>
      <strong>{t('Free photography and videography service')}</strong>
      <p className="mt-20 mb-20 color-gray-dark">
        {t(
          'Zameen.com provides a special photograph and videography service for your properties with Super Hot Listings.Please choose which of these or both would you like to avail.',
        )}
      </p>
      <BasicFormWrapper>
        <Form.Item>
          <Switch value={isOn} onChange={(checked) => setIsOn(checked)} label={t('I require these services')} />
        </Form.Item>
        <Form.Item>
          <RadioButtons
            label={t('Please select service required')}
            buttonList={list}
            shape="round"
            valueKey="value"
            value={isOn && values.type}
            handleChange={(e) => {
              setValues((prevState) => ({ ...prevState, type: e.target.value }));
            }}
            disabled={!isOn}
          />
        </Form.Item>
        <Form.Item>
          <DateSelect
            label={t('Please choose the date and time for these services')}
            onChange={(date) => {
              setValues((prevState) => ({ ...prevState, date: { value: dayjs(date).toString(), error: '' } }));
            }}
            errorMsg={values.date.error}
            groupTemplate={isMobile ? '1fr' : '188px 1fr'}
            disabled={!isOn}
            labelProps={{ style: { alignSelf: 'center' } }}
            disabledDate={(current) => current && current < moment().endOf('day')}
            showNow={false}
          />
        </Form.Item>
      </BasicFormWrapper>
    </JeffiContainerStyled>
  );
});
