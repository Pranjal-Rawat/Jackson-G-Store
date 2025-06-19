// Route: /app/category/page.jsx – Category landing (all categories browse)

export const metadata = {
  title: "Browse Grocery Categories | Jackson Grocery",
  description: "Shop by category and find the best deals on groceries, fruits, snacks, essentials, and more at Jackson Grocery."
};

import CategoryCarousel from '@/components/CategoryCarousel';

export default function CategoryHomePage() {
  return (
    <main className="pt-[5.5rem] min-h-screen bg-white">
      <CategoryCarousel />
      {/* SEO text for Google below carousel */}
      <section className="max-w-2xl mx-auto my-10 px-4 text-center text-gray-600">
        <h2 className="text-xl font-bold mb-2">Shop by Category – Groceries Delivered Fresh</h2>
        <p>
          Discover all our grocery categories—fruits, dairy, snacks, and daily essentials. Enjoy fast delivery and top brands with Jackson Grocery.
        </p>
      </section>
    </main>
  );
}
