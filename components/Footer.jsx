import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-primary-500 text-white mt-20 overflow-hidden">
      {/* Glowing Gradient Backgrounds */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gradient-to-br from-secondary-400/10 via-primary-300/30 to-transparent rounded-full blur-3xl opacity-40 pointer-events-none z-0" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-tr from-secondary-500/30 to-primary-400/10 rounded-full blur-3xl opacity-30 pointer-events-none z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Section */}
          <div className="md:col-span-2 mb-6 md:mb-0">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="https://res.cloudinary.com/dy1uhnjnq/image/upload/v1749755125/Jackson_Logo_page-0001-removebg-preview_yqeopv.png"
                alt="Jackson Grocery Logo"
                width={52}
                height={52}
                className="h-13 w-auto mr-3"
                priority
              />
              <span className="text-3xl font-extrabold text-white">
                Jackson Grocery
              </span>
            </div>
            <p className="text-gray-200/90 mb-3">
              Get groceries delivered <span className="text-secondary-400 font-bold">fresh</span> to your door.
            </p>
            <p className="text-gray-300">
              Your one-stop shop for <span className="font-semibold text-white">convenient online grocery shopping</span>.
            </p>
          </div>

          {/* Links Sections */}
          <div className="grid grid-cols-2 gap-8 md:col-span-2 md:grid-cols-3">
            {[
              { label: 'Company', links: ['About', 'Careers', 'History'] },
              { label: 'Services', links: ['Delivery', 'FAQ', 'Support'] },
              { label: 'Connect', links: ['Blog', 'Projects', 'Contact'] }
            ].map((section) => (
              <div key={section.label}>
                <h3 className="text-lg font-semibold mb-4 text-secondary-400 tracking-wide uppercase">{section.label}</h3>
                <ul className="space-y-2">
                  {section.links.map((item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="group relative text-gray-200 hover:text-secondary-400 font-medium transition-colors py-1 inline-block"
                        aria-label={item}
                      >
                        {item}
                        <span className="absolute left-0 -bottom-0.5 w-0 h-0.5 bg-secondary-400 rounded-full group-hover:w-full transition-all duration-300"></span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-primary-400/60 mt-10 pt-7">
          <p className="text-center text-gray-300 text-sm tracking-wide">
            © {currentYear} <span className="font-bold">Grocery Store</span>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
