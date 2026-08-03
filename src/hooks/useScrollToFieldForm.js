import { useEffect } from 'react';

const getFieldErrorNames = formikErrors => {
  const transformObjectToDotNotation = (obj, prefix = '', result = []) => {
    Object.keys(obj || {}).forEach(key => {
      const value = obj[key];
      if (!value) return;

      const nextKey = prefix ? `${prefix}.${key}` : key;
      // if (typeof value === 'object') {
      //   transformObjectToDotNotation(value, nextKey, result);
      // } else {
      result.push(nextKey);
      // }
    });

    return result;
  };

  return transformObjectToDotNotation(formikErrors);
};

export const useScrollToFieldForm = (formik, scrollBehavior = { behavior: 'smooth', block: 'center' }) => {
  const { errors, isValid, submitCount } = formik;
  useEffect(() => {
    if (isValid) return;
    const fieldErrorNames = getFieldErrorNames(errors);
    if (fieldErrorNames.length <= 0) return;
    let element;
    fieldErrorNames.forEach(e => {
      if (!element) {
        element =
          document.querySelector(`input[name='${e}']`) ||
          document.querySelector(`textarea[name='${e}']`) ||
          document.querySelector(`div[name='${e}']`);
      }
    });
    if (!element) return;
    element.scrollIntoView(scrollBehavior);
  }, [submitCount]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
};
