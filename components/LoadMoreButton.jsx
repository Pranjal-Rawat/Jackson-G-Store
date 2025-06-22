'use client';

// Route: /components/LoadMoreButton.jsx – Themed load more button for product lists

export default function LoadMoreButton({ onClick, disabled }) {
  return (
    <div className="text-center mt-8">
      <button
        onClick={onClick}
        disabled={disabled}
        className={`px-6 py-2 rounded-lg font-semibold shadow transition-colors
          ${disabled
            ? 'bg-primary-300 text-white cursor-not-allowed'
            : 'bg-primary-500 hover:bg-primary-600 text-white'
          }`}
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
