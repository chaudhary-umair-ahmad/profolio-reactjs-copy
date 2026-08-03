import tenantConstants from '@constants';
import { useEffect, useState } from 'react';

const usePaymentMethod = (methods, defaultMethod) => {
  const [selectedMethod, setSelectedMethod] = useState(defaultMethod || null);
  const [paymentMethods, setPaymentMethods] = useState([]);

  useEffect(() => {
    if (methods?.length) {
      let availableMethods = [];
      if (methods?.length) {
        methods?.forEach((e) => {
          if (e?.enabled && !tenantConstants?.PAYMENT_METHODS?.[e?.slug]?.hide) {
            availableMethods.push({ ...tenantConstants?.PAYMENT_METHODS?.[e?.slug], ...e });
          }
        });
      }
      setPaymentMethods(availableMethods);
      setSelectedMethod(availableMethods?.[0]);
    }
  }, [methods]);

  const handleChangeSelectedMethod = (item) => {
    setSelectedMethod(item);
  };

  return { paymentMethods: paymentMethods, selectedMethod, handleChangeSelectedMethod };
};

export default usePaymentMethod;
