'use client';

// Route: /components/PageTransitionLoader.jsx – Shows loader on page transitions

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import CustomLoader from './CustomLoader';

export default function PageTransitionLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 500); // Adjust duration as needed

    return () => clearTimeout(timeout);
  }, [pathname]);

  // Only render if loading
  return loading ? (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <CustomLoader />
    </div>
  ) : null;
}
