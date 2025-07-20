// File: app/admin/layout.jsx
'use client';

import { SessionProvider, useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname }               from 'next/navigation';
import { useEffect, useRef }                    from 'react';

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

  /* ── route guards ───────────────────────────────────── */
  useEffect(() => {
    if (status === 'loading') return;
    if (!session && pathname !== '/admin/login')
      router.push('/admin/login');
    if (session && pathname === '/admin/login')
      router.push('/admin/products');
  }, [status, session, pathname, router]);

  /* ── idle logout after 24 h inactivity ──────────────── */
  useEffect(() => {
    if (!session) return;

    const logout = () =>
      signOut({ callbackUrl: `${window.location.origin}/admin/login` });

    const reset = () => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(logout, IDLE_LIMIT_MS);
    };

    ['mousemove', 'keydown', 'scroll', 'visibilitychange'].forEach(ev =>
      window.addEventListener(ev, reset),
    );
    reset();

    return () => {
      clearTimeout(timerRef.current);
      ['mousemove', 'keydown', 'scroll', 'visibilitychange'].forEach(ev =>
        window.removeEventListener(ev, reset),
      );
    };
  }, [session]);

  /* splash while session loads */
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        Loading…
      </div>
    );
  }

  const showHeader = session && pathname !== '/admin/login';

  return (
    <div className="min-h-screen bg-gray-50">
      {showHeader && <ResponsiveHeader />}
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

/* ────────────────────────────────────────────────────────────── */
/*  Responsive top-bar with drawer menu (mobile & desktop)       */
/* ────────────────────────────────────────────────────────────── */
function ResponsiveHeader() {
  const closeRef = useRef(null);
  const navLink  =
    'block px-4 py-2 sm:px-0 sm:py-0 hover:underline whitespace-nowrap';

  /* close drawer after tapping a link */
  const handleNav = () => {
    closeRef.current && (closeRef.current.checked = false);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-20">
      {/* hidden checkbox first → peer target for drawer */}
      <input
        ref={closeRef}
        id="drawer-toggle"
        type="checkbox"
        className="peer hidden"
      />

      {/* top bar */}
      <div className="h-14 flex items-center px-4 sm:px-6 max-w-4xl mx-auto">
        <h1 className="text-lg font-semibold flex-1">Admin Dashboard</h1>

        {/* hamburger (only < sm) */}
        <label
          htmlFor="drawer-toggle"
          className="sm:hidden cursor-pointer p-2 -mr-2 text-gray-600 hover:text-gray-900"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"
               viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </label>

        {/* desktop links */}
        <nav className="hidden sm:flex gap-6 text-primary-600">
          <a href="/admin/products?mode=edit"   className={navLink}>Update&nbsp;Product</a>
          <a href="/admin/products/new"         className={navLink}>Add&nbsp;New&nbsp;Product</a>
          <a href="/admin/products?mode=delete" className={navLink}>Delete&nbsp;Product</a>
          <button
            onClick={() =>
              signOut({ callbackUrl: `${window.location.origin}/admin/login` })
            }
            className="text-red-600 hover:underline"
          >
            Logout
          </button>
        </nav>
      </div>

      {/* mobile drawer */}
      <nav
        className="sm:hidden bg-white shadow-md border-t
                   max-h-0 peer-checked:max-h-96
                   transition-[max-height] duration-300 overflow-hidden"
      >
        <a href="/admin/products?mode=edit"   onClick={handleNav} className={navLink}>
          Update&nbsp;Product
        </a>
        <a href="/admin/products/new"         onClick={handleNav} className={navLink}>
          Add&nbsp;New&nbsp;Product
        </a>
        <a href="/admin/products?mode=delete" onClick={handleNav} className={navLink}>
          Delete&nbsp;Product
        </a>
        <button
          onClick={() => {
            handleNav();
            signOut({ callbackUrl: `${window.location.origin}/admin/login` });
          }}
          className={`${navLink} text-left text-red-600`}
        >
          Logout
        </button>
      </nav>
    </header>
  );
}
