// components/DiscountBanner.jsx

export default function DiscountBanner() {
  return (
    <div className="overflow-hidden bg-yellow-300 py-2 select-none">
      <div
        className="whitespace-nowrap animate-scroll-text text-center font-semibold text-yellow-900 text-lg"
        aria-label="Promotional banner with discount message"
        role="banner"
      >
        {/* Repeat message multiple times for smooth looping */}
        {'Get Items at the best price with best discounts  •  '}
        {'Get Items at the best price with best discounts  •  '}
        {'Get Items at the best price with best discounts  •  '}
        {'Get Items at the best price with best discounts  •  '}
      </div>

      <style jsx>{`
        @keyframes scroll-text {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll-text {
          display: inline-block;
          padding-left: 100%;
          animation: scroll-text 15s linear infinite;
        }
      `}</style>
    </div>
  );
}
