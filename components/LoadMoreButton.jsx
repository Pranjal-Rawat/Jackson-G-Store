'use client';

export default function LoadMoreButton({ onClick, disabled = false, loading = false }) {
  return (
    <div className="flex justify-center mt-8">
      <button
        onClick={onClick}
        disabled={disabled || loading}
        className={`px-6 py-2 rounded-lg font-semibold shadow transition
          ${disabled || loading
            ? 'bg-primary-200 text-white cursor-not-allowed opacity-70'
            : 'bg-primary-500 hover:bg-primary-600 text-white'
          }
          focus:outline-none focus:ring-2 focus:ring-primary-300`}
        aria-label={
          disabled
            ? 'No more products to load'
            : loading
              ? 'Loading products'
              : 'Load more products'
        }
        type="button"
        tabIndex={disabled ? -1 : 0}
      >
        {loading
          ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              Loading...
            </span>
          )
          : disabled
            ? 'No More Products'
            : 'Load More'
        }
      </button>
    </div>
  );
}
