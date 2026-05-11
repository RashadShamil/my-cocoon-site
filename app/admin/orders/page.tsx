import { client } from "@/sanity/lib/client";
import { AdminOrdersView } from "@/components/AdminOrdersView";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

// Must be dynamic as it displays sensitive data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminOrdersPage() {
  const user = await currentUser();
  
  // Verify Admin Access
  if (!user) redirect("/login");
  
  const adminEmailsStr = process.env.ADMIN_EMAILS || "";
  const adminEmails = adminEmailsStr.split(",").map(e => e.trim().toLowerCase());
  const userEmail = user.emailAddresses[0]?.emailAddress?.toLowerCase();

  if (!adminEmails.includes(userEmail || "")) {
    redirect("/"); // unauthorized
  }

  // Fetch all orders
  const orders = await client.fetch(`*[_type == "order"] | order(_createdAt desc) {
    _id,
    orderNumber,
    _createdAt,
    orderDate,
    customerName,
    email,
    phone,
    address,
    paymentMethod,
    totalAmount,
    status,
    items[] {
      _key,
      productName,
      quantity,
      price,
      size,
      "imageUrl": product->image.asset->url
    }
  }`);

  return <AdminOrdersView initialOrders={orders} />;
}
