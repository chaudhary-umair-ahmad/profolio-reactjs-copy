import tenantTheme from '@theme';
import { List } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, DrawerModal, Flex, Icon, Tag, TextInput } from '../../../../components/common';
import MobileVerification from '../../../../components/mobile-number-verification/mobile-verification';
import OtpVerificationModal from '../../../../components/otp-verification-modal/otp-verification-modal';
import { regex } from '../../../../constants/regex';
import { ListItemStyled } from './styled';
import tenantConstants from '@constants';
import RenderTextLtr from '../../../../components/render-text/render-text';

const ProfileKCForm = ({ fields, values, fetchUserData }) => {
  const { t } = useTranslation();
  const otpVerifyRef = useRef();

  const [selectedItem, setSelectedItem] = useState(null);
  const [value, setValue] = useState(null);
  const [error, setError] = useState(null);
  const [valueSaveLoading, setValueSaveLoading] = useState(false);

  useEffect(() => {
    if (selectedItem) {
      setValue(values?.[selectedItem?.key] || null);
    }
  }, [selectedItem]);

  const handleBlur = () => {
    if (!value) {
      setValueSaveLoading(false);
      setError(t(`${selectedItem?.props?.label} is required`));
    } else {
      const validate =
        selectedItem?.key == 'email'
          ? regex.emailRegex.test(value)
          : selectedItem?.key == 'mobile' && tenantConstants.PHONE_REGEX?.test(value);
      if (!validate) {
        setValueSaveLoading(false);
        selectedItem?.key == 'email' ? setError(t('Invalid email')) : setError(t('Invalid phone'));
      } else {
        setError(null);
      }
    }
  };

  const handleSubmitKcForm = async (val) => {
    setValueSaveLoading(true);
    otpVerifyRef.current.onVerify(value ?? val?.value, val?.key || selectedItem?.key);
  };

  const onSuccessVerification = () => {
    fetchUserData();
    setValueSaveLoading(false);
    setSelectedItem(null);
    setValue(null);
    setError(null);
  };

  const getActions = (item) => {
    let actions = [
      <Button
        size="small"
        className="px-0"
        type="link"
        style={{ '--btn-content-color': `${tenantTheme['secondary-color']} !important` }}
        key="list-loadmore-edit"
        onClick={() => setSelectedItem(item)}
      >
        {values?.[item?.key] ? t('Edit') : t('Add')}
      </Button>,
    ];
    !!values?.[item?.key] &&
      !values?.[`is_${item?.key}_verified`] &&
      actions.unshift(
        <Button
          size="small"
          key="list-loadmore-edit"
          loading={valueSaveLoading}
          onClick={() => handleSubmitKcForm({ ...item, value: values?.[item?.key] })}
        >
          {t('Verify')}
        </Button>,
      );
    return actions;
  };

  return fields?.length ? (
    <div>
      <List>
        {fields.map((item) => {
          return (
            <ListItemStyled key={item?.key} actions={getActions(item)}>
              <List.Item.Meta
                title={t(item?.props?.label)}
                description={
                  <Flex align="center" gap="6px">
                    {values?.[item?.key] ? (
                      item?.key == 'mobile' ? (
                        <RenderTextLtr text={values?.[item?.key]} />
                      ) : (
                        values?.[item?.key]
                      )
                    ) : (
                      '-'
                    )}{' '}
                    {values?.[`is_${item?.key}_verified`] && (
                      <Flex as={Tag} inline gap="4px" color="blue" shape="round" size="12px">
                        <Icon icon="PiSealCheckFill" style={{ marginInlineStart: -4 }} />
                        {t('Verified')}
                      </Flex>
                    )}
                  </Flex>
                }
              />
            </ListItemStyled>
          );
        })}
      </List>
      <DrawerModal
        visible={!!selectedItem}
        onOk={() => {
          if (!error) handleSubmitKcForm();
        }}
        okText={t('Save')}
        loading={valueSaveLoading}
        onCancel={() => {
          setError(null);
          setValue(null);
          setSelectedItem(null);
        }}
      >
        {selectedItem?.type === 'input' ? (
          <TextInput
            name={selectedItem?.key}
            handleChange={(e) => setValue(e.target.value)}
            handleBlur={handleBlur}
            value={value}
            errorMsg={error}
            key={selectedItem?.key}
            {...selectedItem.props}
            label={t(selectedItem.props.label)}
            placeholder={t(selectedItem.props.placeholder)}
          />
        ) : (
          <MobileVerification
            id={selectedItem?.key}
            name={selectedItem?.key}
            value={value || ''}
            onChange={(val) => setValue(val)}
            errorMsg={error}
            onBlur={handleBlur}
            canVerify={false}
            {...(selectedItem?.props ? selectedItem.props : {})}
            label={t(selectedItem?.props?.label)}
          />
        )}
      </DrawerModal>

      <OtpVerificationModal
        ref={otpVerifyRef}
        value={value}
        otpFor={selectedItem?.key}
        onSuccess={onSuccessVerification}
        onCancelModal={() => setValueSaveLoading(false)}
        onFail={() => setValueSaveLoading(false)}
      />
    </div>
  ) : null;
};

export default ProfileKCForm;
