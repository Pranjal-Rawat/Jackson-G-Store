export default function LoadMoreButton({ onClick, disabled }) {
  return (
    <div className="text-center mt-6">
      <button
        onClick={onClick}
        disabled={disabled}
        className={`px-6 py-2 rounded-lg font-semibold shadow transition-colors
          ${disabled
            ? 'bg-primary-300 text-white cursor-not-allowed'
            : 'bg-primary-500 hover:bg-primary-600 text-white'
          }`}
        aria-label="Load more products"
      >
        {disabled ? 'No More Products' : 'Load More'}
      </button>
    </div>
  );
}
