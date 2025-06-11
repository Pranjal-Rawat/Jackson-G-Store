'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import CustomLoader from './CustomLoader';

export default function PageTransitionLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 500); // adjustable duration
    return () => clearTimeout(timeout);
  }, [pathname]);

  return loading ? <CustomLoader /> : null;
}
