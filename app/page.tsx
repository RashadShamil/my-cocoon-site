import { HomePage } from "@/components/HomePage"; // Import your design
import { client } from "@/sanity/lib/client"; // Import the fetcher
import {WelcomeIntro} from "@/components/WelcomeIntro";

// 1. FETCH DATA (Server Side)
// This runs on the server before the page is sent to the browser
const getData = async () => {
  const query = `*[_type == "product"] | order(_createdAt desc) {
    _id,
    name,
    price,
    sizeOptions,
    "slug": slug.current,
    "imageUrl": image.asset->url,
    category
  }`;
  
  const data = await client.fetch(query);
  return data;
};

export default async function Page() {
  // 2. Get the products
  const products = await getData();

  return (
  
    <>
      <WelcomeIntro />
      <HomePage products={products} />
    </>
  );
}