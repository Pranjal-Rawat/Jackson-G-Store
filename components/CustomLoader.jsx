'use client';

// /components/CustomLoader.jsx – Animated brand loader for transitions & API loading

export default function CustomLoader() {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm"
      role="status"
      aria-live="polite"
      aria-label="Loading – Jackson Grocery Store"
    >
      {/* Floating Keyframes for Groceries */}
      <style jsx>{`
        .animate-float {
          animation: floatUpDown 1.6s ease-in-out infinite alternate;
        }
        .animate-float-slow {
          animation: floatUpDown 2.2s ease-in-out infinite alternate;
        }
        .animate-float-xslow {
          animation: floatUpDown 2.7s ease-in-out infinite alternate;
        }
        @keyframes floatUpDown {
          from {
            transform: translateY(0) scale(1);
          }
          to {
            transform: translateY(-16%) scale(1.08);
          }
        }
      `}</style>

      {/* Animated Shopping Bag & Items */}
      <div className="relative mb-6 w-28 h-28 flex items-center justify-center drop-shadow-lg">
        <svg
          className="w-20 h-20 drop-shadow"
          viewBox="0 0 64 64"
          fill="none"
          aria-label="Shopping Bag"
          role="img"
        >
          <rect x="10" y="18" width="44" height="34" rx="8" fill="#e53e3e" />
          <rect x="16" y="24" width="32" height="22" rx="6" fill="#f6ad55" />
          <path
            d="M22 18c0-6 20-6 20 0"
            stroke="#2f855a"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
        {/* Apple */}
        <svg className="absolute left-0 top-0 w-8 h-8 animate-float" viewBox="0 0 32 32" aria-label="Apple" role="img">
          <circle cx="16" cy="17" r="8" fill="#fc8181" />
          <rect x="14" y="8" width="4" height="6" rx="2" fill="#38a169" />
        </svg>
        {/* Carrot */}
        <svg className="absolute right-1 top-2 w-7 h-7 animate-float-slow" viewBox="0 0 32 32" aria-label="Carrot" role="img">
          <ellipse cx="16" cy="20" rx="6" ry="8" fill="#f6e05e" />
          <rect x="14" y="5" width="4" height="7" rx="2" fill="#68d391" />
        </svg>
        {/* Bread */}
        <svg className="absolute left-12 -bottom-2 w-7 h-7 animate-float-xslow" viewBox="0 0 32 32" aria-label="Bread" role="img">
          <rect x="6" y="15" width="20" height="10" rx="5" fill="#ed8936" />
          <ellipse cx="16" cy="16" rx="10" ry="5" fill="#f6e05e" />
        </svg>
      </div>

      {/* Branding & Message */}
      <div className="text-center space-y-2">
        <span className="block text-2xl font-extrabold tracking-tight">
          <span className="text-primary-500">Jackson</span>{' '}
          <span className="text-secondary-500">Grocery</span>
        </span>
        <span className="block text-base text-gray-600">
          Packing your fresh groceries…
        </span>

        {/* Spinner */}
        <div className="mt-2 flex justify-center" aria-hidden="true">
          <span
            className="w-7 h-7 border-4 border-secondary-500 border-t-transparent rounded-full animate-spin"
          ></span>
        </div>
      </div>

      {/* Assistive Info for screen readers */}
      <span className="sr-only">
        Please wait while we load Jackson Grocery Store products and deals.
      </span>
    </div>
  );
}
