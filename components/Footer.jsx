export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-500 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <h2 className="text-3xl font-bold mb-4">
              <span className="text-gradient">Grocery</span>
              <br />
              <span className="text-secondary-500">Store</span>
            </h2>
            <p className="text-gray-200 mb-4">
              Get groceries delivered fresh to your door.
            </p>
            <p className="text-gray-200">
              Your one-stop shop for convenient online grocery shopping.
            </p>
          </div>

          {/* Links Sections */}
          <div className="grid grid-cols-2 gap-8 md:col-span-2 md:grid-cols-3">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-secondary-500">Company</h3>
              <ul className="space-y-2">
                {['About', 'Careers', 'History'].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-gray-200 hover:text-secondary-500 transition-colors"
                      aria-label={item}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-secondary-500">Services</h3>
              <ul className="space-y-2">
                {['Delivery', 'FAQ', 'Support'].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-gray-200 hover:text-secondary-500 transition-colors"
                      aria-label={item}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-secondary-500">Connect</h3>
              <ul className="space-y-2">
                {['Blog', 'Projects', 'Contact'].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-gray-200 hover:text-secondary-500 transition-colors"
                      aria-label={item}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-primary-400 mt-8 pt-8">
          <p className="text-center text-gray-300">
            © {currentYear} Grocery Store. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
