import { AdminDashboard } from "@/components/AdminDashboard";
import { client } from "@/sanity/lib/client";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const getAdminData = async () => {
  const [orders, products, reviews] = await Promise.all([
    client.fetch(`*[_type == "order"] | order(_createdAt desc)`),
    client.fetch(`*[_type == "product"] | order(_createdAt desc){..., "imageUrl": image.asset->url, "colors": colors[]{..., "imageUrl": image.asset->url}}`),
    client.fetch(`*[_type == "review"] | order(_createdAt desc)`)
  ]);
  
  return { orders, products, reviews };
};

export const revalidate = 0; // Ensures data is fresh for admin

export default async function AdminPage() {
  const user = await currentUser();
  
  if (!user) {
    redirect("/login");
  }

  // Get user's primary email address
  const userEmail = user.emailAddresses[0]?.emailAddress;
  
  // Read allowed admin emails from environment variables (comma-separated if multiple)
  const adminEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(",").map(email => email.trim()) : [];

  // If the user's email isn't in the list, redirect them to the homepage
  if (!adminEmails.includes(userEmail)) {
    redirect("/");
  }

  const data = await getAdminData();

  return (
    <AdminDashboard 
      orders={data.orders} 
      products={data.products} 
      reviews={data.reviews} 
    />
  );
}
