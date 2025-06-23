import { getFaqJsonLD } from '../lib/seo/jsonld';
import Head from 'next/head';

export const metadata = {
  title: 'FAQs | Jackson Grocery Store | Grocery Store Dehradun',
  description:
    'Find answers to common questions about Jackson Grocery Store: delivery, returns, payments, and shopping online in Dehradun.',
  keywords:
    'FAQ, Frequently Asked Questions, Jackson Grocery Store, Grocery Store Dehradun, Delivery, Returns, Online shopping, Support, Policies, World of groceries, Best grocery store Dehradun',
  alternates: {
    canonical: 'https://jackson-grocery.com/faq',
  },
  openGraph: {
    title: 'FAQs | Jackson Grocery Store | Grocery Store Dehradun',
    description:
      'Your questions answered about Jackson Grocery Store in Dehradun: delivery, returns, payment, and support.',
    url: 'https://jackson-grocery.com/faq',
    siteName: 'Jackson Grocery Store',
    images: [
      {
        url: 'https://res.cloudinary.com/dy1uhnjnq/image/upload/v1749755125/Jackson_Logo_page-0001-removebg-preview_yqeopv.png',
        width: 1200,
        height: 630,
        alt: 'Jackson Grocery Store FAQs',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FAQs | Jackson Grocery Store',
    description:
      'Answers to common questions about grocery delivery, returns, payment at Jackson Grocery Store, Dehradun.',
    images: [
      'https://res.cloudinary.com/dy1uhnjnq/image/upload/v1749755125/Jackson_Logo_page-0001-removebg-preview_yqeopv.png',
    ],
  },
};

const faqs = [
  {
    question: "Where do you deliver groceries in Dehradun?",
    answer:
      "We deliver to all areas of Dehradun, including Dalanwala and surrounding localities. Just enter your address at checkout to confirm delivery.",
  },
  {
    question: "How quickly will my order be delivered?",
    answer:
      "Most orders are delivered within 2–24 hours. You will receive a WhatsApp confirmation with estimated delivery time after you place your order.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "You can pay via Cash on Delivery or Online Payment (UPI, cards, wallets). Select your preferred method during checkout.",
  },
  {
    question: "Is there a minimum order value for free delivery?",
    answer:
      "Yes, orders above ₹499 are eligible for free delivery in Dehradun. Orders below this value may have a small delivery charge.",
  },
  {
    question: "Can I return or replace a product?",
    answer:
      "Absolutely! If any item is damaged or not as described, contact us within 24 hours for an easy return or replacement. Your satisfaction is guaranteed.",
  },
  {
    question: "How do I contact customer support?",
    answer:
      "You can reach us by phone at +91 74172 29660, email at omsairetail3@gmail.com, or through our Contact page.",
  },
  {
    question: "Do you offer bulk or business orders?",
    answer:
      "Yes, we serve both individual customers and businesses. For bulk orders or B2B rates, please call us directly.",
  },
];

export default function FAQPage() {
  const jsonLd = getFaqJsonLD(faqs);

  return (
    <main className="max-w-3xl mx-auto pt-28 pb-16 px-4 min-h-[80vh] bg-white">
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <section aria-label="Frequently Asked Questions">
        <h1 className="text-4xl font-extrabold text-center text-[#ed3237] mb-6">
          Frequently Asked Questions
        </h1>
        <p className="text-center text-gray-600 mb-10">
          Find quick answers about delivery, payment, returns, and shopping with <b>Jackson Grocery Store, Dehradun</b>.
        </p>

        <ul className="divide-y divide-[#ffcc29]/30 bg-white rounded-2xl shadow-lg">
          {faqs.map((faq, idx) => (
            <li key={idx} className="py-6 px-2 sm:px-6">
              <details className="group" open={idx === 0}>
                <summary className="cursor-pointer flex items-center justify-between font-semibold text-lg text-[#ed3237] focus:outline-none">
                  {faq.question}
                  <span className="ml-3 transition-transform group-open:rotate-180">▼</span>
                </summary>
                <p className="mt-3 text-gray-700 text-base pl-1">{faq.answer}</p>
              </details>
            </li>
          ))}
        </ul>

        <div className="mt-10 text-center text-gray-500 text-sm">
          Can’t find your answer?{' '}
          <a href="/contact" className="text-[#ed3237] font-semibold hover:underline">
            Contact us
          </a>
          .
        </div>
      </section>
    </main>
  );
}
