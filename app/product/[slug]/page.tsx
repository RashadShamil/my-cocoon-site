import { client } from "@/sanity/lib/client";
import ProductDetails from "@/components/ProductDetails";

// 1. Fetch data
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
    sizeOptions,
    "colors": colors[]{
      ...,
      "imageUrl": image.asset->url
    },
    // Fetch reviews
    "reviews": *[_type == "review" && references(^._id)] | order(_createdAt desc) {
      _id,
      name,
      rating,
      comment,
      _createdAt,
      "images": images[].asset->url
    }
  }`;

  const data = await client.fetch(query);
  return data;
};

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const { slug } = await Promise.resolve(params);
  const product = await getData(slug);

  if (!product) {
    return <div className="text-center pt-32 pb-20">Product not found!</div>;
  }

  return (
    <>
      <ProductDetails product={product} />
    </>
  );
}