import { useEffect, useState } from 'react';

function useElementObserver(selector) {
  const [element, setElement] = useState(null);

  useEffect(() => {
    const targetElement = document.querySelector(selector);
    if (targetElement) {
      setElement(targetElement); // Element already exists, set it immediately
      return;
    }

    const observer = new MutationObserver(() => {
      const observedElement = document.querySelector(selector);
      if (observedElement) {
        setElement(observedElement); // Set the element when it appears
        observer.disconnect(); // Stop observing once the element is found
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect(); // Cleanup observer on component unmount
  }, [selector]);

  return { element };
}

export default useElementObserver;
