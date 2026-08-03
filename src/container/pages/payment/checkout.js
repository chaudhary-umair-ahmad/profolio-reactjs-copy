import tenantRoutes from '@routes';
import { Col, Row } from 'antd';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useGetCartQuery, useUpdatePaymentMutation } from '../../../apis/cart';
import SuccessfulPaymentModal from '../../../components/checkout/successfulPaymentModal';
import ContactDetailsForm from '../../../components/checkout/ContactDetailsForm';
import EventTicketSummary from '../../../components/prop-shop/EventTicketSummary';
import AdLicenseSuccessModal from '../../../components/checkout/adLicenseSuccessModal';
import { Button, Card, EmptyState, notification, Spinner } from '../../../components/common';
import Ordersummary from '../../../components/prop-shop/Ordersummary';
import { IllustrationEmptyCart, NetworkError } from '../../../components/svg';
import { Main } from '../../../container/styled';
import { useAppAuthentication, useGetLocation, useRouteNavigate } from '../../../hooks';
import usePaymentMethod from '../../../hooks/usePaymentMethod';
import {
  pageViewCheckoutEvent,
  checkoutPayConfirmEvent,
  clickPayNowEvent,
  checkoutClickEvent,
  viewPaymentEvent,
  otpCompletedEvent,
} from '../../../services/analyticsService';
import { mapQueryStringToFilterObject } from '../../../utility/urlQuery';
import PaymentMethods from './paymentMethods';
import { PaymentSuccess } from './styled';
import { useLocation } from 'react-router-dom';
import tenantConstants from '@constants';
import { getClassifiedBaseURL } from '../../../utility/env';
// import { payButtonUpgradeClickEvent } from '../../../services/analyticsService';
import NafathVerificationModal from '../../../components/nafath-verification-modal/nafath-verification-modal';
import LimitNonSaudiNationalModal from '../../../components/limitNonSaudiNationalModal/LimitNonSaudiNationalModal';
import OtpVerificationModal from '../../../components/otp-verification-modal/otp-verification-modal';
import {
  useGetPublicEventDetailsQuery,
  useLazyGetPublicEventDetailsQuery,
  useCreateEventBookingMutation,
  useUpdateUserEventInfoMutation,
} from '../../../apis/common';
import {
  getErrorString,
  getLocalizedFieldName,
  getSurgeUpdatePaymentSuccessModalData,
  isSurgeUpdatePaymentSuccessful,
  isSurgeUpdatePaymentPending,
  isSurgeUpdatePaymentAbandoned,
  isWebView,
} from '../../../utility/utility';
import { getLocaleForURL } from '../../../utility/language';
import { PAYMENT_METHODS } from '../../../constants/constants';

const Checkout = (props) => {
  const { t } = useTranslation();
  const checkoutRef = useRef();
  const contactFormRef = useRef();
  const { isMobile, isMemberArea, locale } = useSelector((state) => state.app.AppConfig);
  const { search } = useGetLocation();
  const location = useLocation();
  const [updatePayment] = useUpdatePaymentMutation();
  const [createEventBooking, { isLoading: isCreatingBooking }] = useCreateEventBookingMutation();
  const [updateUserEventInfo, { isLoading: isUpdatingUser }] = useUpdateUserEventInfoMutation();
  const [fetchEventDetails] = useLazyGetPublicEventDetailsQuery();
  const {
    cart_id: cartId,
    event_id: checkoutEventId,
    order_id: orderId,
    'cko-payment-id': ckoPaymentId,
    hide_price,
    upgrade_listing,
    paymentType,
    paymentChannel,
    paymentStatus,
    ad_license: isAdLicense,
    developers
  } = mapQueryStringToFilterObject(search)?.queryObj;

  const eventId = tenantConstants?.ENABLE_EVENT_CHECKOUT ? checkoutEventId : null;

  const user = useSelector((state) => state.app.loginUser.user);
  const {
    data: cartData,
    error: cartError,
    isLoading: isCartLoading,
    refetch,
  } = useGetCartQuery(
    { userId: user.id, orderId: orderId },
    { skip: !(user && (!!cartId || !!orderId)) || paymentType, refetchOnMountOrArgChange: true },
  );

  const {
    data: eventDetails,
    isLoading: eventDetailsLoading,
    error: eventDetailsError,
  } = useGetPublicEventDetailsQuery(eventId, {
    skip: !eventId,
  });

  const { paymentMethods, selectedMethod, handleChangeSelectedMethod } = usePaymentMethod(cartData?.available_channels);
  const navigate = useRouteNavigate();
  const [creditCardData, setCreditCardData] = useState(null);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [installments, setInstallments] = useState(false);
  const [successModalData, setSuccessModalData] = useState(null);
  const [bookingId, setBookingId] = useState(null);
  const [paymentFailureKey, setPaymentFailureKey] = useState(0);
  const { handleRefreshToken } = useAppAuthentication();
  const interactedFrom = location.state?.interactedFrom;
  const purpose = location.state?.purpose;
  const adLicenseId = location.state?.adLicenseId;
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const otpVerifyRef = useRef();

  useEffect(() => {
    if (isAdLicense === 'true') {
      viewPaymentEvent(user);
    } else if (!isCartLoading) {
      pageViewCheckoutEvent(user, interactedFrom, cartData);
    }
  }, [cartData, user, isCartLoading]);
  useEffect(() => {
    tenantConstants.ENABLE_NAFATH && !user?.is_nafaz_verified && !eventId && setShowVerificationModal(true);
  }, [user?.is_nafaz_verified]);

  useEffect(() => {
    if (ckoPaymentId && paymentType) {
      // Flow 3DS (asynchronous) — customer redirected back with the payment id; verify it.
      completeOrder(ckoPaymentId, 'checkout');
    } else if (orderId && paymentType) {
      if (eventId) {
        if (paymentStatus !== 'EXPIRED' && paymentStatus !== 'REJECTED') {
          completeOrder(orderId, paymentChannel);
        } else if (paymentChannel === 'tabby') {
          setIsRedirecting(true);
          notification.error(t('Sorry, Tabby is unable to approve this purchase. Please use an alternative payment method for your order'));

          setTimeout(() => {
            redirectOnSuccess(null, null, false);
          }, 1000);
        }
      } else {
        completeOrder(orderId, paymentChannel);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ckoPaymentId, orderId, paymentType, paymentChannel]);

  // Flow no-3DS (synchronous) — the card form's onPaymentCompleted fires in-page; verify it.
  const handleCheckoutFlowCompleted = (paymentResponse) => {
    const paymentId = paymentResponse?.id || paymentResponse?.payment_id;
    if (!paymentId) return;
    setButtonLoading(true);
    completeOrder(paymentId, 'checkout');
  };

  // In an app webview, terminal outcomes redirect (full-page) to the dashboard with a
  // success flag so the host app can intercept the navigation and detect the result.
  const redirectToDashboardInWebView = (success) => {
    window.location.href = `${getLocaleForURL()}${tenantRoutes.app().dashboard.path}?success=${success}`;
  };

  // User dismissed the Flow 3DS challenge modal — treat as a cancelled payment.
  const handleCheckout3DSCancelled = () => {
    setButtonLoading(false);
    if (isWebView() && !eventId) {
      redirectToDashboardInWebView(false);
      return;
    }
    notification.error(t('Payment Cancelled'));
    if (!eventId) navigateToPackagesPreservingDevelopers();
    else setCreditCardData(null);
  };

  const redirectOnSuccess = async (_, booking, includeBookingId = true) => {
    const updatedBookingId = booking?.id || bookingId;
    const locale = getLocaleForURL();

    let event = null;

    if (eventId && !eventDetails?.event) {
      const eventResponse = await fetchEventDetails(eventId);
      event = eventResponse?.data?.event;
    } else if (eventDetails?.event) {
      event = eventDetails.event;
    }

    if (event && (includeBookingId ? updatedBookingId : true)) {
      const eventName = event?.name?.toLowerCase();
      const baseUrl = `${getClassifiedBaseURL()}${locale}/bayut-academy/events/${eventName}-${event?.id}`;
      const redirectUrl = includeBookingId ? `${baseUrl}?booking_id=${updatedBookingId}` : baseUrl;
      window.location.href = redirectUrl;
    }
  };

  const completeOrder = async (paymentId, channel) => {
    if (eventId && paymentChannel === 'tabby') setIsRedirecting(true);

    const response = await updatePayment({
      data: channel == 'checkout' ? { 'cko-payment-id': paymentId } : { order_id: paymentId },
      paymentUrl: channel == 'checkout' ? 'checkout' : paymentChannel,
    });

    if (response) {
      setButtonLoading(false);

      // Flow fulfilment is webhook-driven — surface neutral/abandoned states before success/decline.
      if (channel == 'checkout') {
        // if (isSurgeUpdatePaymentPending(response)) {
        //   notification.info(t('Your payment is being processed. We will update you once it is confirmed.'));
        //   return;
        // }
        if (isSurgeUpdatePaymentAbandoned(response)) {
          if (isWebView() && !eventId) {
            redirectToDashboardInWebView(false);
            return;
          }
          setPaymentFailureKey((prev) => prev + 1);
          notification.error(t('You aborted the payment. Please retry or choose another payment method.'));
          if (!eventId) navigateToPackagesPreservingDevelopers();
          else setCreditCardData(null);
          return;
        }
      }

      if (!isSurgeUpdatePaymentSuccessful(response)) {
        if (isWebView() && !eventId) {
          redirectToDashboardInWebView(false);
          return;
        }
        setSuccessModalData({ approved: false });
        setPaymentFailureKey((prev) => prev + 1);
      } else {
        const successModalPayment = getSurgeUpdatePaymentSuccessModalData(response);

        let bookingResponse = null;

        if (eventId) {
          const bookingPayload = {
            booking: {
              event_id: eventId,
            },
          };

          try {
            bookingResponse = await createEventBooking(bookingPayload).unwrap();
            setBookingId(bookingResponse?.booking?.id);
          } catch (error) {
            setPaymentFailureKey((prev) => prev + 1);
            notification.error(getErrorString(error) || t('Failed to complete event booking process'));
            setCreditCardData(null);
            if (paymentChannel === 'tabby') {
              setTimeout(() => {
                redirectOnSuccess(null, null, false);
              }, 1000);
            }
            return;
          }
        }

        if (developers === '1') {
          const developersWorkspaceUrl = `${getClassifiedBaseURL()}${getLocaleForURL()}/developers/workspace`;
          checkoutPayConfirmEvent(
            user,
            interactedFrom,
            cartData,
            selectedMethod?.label,
            response?.data?.success,
            purpose,
          );
          window.location.href = developersWorkspaceUrl;
          return;
        }

        if (isMemberArea && cartData?.cartProducts?.[0]?.itemType === 'Package' && !eventId)
          handleRefreshToken(null, () => {
            navigate(tenantRoutes?.app('', false, user)?.prop_shop?.path);
          });

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

          if (eventId) {
            redirectOnSuccess(successModalPayment, bookingResponse?.booking);
          } else if (isWebView()) {
            redirectToDashboardInWebView(true);
          } else {
            setSuccessModalData(successModalPayment);
          }
        }
      }
    }
  };

  const showPaymentStatus = () => {
    if (paymentStatus == 'EXPIRED') {
      setPaymentFailureKey((prev) => prev + 1);
      notification.error(t('You aborted the payment. Please retry or choose another payment method.'));
      if (!eventId) navigate(tenantRoutes?.app('', false, user)?.prop_shop?.path);
      else setCreditCardData(null);
    } else if (paymentStatus == 'REJECTED') {
      setPaymentFailureKey((prev) => prev + 1);
      notification.error(
        t('Sorry, Tabby is unable to approve this purchase. Please use an alternative payment method for your order'),
      );
      if (!eventId) navigate(tenantRoutes?.app('', false, user)?.prop_shop?.path);
      else setCreditCardData(null);
    }

    if (paymentChannel === 'tabby' && eventId) {
      setTimeout(() => {
        redirectOnSuccess(null, null, false);
        setIsRedirecting(false)
      }, 1000);
    }
  };

  useEffect(() => {
    if (successModalData && !successModalData?.approved) {
      if (paymentStatus) {
        showPaymentStatus();
      } else {
        setPaymentFailureKey((prev) => prev + 1);
        notification.error(t('Payment failed due to an error.'));

        if (!eventId) navigate(tenantRoutes?.app('', false, user)?.prop_shop?.path);
        else setCreditCardData(null);
      }
    }
  }, [successModalData]);

  const onChangeInstallment = (e) => {
    setInstallments(e);
  };

  const fetchCartDetails = () => {
    refetch();
  };

  const button = useMemo(
    () =>
      isMemberArea || upgrade_listing
        ? { btnText: t('Go to Listings'), url: tenantRoutes.app().listings.path }
        : { btnText: t('Go to Dashboard'), url: tenantRoutes.app().dashboard.path },
    [upgrade_listing, isMemberArea],
  );

  const onCheckOut = async ({ isOtpVerified = false }) => {
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

    if (eventId && contactFormRef?.current) {
      const validationResult = await contactFormRef?.current?.validateForm();

      if (!validationResult?.isValid) return;
      const contactDetails = validationResult?.values;

      if (user && contactDetails) {
        if (!user?.is_mobile_verified && !isOtpVerified) {
          setButtonLoading(true);
          otpVerifyRef.current.onVerify(contactDetails?.phone);
          return;
        }

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
      }
    }

    if (eventId) {
      clickPayNowEvent(user, 'event-checkout', selectedMethod?.label, locale);
    }

    setButtonLoading(true);
    checkoutClickEvent(user);
    if (checkoutRef.current.onCheckOut) {
      checkoutRef.current.onCheckOut();
    }
  };

  const handleOtpSuccess = () => {
    setButtonLoading(true);
    otpCompletedEvent(user, 'event-checkout', locale);
    onCheckOut({ isOtpVerified: true });
  };

  return (
    <>
      <Main>
        <div className={'cartWraper'}>
          {eventId && eventDetailsError ? (
            <EmptyState
              title={t('Event Not Found')}
              message={t('The event with the provided ID could not be found. Please check the link and try again.')}
            />
          ) : eventDetailsLoading || isCartLoading || (eventId && isRedirecting) ? (
            <Spinner type="full" />
          ) : (
            <Row gutter={isMobile ? [0, 8] : 32} justify="center">
              <Col xxl={13} lg={16} xs={24}>
                {cartId || orderId ? (
                  isCartLoading ? (
                    <PaymentSuccess className="text-center">
                      <Spinner />
                    </PaymentSuccess>
                  ) : cartError ? (
                    <EmptyState
                      illustration={<NetworkError />}
                      title={t('Error')}
                      message={cartError}
                      onClick={fetchCartDetails}
                      buttonLoading={buttonLoading}
                    />
                  ) : !cartData?.cartProducts?.length && !(eventId && isRedirecting) ? (
                    <PaymentSuccess className="text-center">
                      <>
                        <IllustrationEmptyCart className="mb-20" />
                        <p className=" color-gray-dark mb-8">{t('Cart is empty')}</p>
                      </>
                      <p className="mb-0">
                        <Button className="btnBack" type="link" onClick={() => navigate(button.url)}>
                          {button.btnText}
                        </Button>
                      </p>
                    </PaymentSuccess>
                  ) : (
                    <>
                      {eventId && (
                        <ContactDetailsForm ref={contactFormRef} targetGender={eventDetails?.event?.target_gender} />
                      )}
                      <PaymentMethods
                        key={paymentFailureKey}
                        checkoutRef={checkoutRef}
                        isMobile={isMobile}
                        cartId={cartId}
                        orderId={orderId}
                        setSuccessModalData={eventId ? redirectOnSuccess : setSuccessModalData}
                        fetchCartDetails={fetchCartDetails}
                        setPaymentButtonLoading={setButtonLoading}
                        cartData={cartData}
                        onChangeInstallment={onChangeInstallment}
                        creditCardData={creditCardData}
                        setCreditCardData={setCreditCardData}
                        paymentMethods={paymentMethods}
                        selectedMethod={selectedMethod}
                        handleChangeSelectedMethod={handleChangeSelectedMethod}
                        eventId={eventId}
                        disablePackagesRedirect={eventId}
                        disableRetryWithPayment={eventId}
                        onCheckoutFlowCompleted={handleCheckoutFlowCompleted}
                        onCheckout3DSCancelled={handleCheckout3DSCancelled}
                      />
                    </>
                  )
                ) : null}
              </Col>

              {!!cartData?.cartProducts?.length && !isCartLoading && !cartError && (
                <Col xxl={7} lg={8} xs={24}>
                  <Card bodyStyle={{ padding: isMobile ? 10 : 20 }}>
                    {eventId ? (
                      <EventTicketSummary
                        checkoutButtonText={t('Pay Now')}
                        handleCheckout={onCheckOut}
                        proceedButtonLoading={buttonLoading || isUpdatingUser || isCreatingBooking}
                        eventData={{
                          title: eventDetails?.event?.event_category?.name,
                          title_l1: eventDetails?.event?.event_category?.name_l1,
                          description: eventDetails?.event?.name,
                          description_l1: eventDetails?.event?.name_l1,
                          image: eventDetails?.event?.images?.[0]?.medium,
                          startTime: eventDetails?.event?.event_sessions?.[0]?.start_time,
                          endTime: eventDetails?.event?.event_sessions?.[0]?.end_time,
                          venue: eventDetails?.event?.event_sessions?.[0]?.venue?.name,
                          venue_l1: eventDetails?.event?.event_sessions?.[0]?.venue?.name_l1,
                          ticketPrice: eventDetails?.event?.fee,
                          vatPercentage: eventDetails?.event?.event_vat,
                        }}
                        showIcon={false}
                      />
                    ) : (
                      <Ordersummary
                        cartData={{
                          ...cartData,
                          serviceCharges: selectedMethod?.fee,
                        }}
                        checkoutButtonText={t('Pay')}
                        handleCheckout={onCheckOut}
                        showIcon={false}
                        proceedButtonLoading={buttonLoading}
                        hidePrice={hide_price}
                        isCartLoading={isCartLoading}
                        inError={cartError}
                        setPaymentButtonLoading={setButtonLoading}
                        installmentStr={installments ? `For ${installments} months installments` : null}
                        hideCheckoutButton={selectedMethod?.component === PAYMENT_METHODS.CREDIT_DEBIT_WITH_CHECKOUT}
                      />
                    )}
                  </Card>
                </Col>
              )}
            </Row>
          )}
        </div>
        {isAdLicense === 'true' ? (
          <AdLicenseSuccessModal
            data={!!successModalData?.approved ? successModalData : null}
            setData={setSuccessModalData}
            requestId={adLicenseId}
          />
        ) : (
          <SuccessfulPaymentModal
            data={!!successModalData?.approved ? successModalData : null}
            setData={setSuccessModalData}
            productId={cartData?.cartProducts?.[0]?.product_id}
          />
        )}
        <NafathVerificationModal
          setVisible={setShowVerificationModal}
          visible={showVerificationModal}
          actionSource="checkout"
          cartId={cartId}
        />
        {!eventId && <LimitNonSaudiNationalModal actionSource="checkout" imageWidth={150} />}
        <OtpVerificationModal
          ref={otpVerifyRef}
          value={user?.mobile}
          onSuccess={handleOtpSuccess}
          onCancelModal={() => setButtonLoading(false)}
          onFail={() => setButtonLoading(false)}
        />
      </Main>
    </>
  );
};

export default Checkout;
