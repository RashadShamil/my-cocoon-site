import { AdminDashboard } from "@/components/AdminDashboard";
import { client } from "@/sanity/lib/client";

const getAdminData = async () => {
  const [orders, products, reviews] = await Promise.all([
    client.fetch(`*[_type == "order"] | order(_createdAt desc)`),
    client.fetch(`*[_type == "product"] | order(_createdAt desc){..., "imageUrl": image.asset->url}`),
    client.fetch(`*[_type == "review"] | order(_createdAt desc)`)
  ]);
  
  return { orders, products, reviews };
};

export const revalidate = 0; // Ensures data is fresh for admin

export default async function AdminPage() {
  const data = await getAdminData();

  return (
    <AdminDashboard 
      orders={data.orders} 
      products={data.products} 
      reviews={data.reviews} 
    />
  );
}
