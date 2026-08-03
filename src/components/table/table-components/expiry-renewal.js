import tenantData from '@data';
import tenantTheme from '@theme';
import tenantUtils from '@utils';
import { t } from 'i18next';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { TIME_DATE_FORMAT } from '../../../constants/formats';
import { useGetLocation } from '../../../hooks';
import { getTimeDateString } from '../../../utility/date';
import { Flex, Icon, Label, Modal, notification, Popover, Switch } from '../../common';
import { SwitchWrapped } from '../../styled';
import tenantConstants from '@constants';
import { useUpdateAutoRenewMutation } from '../../../apis/listings';
import { autoRenewalClickEvent } from '../../../services/analyticsService';
import { useSelector } from 'react-redux';

export const ExpiryRenewal = (props) => {
  const location = useGetLocation();
  const { data = [], auto_renewable_item = {}, property_id } = props;
  const { expiry_date, posted_on } = data?.[0] || {};
  const [updateAutoRenew] = useUpdateAutoRenewMutation();

  const [loading, setLoading] = useState(false);
  const [modalVisible, setIsModalVisible] = useState(false);
  const dispatch = useDispatch();

  const dateLabelMapping = tenantUtils.getDateFieldsByStatus(data?.[0]?.status?.slug, auto_renewable_item?.isApplied);
  const dateLabels = Object.keys(dateLabelMapping);
  const { user } = useSelector((state) => state.app.loginUser);

  const updateExpiryRenewal = async (productId) => {
    const response = await updateAutoRenew({
      autoRenewId: auto_renewable_item?.id,
      listingId: property_id,
      productId: productId,
    });
    if (response) {
      setLoading(false);
      if (response?.error) {
        notification.error(response?.error);
      } else {
        setIsModalVisible(false);
      }
    }
  };
  const onChange = () => {
    setIsModalVisible(true);
  };
  
  return (
    <div>
      <div className="mb-8">
        {dateLabels[0] && (
          <Flex gap="4px">
            <div className="text-muted">{t(dateLabels[0])}</div>

            <div className="text-default fw-600">
              {getTimeDateString(data?.[0]?.[dateLabelMapping[dateLabels[0]]]) || '-'}
            </div>
            <Popover
              content={<div>{getTimeDateString(data?.[0]?.[dateLabelMapping[dateLabels[0]]], TIME_DATE_FORMAT)}</div>}
              action="hover"
            >
              <>
                <Icon icon="AiOutlineInfoCircle" size="1em" color={tenantTheme['primary-color']} />
              </>
            </Popover>
          </Flex>
        )}

        {!tenantConstants?.HIDE_AUTO_RENEWAL && dateLabels[1] && (
          <Flex gap="4px">
            <div className="text-muted">
              <div className="text-muted">{t(dateLabels[1])}</div>
            </div>
            <div className="text-default fw-600">
              {getTimeDateString(data?.[0]?.[dateLabelMapping[dateLabels[1]]]) || '-'}
            </div>
          </Flex>
        )}
      </div>
      {!tenantConstants?.HIDE_TIMELINE_DATA && (
        <>
          <SwitchWrapped align="center">
            <Label htmlFor="auto-renew" className="fz-12" color={tenantTheme['primary-color']}>
              {t('AUTO-RENEW')}
            </Label>
            <Switch
              switchOnly
              name="auto-renew"
              value={auto_renewable_item?.isApplied}
              onChange={onChange}
              loading={loading}
              onClick={() => {
                autoRenewalClickEvent(user, data?.[0]?.status?.label);
              }}
            />
          </SwitchWrapped>
          <Modal
            title={`${auto_renewable_item?.isApplied ? t('Disable') : t('Enable')} ${t('Auto Renew')}`}
            visible={modalVisible}
            onOk={() => {
              setLoading(true);
              updateExpiryRenewal(tenantData.getListingActions('basic-listing')?.id);
            }}
            onCancel={() => {
              setIsModalVisible(false);
            }}
            loading={loading}
          >
            {!auto_renewable_item?.isApplied
              ? t(
                  "By turning the 'Auto-Renew' feature ON. The system will automatically renew the listing when it reaches its expiry, if you have enough credits available",
                )
              : t('Are you sure you want to disable auto renew for this listing')}
          </Modal>
        </>
      )}
    </div>
  );
};
