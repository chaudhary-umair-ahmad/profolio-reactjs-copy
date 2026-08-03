import tenantApi from '@api';
import tenantTheme from '@theme';
import React, { useState } from 'react';
import { Button, Flex, Heading, notification } from '../common';
import { TextField } from '../../container/pages/lms/styled';
import cx from 'clsx';
import { useSelector } from 'react-redux';
import { t } from 'i18next';
import { useUpdateLeadNameMutation } from '../../apis/lms';
import { addNameClickEvent } from '../../services/analyticsService';
const LeadNameField = (props) => {
  const { leadData, refetchDetail = () => {}, clientId, leadId } = props;
  const [leadName, setLeadName] = useState(null);
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const [updateLeadName, { isLoading: leadNameUpdateLoading }] = useUpdateLeadNameMutation();
  const user = useSelector((state) => state.app.loginUser?.user);

  const onClick = async () => {
    addNameClickEvent(user, leadId);
    const response = await updateLeadName({
      leadId,
      body: { leadName, clientId },
    });
    if (response) {
      if (response.error) {
        notification.error(response.error);
      } else {
        notification.success(t('Name Updated Successfully!'));
        setLeadName(null);
        refetchDetail(leadId);
      }
    }
  };
  return (
    <>
      {leadData?.name ? (
        <Heading
          as={isMobile ? 'h5' : 'h4'}
          style={{ fontSize: isMobile && '16px' }}
          className={cx('fw-700', isMobile ? 'mb-4' : 'mb-12')}
        >
          {leadData?.name}
        </Heading>
      ) : (
        <Flex className="w-100 mb-8">
          <TextField
            style={{ height: '38px' }}
            className={isMobile && 'w-100'}
            name="lead_name"
            type="string"
            placeholder={t('Add Name')}
            value={leadName}
            onChange={(e) => setLeadName(e.target.value)}
            allowClear
            suffix={
              <Button
                onClick={onClick}
                icon="HiCheck"
                iconSize="12px"
                type="primaryOutlined"
                size="small"
                className="p-0"
                style={{
                  backgroundColor: tenantTheme['primary-light-3'],
                  border: 'none',
                  '--ant-control-height-sm': '20px',
                  borderRadius: '50%',
                }}
                loading={leadNameUpdateLoading}
                disabled={!leadName?.length || leadNameUpdateLoading}
              />
            }
          />
        </Flex>
      )}
    </>
  );
};

export default LeadNameField;
