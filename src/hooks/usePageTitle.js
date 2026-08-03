import { useEffect } from 'react';

const usePageTitle = (title, description) => {
  useEffect(() => {
    const prevTitle = document.title;
    if (title) {
      document.title = title;
    }
    const el = document.querySelector("meta[name='description']");
    let prevDescription = el?.getAttribute('content');
    if (description) {
      el.setAttribute('content', description);
    }
    return () => {
      if (title) {
        document.title = prevTitle;
      }
      if (description) {
        el.setAttribute('content', prevDescription);
      }
    };
  }, []);
};
export default usePageTitle;
