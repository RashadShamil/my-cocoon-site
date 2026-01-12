import { ShopPage } from "@/components/ShopPage";
import { client } from "@/sanity/lib/client";

// Fetch data from Sanity
const getProducts = async () => {
  const query = `*[_type == "product"] | order(_createdAt desc) {
    _id,
    name,
    price,
    "slug": slug.current,
    "imageUrl": image.asset->url,
    category
  }`;

  const data = await client.fetch(query);
  return data;
};

export default async function Page() {
  const products = await getProducts();

  return (
    <>
      <ShopPage products={products} />
    </>
  );
}