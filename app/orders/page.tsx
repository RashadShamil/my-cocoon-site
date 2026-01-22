import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { client } from "@/sanity/lib/client";
import Link from "next/link";
import { Button } from "@/components/button";
import Image from "next/image";
import { OrdersBackground } from "@/components/OrdersBackground";

// --- 💎 HARDCODED ICONS ---
const Icons = {
  Package: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22v-10"/></svg>,
  Truck: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>,
  CheckCircle: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>,
  Clock: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  XCircle: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>,
  ShoppingBag: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,
  Calendar: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>,
  MapPin: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>,
  ArrowRight: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
};

// --- 1. ROBUST DATA FETCHING ---
async function getOrders(email: string) {
  // 🔍 UPDATED QUERY: Looks for name/image in both snapshot AND reference fields
  const query = `*[_type == "order" && email == $email] | order(_createdAt desc) {
    _id,
    orderNumber,
    _createdAt,
    status,
    total,
    items[] {
      _key,
      quantity,
      price,
      size,
      
      // ✅ TRY 1: Direct name (snapshot)
      // ✅ TRY 2: Referenced product name (if using references)
      "name": coalesce(name, product->name, "Product"), 

      // ✅ TRY 1: Direct Image String (snapshot)
      // ✅ TRY 2: Referenced Product Image
      "imageUrl": coalesce(imageUrl, product->image.asset->url)
    },
    city
  }`;

  try {
    const data = await client.fetch(query, { email });
    return data || [];
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}

export default async function OrdersPage() {
  const user = await currentUser();
  if (!user) redirect("/login"); 

  const email = user.emailAddresses[0]?.emailAddress;
  const orders = await getOrders(email);

  const activeStatuses = ["pending", "processing", "shipped"];
  const activeOrders = orders.filter((order: any) => activeStatuses.includes(order.status?.toLowerCase() || "pending"));
  const pastOrders = orders.filter((order: any) => !activeStatuses.includes(order.status?.toLowerCase() || "pending"));

  return (
    <div className="min-h-screen relative">
      <OrdersBackground />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">My Orders</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Welcome back, <span className="font-semibold text-primary">{user.firstName}</span>! Here is your collection of magical moments.
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white/60 backdrop-blur-md rounded-[2.5rem] shadow-xl border border-white text-center animate-in fade-in zoom-in duration-500">
            <div className="w-24 h-24 bg-pink-100/50 rounded-full flex items-center justify-center mb-6">
                <Icons.ShoppingBag className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-8 max-w-md">Your wardrobe is waiting for some sparkle! Start your journey with our latest collection.</p>
            <Link href="/shop">
                <Button className="rounded-full px-8 py-6 text-lg bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 transition-transform hover:scale-105">
                  Start Shopping <Icons.ArrowRight className="ml-2 w-5 h-5" />
                </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-16">
            {activeOrders.length > 0 && (
              <section className="animate-in slide-in-from-bottom-4 duration-700">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-50 rounded-full"><Icons.Truck className="w-6 h-6 text-blue-600" /></div>
                    <h2 className="text-2xl font-bold text-gray-900">You Orders</h2>
                </div>
                <div className="grid gap-6">
                  {activeOrders.map((order: any) => (
                    <OrderCard key={order._id} order={order} isActive={true} />
                  ))}
                </div>
              </section>
            )}

            {pastOrders.length > 0 && (
              <section className="animate-in slide-in-from-bottom-8 duration-700 delay-100">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-gray-50 rounded-full"><Icons.Package className="w-6 h-6 text-gray-600" /></div>
                    <h2 className="text-2xl font-bold text-gray-900">Past Orders</h2>
                </div>
                <div className="grid gap-6">
                  {pastOrders.map((order: any) => (
                    <OrderCard key={order._id} order={order} isActive={false} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function OrderCard({ order, isActive }: { order: any; isActive: boolean }) {
  const statusColor = getStatusColor(order.status || "pending");
  
  return (
    <div className={`group bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${isActive ? "border-primary/20 shadow-lg shadow-pink-50" : "border-white shadow-sm"}`}>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-100/50">
        <div className="space-y-1">
            <div className="flex items-center gap-3 flex-wrap">
                <h3 className="font-bold text-lg text-gray-900">#{order.orderNumber ? order.orderNumber : order._id.slice(0,8).toUpperCase()}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border ${statusColor.bg} ${statusColor.text} ${statusColor.border}`}>
                    {statusColor.icon} {order.status || "Pending"}
                </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Icons.Calendar className="w-3.5 h-3.5" /> {new Date(order._createdAt).toLocaleDateString()}</span>
                {order.city && <span className="flex items-center gap-1"><Icons.MapPin className="w-3.5 h-3.5" /> {order.city}</span>}
            </div>
        </div>
        <div className="text-left md:text-right">
            <p className="text-sm text-muted-foreground">Total Amount</p>
            <p className="text-2xl font-bold text-primary">Rs. {order.total?.toLocaleString()}</p>
        </div>
      </div>

      <div className="space-y-4">
        {order.items?.map((item: any) => (
            <div key={item._key} className="flex items-center gap-4 p-2 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0 shadow-sm">
                    {/* ✅ FIX: Ensure imageUrl is checked properly */}
                    {item.imageUrl ? (
                        <Image 
                          src={item.imageUrl} 
                          alt={item.name} 
                          fill 
                          className="object-cover" 
                          sizes="64px"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-pink-50 text-pink-300">
                          <Icons.ShoppingBag className="w-6 h-6" />
                        </div>
                    )}
                </div>
                <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 line-clamp-1">{item.name}</h4>
                    <p className="text-sm text-gray-500">Size: <span className="font-medium text-gray-700">{item.size || "Std"}</span> | Qty: {item.quantity}</p>
                </div>
                <p className="font-medium text-gray-900">Rs. {item.price?.toLocaleString()}</p>
            </div>
        ))}
      </div>

      <div className="mt-8 pt-4 border-t border-gray-100/50 flex justify-end">
         <Link href={`/contact?subject=Order Help #${order.orderNumber || order._id}`}>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-full">
              Need help with this order?
            </Button>
         </Link>
      </div>
    </div>
  );
}

function getStatusColor(status: string) {
    const s = status.toLowerCase();
    switch (s) {
        case 'pending': return { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-100', icon: <Icons.Clock className="w-3 h-3" /> };
        case 'processing': return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100', icon: <Icons.Package className="w-3 h-3" /> };
        case 'shipped': return { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-100', icon: <Icons.Truck className="w-3 h-3" /> };
        case 'delivered': return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-100', icon: <Icons.CheckCircle className="w-3 h-3" /> };
        case 'cancelled': return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-100', icon: <Icons.XCircle className="w-3 h-3" /> };
        default: return { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200', icon: <Icons.Clock className="w-3 h-3" /> };
    }
}