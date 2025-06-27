// components/QuickLinks.jsx

import Link from 'next/link';

export default function Quicklinks() {
  const links = [
    { href: '/products', label: 'All Products' },
    { href: '/category/vegetables', label: 'Vegetables' },
    { href: '/category/fruits', label: 'Fruits' },
    { href: '/category/snacks-bakery', label: 'Snacks & Bakery' },
    { href: '/category/dairy-refrigerated', label: 'Dairy & Refrigerated' },
  ];

  return (
    <nav
      aria-label="Quick Links"
      className="bg-primary-50 py-3 shadow-inner border-t border-b border-primary-200"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-3 px-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="inline-block rounded-md bg-primary-600 px-4 py-2 text-sm text-white font-semibold
                       shadow hover:bg-primary-700 hover:scale-105 focus:outline-none
                       focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-opacity-75
                       transition-transform duration-200"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
