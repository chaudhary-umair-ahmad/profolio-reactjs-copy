import { useEffect } from 'react';

export const useScrollToPageSection = (sectionId, scrollBehavior = { behavior: 'smooth', block: 'center' }) => {
  useEffect(() => {
    let selector = window?.location?.hash || sectionId;
    let sectionElement = null;

    try {
      if (selector) sectionElement = document?.querySelector(selector);
    } catch (err) {
      sectionElement = null;
    }

    if (sectionElement) {
      sectionElement.scrollIntoView(scrollBehavior);
    }
  }, [window?.location?.hash, sectionId, scrollBehavior]);
};
