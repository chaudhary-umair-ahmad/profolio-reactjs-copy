const KEY = 'profolio:bayut:openDiscountForListingId';

export function peekOpenDiscountForListingId(listingId) {
  try {
    if (listingId == null) return false;
    return sessionStorage.getItem(KEY) === String(listingId);
  } catch {
    return false;
  }
}

export function setOpenDiscountListingsSession(listingId) {
  try {
    if (listingId != null) sessionStorage.setItem(KEY, String(listingId));
  } catch {
    /* private mode / storage disabled */
  }
}

export function consumeOpenDiscountListingsSession(listingId) {
  try {
    if (listingId == null || sessionStorage.getItem(KEY) !== String(listingId)) return false;
    sessionStorage.removeItem(KEY);
    return true;
  } catch {
    return false;
  }
}

const DISCOUNTED_PRICE_FIELD_ID = 'post-listing-discounted-price';
const SCROLL_RETRY_MS = 150;
const SCROLL_MAX_ATTEMPTS = 40;

/** Scroll to discounted price field. Retries until the field is in the DOM. */
export function scrollToPostListingDiscountedPriceField() {
  let attempts = 0;
  const tryScroll = () => {
    const el =
      document.getElementById(DISCOUNTED_PRICE_FIELD_ID) ||
      document.querySelector(`input[name='discounted_price']`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    attempts += 1;
    if (attempts < SCROLL_MAX_ATTEMPTS) {
      globalThis.setTimeout(tryScroll, SCROLL_RETRY_MS);
    }
  };
  globalThis.requestAnimationFrame(() => {
    globalThis.requestAnimationFrame(tryScroll);
  });
}
