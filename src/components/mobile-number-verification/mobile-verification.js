import tenantConstants from '@constants';
import tenantTheme from '@theme';
import { Typography } from 'antd';
import cx from 'clsx';
import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import 'react-phone-number-input/style.css';
import { useSelector, useDispatch } from 'react-redux';
import { Button, ErrorMessage, Group, Icon } from '../common';
import Label from '../common/Label/Label';
import { IconStyled } from '../common/icon/IconStyled';
import OtpVerificationModal from '../otp-verification-modal/otp-verification-modal';
import { PhoneInputStyle } from '../phone-input/styled';
import { useLazyGetUserSettingsDetailQuery } from '../../apis/user';
import { setAppUser } from '../../store/appSlice';

const MobileVerification = (props) => {
  const {
    name,
    label,
    isOptional = false,
    labelProps,
    className,
    errorMsg,
    horizontal,
    labelClassName,
    //loading,
    errorClassName,
    placeholder,
    id,
    value,
    containerClassName,
    onChange,
    onBlur,
    inputContainerClass,
    defaultCountry,
    labelIcon,
    addSpacing,
    index,
    touched,
    addMobileField,
    removeMobileField,
    userType,
    verifyNumber,
    isUserVerified,
    phoneNumber,
    extra,
    userId,
    canVerify = true,
    ...rest
  } = props;

  const { t } = useTranslation();
  const otpVerifyRef = useRef();
  const [getUserSettingsDetail] = useLazyGetUserSettingsDetailQuery();

  const { rtl, isMobile } = useSelector((state) => state.app.AppConfig);
  const loggedInUser = useSelector((state) => state.app.loginUser?.user);
  const [otpLoading, setOtpLoading] = useState(false);
  const dispatch = useDispatch();
  const fetchUserData = async () => {
    setOtpLoading(false);
    const response = await getUserSettingsDetail({ id: loggedInUser?.id });
    if (response) {
      if (response.error) {
        notification.error(response.error);
      } else {
        dispatch(
          setAppUser({
            mobile: response?.data?.mobile,
            is_mobile_verified: response?.data?.is_mobile_verified,
          }),
        );
      }
    }
  };
  const onClickVerify = () => {
    setOtpLoading(true);
    otpVerifyRef.current.onVerify(value);
  };

  const renderLabel = () => {
    return label ? (
      <Label htmlFor={name} {...labelProps}>
        {label}{' '}
        {isOptional && (
          <span style={{ color: tenantTheme.gray550, fontSize: isMobile ? '10px' : '12px' }}>({t('Optional')})</span>
        )}
      </Label>
    ) : null;
  };

  const renderInput = (number, index) => {
    return (
      <PhoneInputStyle
        value={number}
        onChange={(e) => onChange(e, index)}
        onBlur={() => onBlur && onBlur(index)}
        defaultCountry={defaultCountry}
        placeholder={placeholder}
        international
        className={rtl && 'rtlPhone'}
        {...rest}
      />
    );
  };

  const stringFieldInner = (
    <Group className={cx(labelIcon && 'w-100', rest.className, containerClassName)} template="initial" gap="8px" id={id}>
      {renderLabel()}
      <div className={cx(inputContainerClass)}>
        <Group template={`${!isMobile ? '1fr' : '1fr auto'}`} gap={`${!isMobile ? '8px' : '0'}`}>
          {renderInput(value)}
        </Group>
        {tenantConstants.KC_ENABLED ? (
          userType === 'User' ? (
            value == loggedInUser?.mobile && loggedInUser?.is_mobile_verified ? (
              <>
                <IconStyled
                  style={{ position: 'absolute', insetInlineEnd: 2, bottom: 5, '--icon-bg-color': 'transparent' }}
                >
                  <Icon icon="PiSealCheckFill" color={tenantTheme['link-color']} />
                </IconStyled>
              </>
            ) : !!tenantConstants.PHONE_REGEX.test(value) && canVerify ? (
              <Button
                type="link"
                onClick={onClickVerify}
                className="m-0"
                style={{ position: 'absolute', insetInlineEnd: 2, top: isMobile ? 32 : 35 }}
                loading={otpLoading}
              >
                {t('Verify')}
              </Button>
            ) : null
          ) : userType == 'Agency' && isUserVerified ? (
            <>
              <IconStyled
                style={{ position: 'absolute', insetInlineEnd: 2, bottom: 5, '--icon-bg-color': 'transparent' }}
              >
                <Icon icon="PiSealCheckFill" color={tenantTheme['link-color']} />
              </IconStyled>
            </>
          ) : (
            <></>
          )
        ) : null}
      </div>
      {!!errorMsg && <ErrorMessage message={errorMsg} />}
    </Group>
  );

  return (
    <>
      {typeof value === 'string' ? (
        labelIcon ? (
          <Group template="max-content auto" gap="16px">
            <IconStyled>
              <Icon icon={labelIcon} />
            </IconStyled>
            {stringFieldInner}
          </Group>
        ) : (
          <>
            {addSpacing && <div style={{ width: 35.2 }} />}
            {stringFieldInner}
          </>
        )
      ) : (
        value?.map((mobile, index) => {
          return (
            <React.Fragment key={index}>
              {index === 0 && labelIcon && (
                <IconStyled>
                  <Icon icon={labelIcon} />
                </IconStyled>
              )}
              {index !== 0 && labelIcon && <div style={{ width: 35.2 }} />}
              <Group className={(rest.className, containerClassName)} template="initial" gap="8px" id={id}>
                {index === 0 && renderLabel()}
                <div className={cx(inputContainerClass)}>
                  <Group
                    template={`
                      ${
                        isMobile ? '1fr auto' : index > 0 ? '1fr auto' : index + 1 === value.length ? '1fr auto' : '1fr'
                      }`}
                    gap={`${!isMobile || index > 0 || index + 1 === value?.length ? '8px' : '0'}`}
                  >
                    {renderInput(mobile, index)}
                  </Group>
                  {tenantConstants.KC_ENABLED ? (
                    userType === 'User' ? (
                      isUserVerified ? (
                        <>
                          <IconStyled
                            style={{
                              position: 'absolute',
                              insetInlineEnd: 2,
                              bottom: 5,
                              '--icon-bg-color': 'transparent',
                            }}
                          >
                            <Icon icon="PiSealCheckFill" color={tenantTheme['link-color']} />
                          </IconStyled>
                        </>
                      ) : (
                        <Button
                          type="link"
                          onClick={otpVerifyRef.current.onVerify}
                          className="m-0"
                          style={{ position: 'absolute', insetInlineEnd: 2, top: isMobile ? 32 : 35 }}
                          loading={otpLoading}
                        >
                          {t('Verify')}
                        </Button>
                      )
                    ) : userType == 'Agency' && isUserVerified ? (
                      <>
                        <IconStyled
                          style={{
                            position: 'absolute',
                            insetInlineEnd: 2,
                            bottom: 5,
                            '--icon-bg-color': 'transparent',
                          }}
                        >
                          <Icon icon="PiSealCheckFill" color={tenantTheme['link-color']} />
                        </IconStyled>
                      </>
                    ) : (
                      <></>
                    )
                  ) : null}

                  {!!touched?.[`${index}`] && !!errorMsg?.[index] && <ErrorMessage message={errorMsg?.[index]} />}
                </div>
              </Group>
            </React.Fragment>
          );
        })
      )}

      <OtpVerificationModal
        ref={otpVerifyRef}
        value={value}
        onSuccess={fetchUserData}
        onCancelModal={() => setOtpLoading(false)}
        onFail={() => setOtpLoading(false)}
      />
    </>
  );
};

// MobileVerification.propTypes = {
//   name: PropTypes.string.isRequired,
//   label: PropTypes.string,
//   labelProps: PropTypes.object,
//   className: PropTypes.string,
//   errorMsg: PropTypes.string,
//   horizontal: PropTypes.bool,
//   labelClassName: PropTypes.string,
//   loading: PropTypes.bool,
//   errorClassName: PropTypes.string,
//   placeholder: PropTypes.string,
//   id: PropTypes.string,
//   value: PropTypes.string,
//   containerClassName: PropTypes.string,
//   inputContainerClass: PropTypes.string,
//   defaultCountry: PropTypes.string,
//   onChange: PropTypes.func,
//   labelIcon: PropTypes.string,
//   type: PropTypes.string,
//   verifyNumber: PropTypes.bool,
// };

export default MobileVerification;
