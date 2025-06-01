// app/category/page.js
import CategoryCarousel from '@/components/CategoryCarousel';
import Header from '@/components/Header';

export default function Home() {
  return (
    <main>
      <Header/>
      <CategoryCarousel />
      {/* Other page content */}
    </main>
  );
}