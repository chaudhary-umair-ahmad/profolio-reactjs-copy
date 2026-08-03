import { useCallback } from 'react';

const useTabbyPromo = (selector, currency, locale, price) => {
  const attachTabbyPromo = useCallback(() => {
    if (window.TabbyPromo) {
      window.TabbyPromo({
        selector,
        currency,
        locale,
        price,
      });
    } else {
      console.warn('TabbyPromo is not available yet.');
    }
  }, []);

  const loadTabbyScript = useCallback(() => {
    if (!document.getElementById('tabby-script')) {
      const script = document.createElement('script');
      script.src = 'https://checkout.tabby.ai/tabby-promo.js';
      script.id = 'tabby-script';
      script.async = true;
      script.onload = attachTabbyPromo;
      document.body.appendChild(script);
    } else {
      attachTabbyPromo();
    }
  }, []);

  return loadTabbyScript;
};

export default useTabbyPromo;
