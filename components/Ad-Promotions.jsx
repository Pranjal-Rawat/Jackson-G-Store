import Image from "next/image";
import Link from "next/link";

export default function AdBanner({
  title = "Get 20% Off Your First Order!",
  description = "Use code WELCOME at checkout. Limited time only.",
  image = "https://res.cloudinary.com/dnp4yuy8z/image/upload/v1750746180/WhatsApp_Image_2025-06-24_at_11.44.21_99ec8cb7_tuztsl.jpg",
  cta = "Shop Now",
  link = "/",
  bg = "bg-yellow-100"
}) {
  return (
    <section
      className={`w-full my-6 rounded-xl shadow-md flex flex-col md:flex-row items-center p-4 sm:p-6 md:p-6 ${bg}`}
      aria-label={`Promotion: ${title}`}
      role="region"
      aria-labelledby="promo-banner"
    >
      {/* Promo Image */}
      <div className="w-full md:w-1/3 flex justify-center mb-4 md:mb-0">
        <Image
          src="https://res.cloudinary.com/dnp4yuy8z/image/upload/v1750746180/WhatsApp_Image_2025-06-24_at_11.44.21_99ec8cb7_tuztsl.jpg"
          alt={`${title} – Jackson Grocery Store Promotion`}
          width={140}
          height={140}
          className="rounded-xl object-cover shadow-sm"
          loading="eager"
          sizes="(max-width: 768px) 50vw, 140px"
        />
      </div>

      {/* Promo Content */}
      <div className="flex-1 md:pl-6 text-center md:text-left">
        <h3
          id="promo-banner"
          className="text-xl sm:text-2xl font-bold text-primary-700 mb-1"
        >
          {title}
        </h3>
        <p className="text-gray-700 mb-3 text-sm sm:text-base">
          {description}
        </p>
        <Link
          href={link}
          aria-label={`Click to ${cta}`}
          className="inline-block px-5 py-2 bg-primary-600 text-white font-semibold rounded-full shadow hover:bg-primary-700 transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-300"
        >
          {cta}
        </Link>
      </div>
    </section>
  );
}
