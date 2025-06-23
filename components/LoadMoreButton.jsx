'use client';

export default function LoadMoreButton({ onClick, disabled }) {
  return (
    <div className="text-center mt-8">
      <button
        onClick={onClick}
        disabled={disabled}
        className={`px-6 py-2 rounded-lg font-semibold shadow transition-all duration-200 ease-in-out
          ${disabled
            ? 'bg-primary-300 text-white cursor-not-allowed'
            : 'bg-primary-500 hover:bg-primary-600 text-white'
          }
          focus:outline-none focus:ring-2 focus:ring-primary-300
        `}
        aria-label={disabled ? 'No more products to load' : 'Load more products'}
        type="button"
        tabIndex={disabled ? -1 : 0}
        autoFocus={false}
      >
        {disabled ? 'No More Products' : 'Load More'}
      </button>
    </div>
  );
}
