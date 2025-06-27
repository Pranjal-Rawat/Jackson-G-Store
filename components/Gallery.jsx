'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { getOptimizedCloudinaryUrl } from '../app/lib/getOptimizedCloudinaryUrl';

const galleryImages = [
  {
    src: 'https://res.cloudinary.com/dnp4yuy8z/image/upload/v1750701877/IMG_20250621_185357_v1ehme.jpg',
    alt: 'Refrigerator section with neatly arranged products',
    blur: 'https://res.cloudinary.com/dnp4yuy8z/image/upload/e_blur:300,q_auto/v1750701877/IMG_20250621_185357_v1ehme.jpg',
  },
  {
    src: 'https://res.cloudinary.com/dnp4yuy8z/image/upload/v1750701897/IMG_20250621_185343_om3abk.jpg',
    alt: 'Second view of refrigerator section',
    blur: 'https://res.cloudinary.com/dnp4yuy8z/image/upload/e_blur:300,q_auto/v1750701897/IMG_20250621_185343_om3abk.jpg',
  },
  {
    src: 'https://res.cloudinary.com/dnp4yuy8z/image/upload/v1750701903/IMG_20250621_185519_kx2xci.jpg',
    alt: 'Perfume section with branded products',
    blur: 'https://res.cloudinary.com/dnp4yuy8z/image/upload/e_blur:300,q_auto/v1750701903/IMG_20250621_185519_kx2xci.jpg',
  },
  {
    src: 'https://res.cloudinary.com/dnp4yuy8z/image/upload/v1750701881/IMG_20250621_185555_qqqmwf.jpg',
    alt: 'Chocolate display section',
    blur: 'https://res.cloudinary.com/dnp4yuy8z/image/upload/e_blur:300,q_auto/v1750701881/IMG_20250621_185555_qqqmwf.jpg',
  },
  {
    src: 'https://res.cloudinary.com/dnp4yuy8z/image/upload/v1750701829/IMG_20250621_185451_c6z1ch.jpg',
    alt: 'Snack section with chips and munchies',
    blur: 'https://res.cloudinary.com/dnp4yuy8z/image/upload/e_blur:300,q_auto/v1750701829/IMG_20250621_185451_c6z1ch.jpg',
  },
  {
    src: 'https://res.cloudinary.com/dnp4yuy8z/image/upload/v1750701847/IMG_20250621_185708_tui3yj.jpg',
    alt: 'Another angle of the snacks section',
    blur: 'https://res.cloudinary.com/dnp4yuy8z/image/upload/e_blur:300,q_auto/v1750701847/IMG_20250621_185708_tui3yj.jpg',
  },
];

export default function Gallery() {
  const [lightboxIdx, setLightboxIdx] = useState(null);

  // Defensive: reset if index goes out of bounds
  useEffect(() => {
    if (
      lightboxIdx !== null &&
      (typeof lightboxIdx !== 'number' ||
        lightboxIdx < 0 ||
        lightboxIdx >= galleryImages.length)
    ) {
      setLightboxIdx(null);
    }
  }, [lightboxIdx]);

  const handleKeyDown = useCallback(
    (e) => {
      if (lightboxIdx !== null) {
        if (e.key === 'Escape') setLightboxIdx(null);
        if (e.key === 'ArrowRight')
          setLightboxIdx((idx) => (idx + 1) % galleryImages.length);
        if (e.key === 'ArrowLeft')
          setLightboxIdx((idx) => (idx === 0 ? galleryImages.length - 1 : idx - 1));
      }
    },
    [lightboxIdx]
  );

  useEffect(() => {
    if (lightboxIdx !== null) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [lightboxIdx, handleKeyDown]);

  return (
    <section className="py-16 bg-white" aria-labelledby="gallery-title">
      <h2
        id="gallery-title"
        className="text-3xl font-extrabold text-center text-gray-800 mb-2"
      >
        Store Gallery
      </h2>
      <div className="mx-auto mb-8 border-b-2 border-[#ffcc29] w-12" />
      <p className="text-center text-gray-600 mb-10 px-4">
        Take a peek inside Jackson Grocery Store – clean, well-organized aisles with top-quality products.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-0 sm:px-4">
        {galleryImages.map((image, index) => (
          <motion.button
            key={image.src}
            className="overflow-hidden rounded-xl shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ffcc29]"
            whileHover={{ scale: 1.03 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.07 }}
            type="button"
            aria-label={`View image: ${image.alt}`}
            onClick={() => setLightboxIdx(index)}
          >
            <Image
              src={getOptimizedCloudinaryUrl(image.src)}
              alt={image.alt}
              width={800}
              height={450}
              className="w-full h-64 object-cover transition-transform duration-300"
              loading="lazy"
              placeholder="blur"
              blurDataURL={image.blur}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {lightboxIdx !== null &&
          typeof lightboxIdx === 'number' &&
          galleryImages[lightboxIdx] && (
            <motion.div
              key="lightbox"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur"
              aria-modal="true"
              tabIndex={-1}
              onClick={() => setLightboxIdx(null)}
            >
              <motion.div
                initial={{ scale: 0.98, y: 32 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.97, y: 32 }}
                transition={{ type: 'spring', stiffness: 180, damping: 22 }}
                className="relative"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={getOptimizedCloudinaryUrl(galleryImages[lightboxIdx].src)}
                  alt={galleryImages[lightboxIdx].alt}
                  width={1000}
                  height={600}
                  className="rounded-xl shadow-2xl max-h-[80vh] max-w-[90vw] object-contain"
                  priority
                />
                <button
                  className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white text-gray-900 rounded-full shadow"
                  onClick={() => setLightboxIdx(null)}
                  aria-label="Close gallery"
                  type="button"
                >
                  <span className="text-lg font-bold">&times;</span>
                </button>
                <button
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/70 hover:bg-white rounded-full shadow"
                  onClick={() =>
                    setLightboxIdx((idx) =>
                      idx === 0 ? galleryImages.length - 1 : idx - 1
                    )
                  }
                  aria-label="Previous image"
                  type="button"
                >
                  <span className="text-xl font-bold">&#8592;</span>
                </button>
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/70 hover:bg-white rounded-full shadow"
                  onClick={() =>
                    setLightboxIdx((idx) => (idx + 1) % galleryImages.length)
                  }
                  aria-label="Next image"
                  type="button"
                >
                  <span className="text-xl font-bold">&#8594;</span>
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white text-sm bg-black/60 rounded-full px-4 py-1">
                  {galleryImages[lightboxIdx].alt}
                </div>
              </motion.div>
            </motion.div>
          )}
      </AnimatePresence>
    </section>
  );
}
