'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import CustomLoader from './CustomLoader';

export default function PageTransitionLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Start loader on route change
    setLoading(true);

    // Clear any existing timer first
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    // Hide loader after 420ms
    timeoutRef.current = setTimeout(() => setLoading(false), 420);

    // Cleanup on unmount or next route change
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [pathname]);

  if (!loading) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 backdrop-blur-sm"
      role="status"
      aria-live="polite"
    >
      <CustomLoader />
    </div>
  );
}
