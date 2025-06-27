'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import CustomLoader from './CustomLoader';

export default function PageTransitionLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef();

  useEffect(() => {
    let active = true;
    setLoading(true);

    // Clear any existing timeout
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    // Hide loader after 420ms (enough for most transitions)
    timeoutRef.current = setTimeout(() => {
      if (active) setLoading(false);
    }, 420);

    // Cleanup on unmount or before next effect
    return () => {
      active = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [pathname]);

  if (!loading) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 backdrop-blur-sm"
      role="status"
      aria-label="Page loading"
      aria-live="polite"
    >
      <CustomLoader />
    </div>
  );
}
