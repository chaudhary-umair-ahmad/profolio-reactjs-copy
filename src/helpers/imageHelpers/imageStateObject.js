export const imageStateObject = (state = 'uploaded') => {
  const imageState = {
    uploaded: true,
    uploading: false,
    inError: false,
  };
  switch (state) {
    case 'uploaded':
      return imageState;
    case 'uploading':
      return { uploaded: false, uploading: true, inError: false };
    case 'inError':
      return { uploaded: false, uploading: false, inError: true };
    case 'select':
      return { ...imageState, selected: false };
  }
};

export const extractUuidFromUrl = (url) => {
  if (!url || typeof url !== 'string') return null;
  const match = url.match(/([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})/i);
  return match ? match[1] : null;
};

export const getCnicUuidFromImage = (img) => {
  if (!img) return null;
  return (
    img?.uuid ||
    img?.id ||
    extractUuidFromUrl(img?.url) ||
    extractUuidFromUrl(img?.gallerythumb) ||
    null
  );
};

