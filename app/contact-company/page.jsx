// /app/contact-company/page.jsx

export const metadata = {
  title: 'Business Enquiries | Jackson Grocery Store | Grocery Store Dehradun',
  description:
    'Partner with Jackson Grocery Store. Fill out our business contact form for B2B, wholesale, or distributor inquiries in Dehradun.',
  keywords:
    'Business contact, Vendor partnership, Wholesale groceries, Distributor Dehradun, Jackson Grocery Store, B2B grocery, Supply groceries Dehradun, Corporate groceries, Brand tie-up, Company contact, Become a supplier',
  alternates: {
    canonical: 'https://jackson-grocery.com/contact-company',
  },
  openGraph: {
    title: 'Business Enquiries | Jackson Grocery Store',
    description:
      'Contact Jackson Grocery Store for business, vendor, or distributor partnerships in Dehradun.',
    url: 'https://jackson-grocery.com/contact-company',
    siteName: 'Jackson Grocery Store',
    images: [
      {
        url: 'https://res.cloudinary.com/dy1uhnjnq/image/upload/v1749755125/Jackson_Logo_page-0001-removebg-preview_yqeopv.png',
        width: 1200,
        height: 630,
        alt: 'Jackson Grocery Store Business Enquiries',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Business Enquiries | Jackson Grocery Store',
    description:
      'Fill the form for vendor or partnership opportunities with Jackson Grocery Store, Dehradun.',
    images: [
      'https://res.cloudinary.com/dy1uhnjnq/image/upload/v1749755125/Jackson_Logo_page-0001-removebg-preview_yqeopv.png',
    ],
  },
};

import CompanyContactForm from '../../components/CompanyContactForm';
import BusinessInfo from '../../components/BusinessInfo';

export default function ContactCompanyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#fff9f0] via-[#f5fbfa] to-[#fff6e3] pt-28 pb-20 px-2">
      <section
        aria-label="Business Contact Form"
        className="max-w-xl mx-auto bg-white/90 rounded-2xl shadow-lg px-8 py-10 border border-[#ffcc29]/40"
      >
        <div className="flex flex-col items-center mb-8">
          <img
            src="https://res.cloudinary.com/dy1uhnjnq/image/upload/v1749755125/Jackson_Logo_page-0001-removebg-preview_yqeopv.png"
            alt="Jackson Grocery Store logo"
            className="w-12 h-12 rounded-full shadow mb-2"
            loading="lazy"
          />
          <h1 className="text-2xl font-extrabold text-[#ed3237] text-center">Business Enquiries</h1>
          <p className="text-gray-600 text-center mt-2 text-base">
            Are you a brand, vendor, or distributor? Fill out the form below to partner with us.
          </p>
        </div>

        {/* Client Component for the form */}
        <CompanyContactForm />

        <div className="text-xs text-gray-400 mt-7 text-center">
          <b>Note:</b> This form opens your email app to send the enquiry.
          <br />
          For urgent partnerships, call{' '}
          <a href="tel:+917417229660" className="underline text-[#ed3237]">
            +91 74172 29660
          </a>.
        </div>
      </section>

      <BusinessInfo />
    </main>
  );
}
