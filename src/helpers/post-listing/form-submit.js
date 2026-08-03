import { setNestedObjectValues } from 'formik';

function mergeTouched(prev, patch) {
  if (patch == null) return prev || {};
  const base = { ...(prev || {}) };
  Object.keys(patch).forEach((k) => {
    const cur = base[k];
    const next = patch[k];
    if (next !== null && typeof next === 'object' && !Array.isArray(next)) {
      base[k] = mergeTouched(
        cur !== null && typeof cur === 'object' && !Array.isArray(cur) ? cur : {},
        next,
      );
    } else {
      base[k] = next;
    }
  });
  return base;
}

/**
 * Validates the form; if there are errors, merges touched so inline errors show
 * when validateOnChange is false (first submit).
 * Otherwise runs Formik's handleSubmit (which validates again, then calls onSubmit).
 */
export function handlePostListingFormSubmit(formik, syntheticEvent) {
  if (syntheticEvent?.preventDefault) {
    syntheticEvent.preventDefault();
  }
  return formik.validateForm().then((errors) => {
    if (errors && typeof errors === 'object' && Object.keys(errors).length > 0) {
      const touchedPatch = setNestedObjectValues(errors, true);
      formik.setTouched(mergeTouched(formik.touched, touchedPatch), false);
      return;
    }
    return formik.handleSubmit(syntheticEvent);
  });
}
