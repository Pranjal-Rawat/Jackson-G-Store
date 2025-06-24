// /lib/getOptimizedCloudinaryUrl.js
export function getOptimizedCloudinaryUrl(src, options = 'f_auto,q_auto') {
  if (!src?.includes('res.cloudinary.com')) return src;
  return src.replace('/upload/', `/upload/${options}/`);
}
