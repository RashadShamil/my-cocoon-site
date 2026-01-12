import { client } from "@/sanity/lib/client";
import ProductDetails from "@/components/ProductDetails"; // Import the UI we just made

// 1. Fetch data for ONE single product based on the slug
const getData = async (slug: string) => {
  const query = `*[_type == "product" && slug.current == '${slug}'][0] {
    _id,
    name,
    price,
    description,
    category,
    "imageUrl": image.asset->url,
    "gallery": gallery[].asset->url,
    "slug": slug.current,
    // Fetch the size options logic
    sizeOptions
  }`;

  const data = await client.fetch(query);
  return data;
};

// 2. The Page Component
export default async function ProductPage({ params }: { params: { slug: string } }) {
  // Await params for Next.js 15+ compatibility
  const { slug } = await Promise.resolve(params);
  
  const product = await getData(slug);

  if (!product) {
    return <div className="text-center pt-32 pb-20">Product not found!</div>;
  }

  return (
    <div className="min-h-screen bg-pink-50 pt-32 pb-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Pass the fetched data to our Client Component */}
        <ProductDetails product={product} />
      </div>
    </div>
  );
}