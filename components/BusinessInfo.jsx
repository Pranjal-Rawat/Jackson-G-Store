// /components/BusinessInfo.jsx

import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function BusinessInfo() {
  return (
    <section
      className="w-full text-center flex flex-col items-center gap-3"
      itemScope
      itemType="https://schema.org/GroceryStore"
    >
      {/* Schema.org meta tags for better local SEO */}
      <meta itemProp="name" content="Jackson Grocery Store" />
      <meta itemProp="image" content="https://res.cloudinary.com/dy1uhnjnq/image/upload/v1749755125/Jackson_Logo_page-0001-removebg-preview_yqeopv.png" />
      <meta itemProp="telephone" content="+91 74172 29660" />
      <meta itemProp="email" content="omsairetail3@gmail.com" />
      <meta itemProp="openingHours" content="Mo-Su 08:00-22:00" />

      <hr className="w-2/3 mx-auto border-dashed border-[#ffcc29] mb-2" />
      <div className="flex items-center justify-center gap-2 mb-1">
        <MapPin className="w-4 h-4 text-[#ed3237]" />
        <span className="text-sm font-bold text-gray-900 tracking-wide" itemProp="name">
          Jackson Grocery Store — Dehradun
        </span>
      </div>
      <div className="flex flex-col gap-1 text-xs text-gray-700" itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
        <div className="flex items-center gap-2 justify-center">
          <MapPin className="w-4 h-4 text-[#ffcc29]" />
          <span>
            <span itemProp="streetAddress">1 Municipal Road</span>,{" "}
            <span itemProp="addressLocality">Dalanwala</span>,{" "}
            <span itemProp="addressRegion">Dehradun</span>,{" "}
            <span itemProp="addressRegion">Uttarakhand</span>{" "}
            <span itemProp="postalCode">248001</span>
          </span>
        </div>
        <div className="flex items-center gap-2 justify-center">
          <Phone className="w-4 h-4 text-[#ed3237]" />
          <a
            href="tel:+917417229660"
            className="hover:underline font-semibold text-[#ed3237]"
            itemProp="telephone"
          >
            +91 74172 29660
          </a>
        </div>
        <div className="flex items-center gap-2 justify-center">
          <Mail className="w-4 h-4 text-[#ffcc29]" />
          <a
            href="mailto:omsairetail3@gmail.com"
            className="hover:underline font-semibold text-[#ffcc29] lowercase"
            itemProp="email"
          >
            omsairetail3@gmail.com
          </a>
        </div>
        <div className="flex items-center gap-2 justify-center">
          <Clock className="w-4 h-4 text-[#ed3237]" />
          <span>
            <span>Open: </span>
            <span itemProp="openingHours">8am – 10pm, 7 days a week</span>
          </span>
        </div>
      </div>
      {/* Local SEO crawlable text (hidden from users, for crawlers) */}
      <div className="sr-only">
        Jackson Grocery Store is your local grocery store in Dalanwala, Dehradun.
        Visit us for the best groceries, fresh fruits, vegetables, snacks, and household essentials in Dehradun, Uttarakhand.
      </div>
    </section>
  );
}
