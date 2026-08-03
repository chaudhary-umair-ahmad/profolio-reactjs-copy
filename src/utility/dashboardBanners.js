
export function getDashboardBannerVariantKey(isMobile, language) {
  const isAr = String(language || '')
    .toLowerCase()
    .startsWith('ar');
  if (isMobile) {
    return isAr ? 'mweb_ar' : 'mweb_en';
  }
  return isAr ? 'desktop_ar' : 'desktop_en';
}

function getVariantImageUrl(asset) {
  if (!asset || typeof asset !== 'object') return null;
  return asset.full || asset.url || null;
}

export function filterActiveBannersForVariant(banners, variantKey) {
  const now = Date.now();
  return (banners || []).filter((b) => {
    if (b?.expires_at && new Date(b.expires_at).getTime() <= now) return false;
    return !!getVariantImageUrl(b?.[variantKey]);
  });
}

export function pickBannerByPriority(banners) {
  if (!banners?.length) return null;
  if (banners.length === 1) return banners[0];

  const weights = banners.map((b) => {
    const parsed = Number(b.priority);
    if (!Number.isFinite(parsed)) return 0;
    const clampedPriority = Math.min(10, Math.max(1, parsed));
    return 11 - clampedPriority;
  });
  const total = weights.reduce((sum, w) => sum + w, 0);
  if (total <= 0) {
    return banners[Math.floor(Math.random() * banners.length)];
  }

  let r = Math.random() * total;
  for (let i = 0; i < banners.length; i++) {
    r -= weights[i];
    if (r < 0) return banners[i];
  }
  return banners[banners.length - 1];
}

export function resolveDashboardBannerDisplay({ banners, isMobile, language }) {
  const variantKey = getDashboardBannerVariantKey(isMobile, language);
  const eligible = filterActiveBannersForVariant(banners, variantKey);
  if (!eligible.length) return null;

  const picked = pickBannerByPriority(eligible);
  const imageUrl = getVariantImageUrl(picked?.[variantKey]);
  if (!imageUrl) return null;

  return {
    id: picked.id,
    title: picked.title,
    imageUrl,
    href: picked.url,
  };
}
