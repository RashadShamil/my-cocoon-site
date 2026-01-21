"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
// ✅ REMOVED: import { CheckCircle, Home, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { Button } from "@/components/button";

// --- 🛠️ BRUTE FORCE ICONS (Inline SVGs) ---
const CheckCircleIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
);

const HomeIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
);

const ShoppingBagIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
);
// ---------------------------------------------

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      // Query Sanity for this specific order
      const query = `*[_type == "order" && _id == $id][0]`;
      const data = await client.fetch(query, { id: orderId });
      setOrder(data);
      setLoading(false);
    };

    fetchOrder();
  }, [orderId]);

  if (loading) return <div className="text-center py-20 min-h-[60vh] flex items-center justify-center">Loading order details...</div>;
  if (!order) return <div className="text-center py-20 min-h-[60vh] flex items-center justify-center">Order not found.</div>;

  return (
    <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 md:p-12 shadow-2xl border border-white mt-10">
      
      <div className="text-center mb-10">
        <div className="flex justify-center mb-4">
            {/* ✅ Using Brute Force CheckCircle */}
            <CheckCircleIcon />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
        <p className="text-gray-500">Thank you for your purchase, {order.customerName ? order.customerName.split(" ")[0] : "Customer"}.</p>
        <p className="text-sm text-primary font-bold mt-2">Order #: {order.orderNumber}</p>
        
        {/* Payment Method Badge */}
        <div className="mt-4 inline-block px-4 py-1 rounded-full bg-gray-100 text-xs font-bold uppercase tracking-wider text-gray-600">
            Payment: {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-8">
        <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">Shipping To:</h3>
        <p className="text-gray-600 font-medium">{order.customerName}</p>
        <p className="text-gray-500 text-sm">{order.address}</p>
        <p className="text-gray-500 text-sm">{order.phone}</p>
        <p className="text-gray-500 text-sm">{order.email}</p>
      </div>

      <div className="space-y-4 mb-8">
        <h3 className="font-bold text-gray-900 border-b border-gray-200 pb-2">Order Summary</h3>
        {order.items && order.items.map((item: any, i: number) => (
            <div key={i} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">{item.quantity}x</span>
                    <span className="text-gray-600">{item.productName} ({item.size})</span>
                </div>
                <span className="font-bold text-gray-900">Rs. {(item.price * item.quantity).toLocaleString()}</span>
            </div>
        ))}
        <div className="flex justify-between items-center pt-4 border-t border-gray-200 mt-4 text-xl font-bold">
            <span>Total Amount</span>
            <span className="text-primary">Rs. {order.totalAmount.toLocaleString()}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link href="/">
            <Button variant="outline" className="rounded-full px-8 py-3 flex items-center gap-2">
                <HomeIcon /> Home
            </Button>
        </Link>
        <Link href="/shop">
            <Button className="rounded-full px-8 py-3 bg-gray-900 text-white hover:bg-black flex items-center gap-2">
                <ShoppingBagIcon /> Continue Shopping
            </Button>
        </Link>
      </div>

    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen relative overflow-hidden pt-32 pb-20 px-4">
      {/* Backgrounds */}
      <div className="fixed inset-0 z-[-20] h-full w-full bg-[url('/Pbanner-bg.jpg')] bg-cover bg-center bg-no-repeat md:hidden" />
      <div className="hidden md:block fixed top-0 left-0 w-full h-[150vh] -z-10">
        <img src="/banner-bg.jpg" alt="Background" className="w-full h-full object-cover object-top opacity-50" />
      </div>

      {/* Suspense boundary required for useSearchParams */}
      <Suspense fallback={<div className="text-center pt-20 text-gray-500">Processing order details...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}