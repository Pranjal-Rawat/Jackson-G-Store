import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const linkSections = [
    {
      label: 'Company',
      links: [
        { name: 'About', href: '/about' },
        { name: 'Careers', href: '/careers' },
        { name: 'History', href: '/history' },
      ],
    },
    {
      label: 'Services',
      links: [
        { name: 'Delivery', href: '/delivery' },
        { name: 'FAQ', href: '/faq' },
        { name: 'Support', href: '/support' },
      ],
    },
    {
      label: 'Connect',
      links: [
        { name: 'For Companies', href: '/contact-company' },
        { name: 'Blog', href: '/blog' },
        { name: 'Projects', href: '/projects' },
        { name: 'Contact', href: '/contact' },
      ],
    },
  ];

  return (
    <footer className="relative bg-primary-500 text-white mt-20 overflow-hidden print:hidden">
      {/* Gradient Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gradient-to-br from-secondary-400/10 via-primary-300/30 to-transparent rounded-full blur-3xl opacity-40 pointer-events-none z-0" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-tr from-secondary-500/30 to-primary-400/10 rounded-full blur-3xl opacity-30 pointer-events-none z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Logo and Address */}
          <div className="md:col-span-2 mb-6 md:mb-0">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="https://res.cloudinary.com/dy1uhnjnq/image/upload/v1749755125/Jackson_Logo_page-0001-removebg-preview_yqeopv.png"
                alt="Jackson Grocery Store logo – Best Grocery Store in Dehradun"
                width={52}
                height={52}
                className="h-13 w-auto mr-3"
                priority
              />
              <span className="text-3xl font-extrabold text-white leading-tight">
                Jackson Grocery <span className="sr-only">– Dehradun</span>
              </span>
            </div>

            <address className="not-italic mb-3 text-gray-200/90 leading-relaxed">
              <strong>Address:</strong> 1 Municipal Road, Dalanwala, Dehradun, Uttarakhand 248001<br />
              <strong>Phone:</strong>{' '}
              <a
                href="tel:+919557520189"
                className="underline text-secondary-400 hover:text-secondary-300 ml-1"
                aria-label="Call Jackson Grocery Store"
              >
                +91 95575 20189
              </a>
            </address>

            {/* Free Home Delivery Note */}
            <p className="text-secondary-300 font-semibold mb-2">
              Free Home Delivery up to 5 km
            </p>

            <p className="text-gray-200/90 mb-2">
              Get groceries delivered <span className="text-secondary-400 font-bold">fresh</span> to your door anywhere in Dehradun.
            </p>
            <p className="text-gray-300">
              Your one-stop shop for <span className="font-semibold text-white">convenient online grocery shopping</span>.
            </p>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 gap-8 md:col-span-2 md:grid-cols-3">
            {linkSections.map((section) => (
              <div key={section.label}>
                <h3 className="text-lg font-semibold mb-4 text-secondary-400 tracking-wide uppercase">{section.label}</h3>
                <ul className="space-y-2">
                  {section.links.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="group relative text-gray-200 hover:text-secondary-400 font-medium transition-colors py-1 inline-block focus:outline-none focus:underline"
                        aria-label={`${item.name} – Jackson Grocery`}
                      >
                        {item.name}
                        <span className="absolute left-0 -bottom-0.5 w-0 h-0.5 bg-secondary-400 rounded-full group-hover:w-full transition-all duration-300"></span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-primary-400/60 mt-10 pt-7">
          <p className="text-center text-gray-300 text-sm tracking-wide">
            &copy; {currentYear}{' '}
            <strong>Jackson Grocery Store</strong>{' '}
            | Dalanwala, Dehradun – Best Grocery Store in Uttarakhand. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
