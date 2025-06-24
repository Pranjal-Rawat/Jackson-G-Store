// ✅ Server Component for SEO
import Head from 'next/head';
import Gallery from '@/components/Gallery';

const siteUrl = 'https://jackson-grocery.com';
const pageTitle = 'Store Gallery | Jackson Grocery Store, Dehradun';
const description =
  'Explore real photos of Jackson Grocery Store in Dehradun. See our snacks, chocolates, refrigerator, and more. Trusted grocery shop near you.';

const imageList = [
  'https://res.cloudinary.com/dnp4yuy8z/image/upload/q_auto,f_auto/v1750701877/IMG_20250621_185357_v1ehme.jpg',
  'https://res.cloudinary.com/dnp4yuy8z/image/upload/q_auto,f_auto/v1750701897/IMG_20250621_185343_om3abk.jpg',
  'https://res.cloudinary.com/dnp4yuy8z/image/upload/q_auto,f_auto/v1750701903/IMG_20250621_185519_kx2xci.jpg',
  'https://res.cloudinary.com/dnp4yuy8z/image/upload/q_auto,f_auto/v1750701881/IMG_20250621_185555_qqqmwf.jpg',
  'https://res.cloudinary.com/dnp4yuy8z/image/upload/q_auto,f_auto/v1750701829/IMG_20250621_185451_c6z1ch.jpg',
  'https://res.cloudinary.com/dnp4yuy8z/image/upload/q_auto,f_auto/v1750701847/IMG_20250621_185708_tui3yj.jpg',
];

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
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      {/* Use your animated Gallery Component */}
      <Gallery />
    </main>
  );
}
