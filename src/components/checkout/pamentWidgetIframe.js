import React, { useEffect } from 'react';

const PaymentWidgetIframe = ({ checkoutDetails, brands, customStyles = '', iframeOptions = { locale: 'ar' } }) => {
  useEffect(() => {
    if (checkoutDetails) {
      window.wpwlOptions = iframeOptions;

      const script = document.createElement('script');
      script.src = `https://eu-prod.oppwa.com/v1/paymentWidgets.js?checkoutId=${checkoutDetails?.data?.payment_id}`;
      script.async = true;
      script.wpwlOptions = wpwlOptions;

      document.body.appendChild(script);

      if (customStyles) {
        const styleTag = document.createElement('style');
        styleTag.innerHTML = customStyles;
        document.head.appendChild(styleTag);

        return () => {
          document.body.removeChild(script);
          document.head.removeChild(styleTag);
        };
      }

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [checkoutDetails, iframeOptions, customStyles]);

  return (
    <form
      action={`${process.env.REACT_APP_BASE_URL}/${iframeOptions?.locale}/content/process-payment?order_id=${checkoutDetails?.data?.order_id}`}
      data-brands={brands}
      className="paymentWidgets"
    ></form>
  );
};

export default PaymentWidgetIframe;
