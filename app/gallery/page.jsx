// ✅ Server Component for SEO
import Gallery from '../../components/Gallery';

const siteUrl = 'https://jackson-grocery.com';
const pageTitle = 'Store Gallery | Jackson Grocery Store, Dehradun';
const description =
  'Explore real photos of Jackson Grocery Store in Dehradun. See our snacks, chocolates, refrigerator, and more. Trusted grocery shop near you.';
const imageList = [
  'https://res.cloudinary.com/dnp4yuy8z/image/upload/q_auto,f_auto/v1750701877/IMG_20250621_185357_v1ehme.jpg',
];

// ✅ SEO Metadata (JavaScript version)
export const metadata = {
  title: pageTitle,
  description,
  alternates: {
    canonical: `${siteUrl}/gallery`,
  },
  openGraph: {
    title: pageTitle,
    description,
    url: `${siteUrl}/gallery`,
    siteName: 'Jackson Grocery Store',
    images: [
      {
        url: imageList[0],
        width: 1200,
        height: 630,
        alt: 'Jackson Grocery Store Gallery',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: pageTitle,
    description,
    images: [imageList[0]],
  },
};

export default function GalleryPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: 'Store Gallery - Jackson Grocery Store',
    description,
    url: `${siteUrl}/gallery`,
    image: imageList,
  };

  return (
    <main className="bg-white">
      {/* ✅ Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Gallery />
    </main>
  );
}
