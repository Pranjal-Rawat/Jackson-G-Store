import Image from "next/image";

export default function AdBanner({
  title = "Get 20% Off Your First Order!",
  description = "Use code WELCOME at checkout. Limited time only.",
  image = "https://images.unsplash.com/photo-1519864604600-9991f1c4c750?auto=format&fit=crop&w=400&q=80",
  cta = "Shop Now",
  link = "/",
  bg = "bg-yellow-100"
}) {
  return (
    <div className={`w-full my-8 rounded-xl shadow flex flex-col md:flex-row items-center p-5 ${bg}`}>
      {/* Left: Image */}
      <div className="w-full md:w-1/3 flex-shrink-0 flex items-center justify-center mb-4 md:mb-0">
        <Image
          src={image}
          alt={title}
          width={140}
          height={140}
          className="rounded-lg object-cover"
          priority
        />
      </div>
      {/* Right: Content */}
      <div className="flex-1 pl-0 md:pl-8 text-center md:text-left">
        <h3 className="text-xl font-bold text-primary-500 mb-1">{title}</h3>
        <p className="mb-3 text-gray-700">{description}</p>
        <a
          href={link}
          className="inline-block px-6 py-2 bg-primary-500 text-white font-semibold rounded-full shadow hover:bg-primary-600 transition"
        >
          {cta}
        </a>
      </div>
    </div>
  );
}
