// fetchImages.js

import fs from 'fs/promises';
import fetch from 'node-fetch';

const rawData = await fs.readFile('./data/cleaned_products.json', 'utf-8');
const data = JSON.parse(rawData);

async function fetchImageURL(productName) {
  const query = encodeURIComponent(productName);
  const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${query}&search_simple=1&action=process&json=1`;

  const res = await fetch(url);
  const json = await res.json();
  const first = json.products?.[0];
  return first?.image_front_small_url || null;
}

for (let i = 0; i < data.length; i++) {
  const product = data[i];
  try {
    const image = await fetchImageURL(product.name);
    product.image = image || '/images/products/placeholder.jpg';
    console.log(`${image ? '✅' : '❌'} [${i + 1}] ${product.name}`);
  } catch {
    product.image = '/images/products/placeholder.jpg';
    console.log(`❌ [${i + 1}] ${product.name} (Error)`);
  }

  // Rate limit friendly: 1s delay
  await new Promise((r) => setTimeout(r, 1000));
}

await fs.writeFile('./data/final_products_with_images.json', JSON.stringify(data, null, 2));
console.log('✅ Done! Output: final_products_with_images.json');
