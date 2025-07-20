// File: app/admin/layout.jsx
'use client';

import { SessionProvider, useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

const IDLE_LIMIT_MS = 24 * 60 * 60 * 1000;   // 24 h

export default function AdminLayout({ children }) {
  return (
    <SessionProvider>
      <InnerAdmin>{children}</InnerAdmin>
    </SessionProvider>
  );
}

function InnerAdmin({ children }) {
  const { data: session, status } = useSession();
  const router   = useRouter();
  const pathname = usePathname();
  const timerRef = useRef(null);

  /* ── login guards ───────────────────────────────────────── */
  useEffect(() => {
    if (status === 'loading') return;
    if (!session && pathname !== '/admin/login')               router.push('/admin/login');
    else if (session && pathname === '/admin/login')           router.push('/admin/products');
  }, [session, status, pathname, router]);

  /* ── idle-logout timer ──────────────────────────────────── */
  useEffect(() => {
    if (!session) return;
    const reset = () => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(
        () => signOut({ callbackUrl: '/admin/login' }),
        IDLE_LIMIT_MS
      );
    };
    ['mousemove','keydown','scroll','visibilitychange']
      .forEach(e => window.addEventListener(e, reset));
    reset();
    return () => {
      clearTimeout(timerRef.current);
      ['mousemove','keydown','scroll','visibilitychange']
        .forEach(e => window.removeEventListener(e, reset));
    };
  }, [session]);

  /* ── loading splash ─────────────────────────────────────── */
  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading…</div>;
  }

  const showHeader = session && pathname !== '/admin/login';

  return (
    <div className="min-h-screen bg-gray-50">
      {showHeader && (
        <header className="bg-white shadow py-4">
          <div className="max-w-4xl mx-auto px-6 flex justify-between items-center">
            <h1 className="text-xl font-semibold">Admin Dashboard</h1>

            <nav className="flex gap-6 text-primary-600">
              {/* points to the list page filtered for edits */}
              <a href="/admin/products?mode=edit"   className="hover:underline">
                Update&nbsp;Product
              </a>

              {/* add-new form you already have */}
              <a href="/admin/products/new"         className="hover:underline">
                Add&nbsp;New&nbsp;Product
              </a>

              {/* list page filtered for delete actions */}
              <a href="/admin/products?mode=delete" className="hover:underline">
                Delete&nbsp;a&nbsp;Product
              </a>

              <button
                onClick={() => signOut({ callbackUrl: '/admin/login' })}
                className="text-red-600 hover:underline"
              >
                Logout
              </button>
            </nav>
          </div>
        </header>
      )}

      <main
        className={
          showHeader
            ? 'max-w-4xl mx-auto px-6 py-8'
            : 'flex items-center justify-center min-h-screen px-6 py-8'
        }
      >
        {children}
      </main>
    </div>
  );
}
