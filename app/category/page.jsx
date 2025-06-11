// app/category/page.js

import CategoryCarousel from '@/components/CategoryCarousel';
import Header from '@/components/Header';

export default function Home() {
  return (
    <main>
      <Header/>
      <CategoryCarousel />
      {/* You can add featured banners, SEO, etc. here */}
    </main>
  );
}
