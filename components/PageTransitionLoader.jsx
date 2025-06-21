'use client';

// Route: /components/PageTransitionLoader.jsx – Shows loader on page transitions

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import CustomLoader from './CustomLoader';

export default function PageTransitionLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Start loader immediately on path change
    setLoading(true);
    // Hide loader after a short delay (adjust as needed)
    const timeout = setTimeout(() => setLoading(false), 420); // 400–600ms feels snappy

    return () => clearTimeout(timeout);
  }, [pathname]);

  // Only render if loading
  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <CustomLoader />
    </div>
  );
}
