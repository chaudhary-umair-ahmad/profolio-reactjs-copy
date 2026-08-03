import { Col, Row } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import tenantTheme from '@theme';
import {
  useGetPublicEventDetailsQuery,
  useCreateEventBookingMutation,
  useUpdateUserEventInfoMutation,
} from '../../../apis/common';
import OtpVerificationModal from '../../../components/otp-verification-modal/otp-verification-modal';
import {
  pageViewCheckoutEvent,
  checkoutPayConfirmEvent,
  clickPayNowEvent,
  otpCompletedEvent,
  otpPopupClosedEvent,
} from '../../../services/analyticsService';
import { useUpdatePaymentMutation, useCreateCartMutation } from '../../../apis/cart';
import { Card, notification, Spinner, EmptyState } from '../../../components/common';
import ContactDetailsForm from '../../../components/checkout/ContactDetailsForm';
import EventTicketSummary from '../../../components/prop-shop/EventTicketSummary';
import { cookieDomain, getBaseURL, getClassifiedBaseURL, isDevelopment } from '../../../utility/env';
import { mapQueryStringToFilterObject } from '../../../utility/urlQuery';
import { useLazyGetUserDetailFromTokenQuery } from '../../../apis/user';
import usePaymentMethod from '../../../hooks/usePaymentMethod';
import {
  getErrorString,
  isWebView,
  getLocalizedFieldName,
  isSurgeUpdatePaymentSuccessful,
} from '../../../utility/utility';
import { KC_REQUESTS } from '../../../keycloak/requests';
import { setAppTokens } from '../../../store/authSlice';
import { CART_INITIAL_STATE } from './constants';
import { Main } from '../../styled';
import { useAppAuthentication, useGetLocation } from '../../../hooks';
import PaymentMethods from './paymentMethods';
import { getLocaleForURL } from '../../../utility/language';
import TenantComponents from '@components';
import { PAYMENT_METHODS } from '../../../constants/constants';

/**
 * The payment postMessage is emitted by our own payment-return page (served from
 * getBaseURL(), same origin as the app) after the gateway 3DS redirect. Only
 * trust messages from that origin / the classified origin so a framing or opener
 * window cannot spoof a "success" event and drive order completion.
 */
const isTrustedPaymentOrigin = (origin) => {
  if (!origin) return false;
  const allowed = [window.location.origin];
  [getBaseURL(), getClassifiedBaseURL()].forEach((base) => {
    try {
      allowed.push(new URL(base).origin);
    } catch {
      /* base URL unset or invalid */
    }
  });
  return allowed.includes(origin);
};

const EventCheckout = () => {
  const [creditCardData, setCreditCardData] = useState(null);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [otpToken, setOtpToken] = useState(null);
  const [otpPhoneNumber, setOtpPhoneNumber] = useState(null);
  const [cartId, setCartId] = useState(null);
  const [bookingId, setBookingId] = useState(null);
  const [paymentFailureKey, setPaymentFailureKey] = useState(0);

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { search } = useGetLocation();
  const location = useLocation();

  const checkoutRef = useRef();
  const otpModalRef = useRef();
  const contactFormRef = useRef();

  const { isMobile, locale } = useSelector((state) => state.app.AppConfig);
  const user = useSelector((state) => state?.app?.loginUser?.user);

  const [cartData, setCartData] = useState(CART_INITIAL_STATE);

  const {
    event_id: eventId,
    order_id: orderId,
    paymentType,
    paymentChannel,
    paymentStatus,
  } = mapQueryStringToFilterObject(search)?.queryObj;

  const [updatePayment] = useUpdatePaymentMutation();
  const [createCart, { isLoading: isCreatingCart }] = useCreateCartMutation();
  const [createEventBooking, { isLoading: isCreatingBooking }] = useCreateEventBookingMutation();
  const [updateUserEventInfo, { isLoading: isUpdatingUser }] = useUpdateUserEventInfoMutation();
  const [fetchUserDetailFromToken] = useLazyGetUserDetailFromTokenQuery();
  const { onLogout } = useAppAuthentication();

  const {
    data: eventDetails,
    isLoading: eventDetailsLoading,
    error: eventDetailsError,
  } = useGetPublicEventDetailsQuery(eventId, {
    skip: !eventId,
  });

  const { paymentMethods, selectedMethod, handleChangeSelectedMethod } = usePaymentMethod(cartData?.available_channels);

  const interactedFrom = location.state?.interactedFrom;
  const purpose = location.state?.purpose;

  useEffect(() => {
    if (eventDetails?.event) {
      const event = eventDetails?.event;
      const fee = event?.fee || 0;
      const vatAmount = (fee * event?.event_vat) / 100;
      const totalAmount = fee + vatAmount;

      setCartData((prevCartData) => ({
        ...prevCartData,
        total: totalAmount,
        amount: totalAmount,
        total_amount: fee,
        discount: 0,
        available_channels: prevCartData?.available_channels?.map((channel) => ({
          ...channel,
          fee: 0,
          total_amount: totalAmount,
          net_amount: totalAmount,
        })),
      }));
    }
  }, [eventDetails]);

  useEffect(() => {
    if (user) pageViewCheckoutEvent(user, interactedFrom, cartData);
  }, [cartData, user, interactedFrom]);

  useEffect(() => {
    const handleCompleteOrder = (event) => {
      if (!isTrustedPaymentOrigin(event?.origin)) return;
      if (!!event?.data?.sessionId) {
        if (event?.data?.paymentType === 'success') {
          completeOrder(creditCardData?.order_id, event?.data?.paymentChannel, event?.data?.sessionId);
        } else {
          checkoutRef?.current?.setIframeModal && checkoutRef?.current?.setIframeModal(false);
          setButtonLoading(false);
          setPaymentFailureKey(prev => prev + 1);
          notification.error(t('Payment failed due to an error.'));
        }
      }
    };

    if (orderId && paymentType && paymentStatus !== 'EXPIRED' && paymentStatus !== 'REJECTED') {
      completeOrder(orderId, paymentChannel);
    } else if (orderId || cartId) {
      window.addEventListener('message', handleCompleteOrder, false);
    }

    return () => window.removeEventListener('message', handleCompleteOrder, false);
  }, [creditCardData?.order_id, orderId, paymentType, paymentChannel, cartId]);

  const redirectOnSuccess = (_, booking) => {
    const updatedBookingId = booking?.id || bookingId;
    const locale = getLocaleForURL();

    if (eventDetails?.event && updatedBookingId) {
      const event = eventDetails?.event;
      const eventName = event?.name?.toLowerCase();
      const redirectUrl = `${getClassifiedBaseURL()}${locale}/bayut-academy/events/${eventName}-${event?.id}?booking_id=${updatedBookingId}`;

      window.location.href = redirectUrl;
    }
  };

  const completeOrder = async (paymentId, channel, session) => {
    try {
      const response = await updatePayment({
        data: {
          ...(channel === 'checkout' ? { 'cko-session-id': session, order_id: paymentId } : { order_id: paymentId }),
        },
        paymentUrl: channel === 'checkout' ? 'checkout' : paymentChannel,
      });

      checkoutRef?.current?.setIframeModal && checkoutRef?.current?.setIframeModal(false);

      if (!isSurgeUpdatePaymentSuccessful(response)) {
        if (paymentStatus == 'EXPIRED') {
          notification.error(t('You aborted the payment. Please retry or choose another payment method.'));
        } else if (paymentStatus == 'REJECTED') {
          notification.error(
            t(
              'Sorry, Tabby is unable to approve this purchase. Please use an alternative payment method for your order',
            ),
          );
        } else {
          notification.error(getErrorString(response) || t('Payment failed. Please try again.'));
        }

        setButtonLoading(false);
        setPaymentFailureKey(prev => prev + 1);
        return;
      }

      const bookingPayload = {
        booking: {
          event_id: eventId,
        },
      };

      const bookingResponse = await createEventBooking(bookingPayload).unwrap();

      if (bookingResponse?.error) {
        setButtonLoading(false);
        setPaymentFailureKey(prev => prev + 1);
        notification.error(getErrorString(bookingResponse) || t('Payment failed. Please try again.'));
        return;
      }

      setBookingId(bookingResponse?.booking?.id);

      if (search.includes('redirectUrl')) {
        const redirectUrl = new URLSearchParams(search).get('redirectUrl');
        window.location.href = redirectUrl;
      } else {
        checkoutPayConfirmEvent(
          user,
          interactedFrom,
          cartData,
          selectedMethod?.label,
          response?.data?.success,
          purpose,
        );
        redirectOnSuccess(response?.data?.response?.payment, bookingResponse?.booking);
      }
    } catch (error) {
      setButtonLoading(false);
      setPaymentFailureKey(prev => prev + 1);
      notification.error(getErrorString(error) || t('Failed to complete payment process'));
      return;
    } finally {
      setButtonLoading(false);
    }
  };

  const onCheckOut = async () => {
    const cookieRemovalOptions = {
      domain: cookieDomain,
      path: '/',
      secure: true,
      sameSite: 'Lax',
    };

    Cookies.remove('kc_access_token', cookieRemovalOptions);
    Cookies.remove('kc_id_token', cookieRemovalOptions);
    Cookies.remove('kc_refresh_token', cookieRemovalOptions);
    if (!isDevelopment) await onLogout({ redirection: false });

    if (selectedMethod?.component === PAYMENT_METHODS.CREDIT_DEBIT_WITH_CHECKOUT) {
      if (checkoutRef?.current?.isDataComplete && !checkoutRef?.current?.isDataComplete()) {
        notification.error(t('Please enter complete card details before proceeding'));
        return;
      }
    }

    if (selectedMethod?.component === PAYMENT_METHODS.TABBY) {
      if (checkoutRef?.current?.isDataComplete && !checkoutRef?.current?.isDataComplete()) {
        notification.error(t('Please select date of birth before proceeding'));
        return;
      }
    }

    setCreditCardData(null);
    setBookingId(null);
    setCartId(null);

    if (contactFormRef.current) {
      const validationResult = await contactFormRef.current.validateForm();
      if (!validationResult.isValid) return;

      await initiateOtpVerification(validationResult?.values?.phone);
    }
  };

  const initiateOtpVerification = async (phoneNumber) => {
    try {
      setButtonLoading(true);

      const initiateResponse = await KC_REQUESTS.passwordless_login_initiate.request(phoneNumber);
      if (initiateResponse?.error) {
        notification.error(t(initiateResponse?.error_description || initiateResponse?.error));
        setButtonLoading(false);
        return;
      }

      const challengeResponse = await KC_REQUESTS.passwordless_login_generate_challenge.request(phoneNumber);
      if (challengeResponse?.error) {
        notification.error(t(challengeResponse?.error_description || challengeResponse?.error));
        setButtonLoading(false);
        return;
      }

      setOtpToken(challengeResponse?.token);
      setOtpPhoneNumber(phoneNumber);

      if (otpModalRef.current?.showModal) {
        otpModalRef.current.showModal('mobile');
      }

      setButtonLoading(false);
    } catch (error) {
      notification.error(getErrorString(error) || t('Failed to send OTP. Please try again.'));
      setButtonLoading(false);
    }
  };

  const handleOtpSuccess = async () => {
    setButtonLoading(true);

    try {
      const response = await fetchUserDetailFromToken();
      const user = response?.data;

      otpCompletedEvent(user, 'event-checkout', locale);

      const contactDetails = contactFormRef.current?.getValues();

      const userUpdatePayload = {
        user: {
          [getLocalizedFieldName('name', locale)]: contactDetails?.name,
          email: contactDetails?.email,
          gender: contactDetails?.gender,
          age_group: contactDetails?.age,
          phone: contactDetails?.phone,
          additional_info: {
            participant_license: contactDetails?.license,
          },
        },
      };

      const userUpdateResponse = await updateUserEventInfo({
        userId: user?.id,
        userData: userUpdatePayload,
      });

      if (userUpdateResponse?.error) {
        setButtonLoading(false);
        notification.error(
          getErrorString(userUpdateResponse) || t('Failed to update user event info. Please try again.'),
        );
        return;
      }

      const cartPayload = {
        cart: {
          source: 'Bayut Academy',
          requestable_id: parseInt(eventId),
          requestable_type: 'Event',
        },
      };

      const cartResult = await createCart(cartPayload).unwrap();

      if (cartResult && !cartResult?.error) {
        clickPayNowEvent(user, 'event-checkout', selectedMethod?.label, locale);
        setCartId(cartResult?.cart?.id);
        setTimeout(() => {
          if (checkoutRef?.current?.onCheckOut) {
            checkoutRef?.current?.onCheckOut();
          }
        }, 500);
      } else {
        setButtonLoading(false);
        notification.error(getErrorString(cartResult) || t('Failed to create cart. Please try again.'));
      }
    } catch (error) {
      setButtonLoading(false);
      notification.error(getErrorString(error) || t('Failed to create cart. Please try again.'));
    }
  };

  const handleOtpFail = () => {
    setButtonLoading(false);
  };

  const handleOtpCancel = () => {
    setButtonLoading(false);

    user && otpPopupClosedEvent(user, 'event-checkout', locale);
  };

  const verifyOtpCode = async (phoneNumber, otpCode) => {
    const response = await KC_REQUESTS.passwordless_login_verify.request(phoneNumber, otpToken, otpCode);

    if (response?.access_token && response?.id_token && response?.refresh_token) {
      const now = new Date();
      const accessTokenExpires = new Date(now.getTime() + response.expires_in * 1000);
      const refreshTokenExpires = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

      const cookieOptions = {
        domain: cookieDomain,
        path: '/',
        secure: true,
        sameSite: 'Lax',
        expires: accessTokenExpires,
      };

      const refreshTokenOptions = {
        domain: cookieDomain,
        path: '/',
        secure: true,
        sameSite: 'Lax',
        expires: refreshTokenExpires,
      };

      Cookies.set('kc_access_token', response.access_token, cookieOptions);
      Cookies.set('kc_id_token', response.id_token, cookieOptions);
      Cookies.set('kc_refresh_token', response.refresh_token, refreshTokenOptions);

      dispatch(
        setAppTokens({
          token: response.access_token,
          idToken: response.id_token,
          refreshToken: response.refresh_token,
          authenticated: true,
          initialized: true,
        }),
      );
    }

    return response;
  };

  return (
    <>
      {!isWebView() && (
        <TenantComponents.NavBar
          fullWidth
          hideLoginButton
          hideSavedSearches
          hideFavouriteProperties
          hideFloatingPostAdButton
          hideMyListings
          hidePostAd
          hideMobileNavBarDrawer
          hideCurrencyConverter
        />
      )}
      <Main style={{ backgroundColor: tenantTheme['layout-body-background'] }}>
        <div className={'cartWraper'}>
          {!eventId ? (
            <EmptyState
              title={t('Event Not Found')}
              message={t('The event ID is missing from the URL. Please check the link and try again.')}
            />
          ) : eventDetailsError ? (
            <EmptyState
              title={t('Event Not Found')}
              message={t('The event with the provided ID could not be found. Please check the link and try again.')}
            />
          ) : eventDetailsLoading ? (
            <Spinner type="full" />
          ) : (
            <Row gutter={isMobile ? [0, 8] : 32} justify="center">
              <Col xxl={11} lg={16} xs={24}>
                <ContactDetailsForm ref={contactFormRef} disableFields={false} targetGender={eventDetails?.event?.target_gender} />
                <PaymentMethods
                  key={paymentFailureKey}
                  checkoutRef={checkoutRef}
                  isMobile={isMobile}
                  cartId={cartId}
                  orderId={orderId}
                  setSuccessModalData={redirectOnSuccess}
                  setPaymentButtonLoading={setButtonLoading}
                  cartData={cartData}
                  creditCardData={creditCardData}
                  setCreditCardData={setCreditCardData}
                  paymentMethods={paymentMethods}
                  selectedMethod={selectedMethod}
                  handleChangeSelectedMethod={handleChangeSelectedMethod}
                  eventId={eventId}
                  disablePackagesRedirect={true}
                  disableRetryWithPayment
                />
              </Col>

              <Col xxl={7} lg={8} xs={24}>
                <Card bodyStyle={{ padding: isMobile ? 10 : 20 }}>
                  <EventTicketSummary
                    checkoutButtonText={t('Pay Now')}
                    handleCheckout={onCheckOut}
                    proceedButtonLoading={buttonLoading || isCreatingCart || isCreatingBooking || isUpdatingUser}
                    eventData={{
                      title: eventDetails?.event?.event_category?.name,
                      title_l1: eventDetails?.event?.event_category?.name_l1,
                      description: eventDetails?.event?.name,
                      description_l1: eventDetails?.event?.name_l1,
                      image: eventDetails?.event?.images?.[0]?.full,
                      startTime: eventDetails?.event?.event_sessions?.[0]?.start_time,
                      endTime: eventDetails?.event?.event_sessions?.[0]?.end_time,
                      venue: eventDetails?.event?.event_sessions?.[0]?.venue?.name,
                      venue_l1: eventDetails?.event?.event_sessions?.[0]?.venue?.name_l1,
                      ticketPrice: eventDetails?.event?.fee,
                      vatPercentage: eventDetails?.event?.event_vat,
                    }}
                    showIcon={false}
                    loading={eventDetailsLoading}
                  />
                </Card>
              </Col>
            </Row>
          )}
        </div>
        <OtpVerificationModal
          ref={otpModalRef}
          value={otpPhoneNumber}
          onSuccess={handleOtpSuccess}
          onFail={handleOtpFail}
          onCancelModal={handleOtpCancel}
          otpFor="mobile"
          okText={t('Verify & Pay')}
          customVerifyFunction={verifyOtpCode}
        />
      </Main>
    </>
  );
};

export default EventCheckout;
