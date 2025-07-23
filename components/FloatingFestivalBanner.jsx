import Link from 'next/link';

export default function FloatingFestivalBanner() {
  return (
    <div className="fixed top-1/3 right-4 z-50 flex items-center justify-center">
      <Link
        href="/special"
        aria-label="Raksha Bandhan Special Products"
        className="relative w-28 h-28 text-white shadow-2xl flex flex-col items-center justify-center text-center text-[11px] font-bold uppercase tracking-wide
                  transform transition-all duration-500 hover:scale-110 hover:rotate-6 animate-bounce"
        style={{
          background: 'linear-gradient(135deg, #f43f5e, #f97316, #facc15)',
          clipPath:
            'polygon(50% 0%, 60% 15%, 80% 10%, 85% 30%, 100% 40%, 85% 50%, 100% 60%, 85% 70%, 80% 90%, 60% 85%, 50% 100%, 40% 85%, 20% 90%, 15% 70%, 0% 60%, 15% 50%, 0% 40%, 15% 30%, 20% 10%, 40% 15%)',
        }}
      >
        {/* Glow Effect */}
        <span className="absolute inset-0 rounded-full bg-pink-400 opacity-25 blur-lg animate-pulse"></span>

        {/* Inner Content */}
        <span className="relative z-10 leading-snug drop-shadow-lg">
          🎉<br />
          Raksha<br />
          Bandhan<br />
          Offers
        </span>
      </Link>
    </div>
  );
}
