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
      className={`w-full my-8 rounded-2xl shadow-lg flex flex-col md:flex-row items-center p-6 sm:p-8 md:p-10 ${bg}`}
      aria-label={`Promotion: ${title}`}
      role="region"
      aria-labelledby="promo-banner"
    >
      {/* Promo Image */}
      <div className="w-full md:w-1/3 flex justify-center mb-6 md:mb-0">
        <Image
          src={image}
          alt={`${title} – Jackson Grocery Store Promotion`}
          width={180}
          height={180}
          className="rounded-xl object-cover shadow-sm"
          loading="eager"
          sizes="(max-width: 768px) 50vw, 180px"
        />
      </div>

      {/* Promo Content */}
      <div className="flex-1 md:pl-10 text-center md:text-left">
        <h3
          id="promo-banner"
          className="text-2xl sm:text-3xl font-extrabold text-primary-700 mb-2"
        >
          {title}
        </h3>
        <p className="text-gray-700 mb-4 text-base sm:text-lg">
          {description}
        </p>
        <Link
          href={link}
          aria-label={`Click to ${cta}`}
          className="inline-block px-6 py-2.5 bg-primary-600 text-white font-semibold rounded-full shadow-md hover:bg-primary-700 transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-300"
        >
          {cta}
        </Link>
      </div>
    </section>
  );
}
