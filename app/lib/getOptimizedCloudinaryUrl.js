export function getOptimizedCloudinaryUrl(src, options = 'f_auto,q_auto') {
  if (!src?.includes('res.cloudinary.com')) return src;

  // Remove accidental slashes, always inject after '/upload/'
  const cleanOptions = options.replace(/^\/+|\/+$/g, '');
  return src.replace(/\/upload\/([^/]*)/, `/upload/${cleanOptions}/`);
}
