'use client';

import Image from "next/image";
import Link from "next/link";

export default function AdBanner({
  title = "Get 20% Off Your First Order!",
  description = "Use code WELCOME at checkout. Limited time only.",
  image = "https://images.unsplash.com/photo-1519864604600-9991f1c4c750?auto=format&fit=crop&w=400&q=80",
  cta = "Shop Now",
  link = "/",
  bg = "bg-yellow-100"
}) {
  return (
    <section
      className={`w-full my-8 rounded-xl shadow-lg flex flex-col md:flex-row items-center p-5 ${bg}`}
      aria-label="Promotional Banner"
    >
      {/* Image */}
      <div className="w-full md:w-1/3 flex-shrink-0 flex items-center justify-center mb-4 md:mb-0">
        <Image
          src={image}
          alt={title + " – Jackson Grocery Store promo"}
          width={140}
          height={140}
          className="rounded-lg object-cover"
          loading="eager"
          sizes="(max-width: 768px) 60vw, 140px"
        />
      </div>
      {/* Content */}
      <div className="flex-1 pl-0 md:pl-8 text-center md:text-left">
        <h3 className="text-2xl font-extrabold text-primary-600 mb-1 leading-snug">{title}</h3>
        <p className="mb-4 text-gray-700">{description}</p>
        <Link
          href={link}
          aria-label={`Shop now: ${title}`}
          className="inline-block px-7 py-2.5 bg-primary-500 text-white font-semibold rounded-full shadow hover:bg-primary-600 focus:ring-2 focus:ring-primary-300 transition"
        >
          {cta}
        </Link>
      </div>
    </section>
  );
}
