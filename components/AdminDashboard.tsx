"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, Star, ShoppingBag } from "lucide-react";
import Link from "next/link";

// Hardcoded SVGs to fix Lucide issues
const Box = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
    <path d="m3.3 7 8.7 5 8.7-5"></path>
    <path d="M12 22V12"></path>
  </svg>
);

const Activity = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
  </svg>
);

const Send = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m22 2-7 20-4-9-9-4Z"></path>
    <path d="M22 2 11 13"></path>
  </svg>
);

const Check = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const Package = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22v-10"/>
  </svg>
);
import { useEffect, useState, useRef } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area
} from "recharts";
import { AddProductForm } from "./AddProductForm";
import { TestEmailButton } from "./TestEmailButton";
import { deleteProductAction } from "@/app/admin/actions";

const Edit2 = (props: any) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>);
const Trash2 = (props: any) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>);
const CopyIcon = (props: any) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>);

interface AdminDashboardProps {
  orders: any[];
  products: any[];
  reviews: any[];
}

// Reusable Order Card block
const OrderCard = ({ order }: { order: any }) => (
  <Link href="/admin/orders" className="block p-4 rounded-2xl bg-white/50 border border-white/40 hover:bg-white/80 transition-all hover:scale-[1.02] shadow-sm mb-3">
    <div className="flex justify-between items-start mb-2">
      <div>
        <p className="font-bold text-gray-900 text-lg">{order.customerName}</p>
        <p className="text-xs text-gray-500 font-mono">#{order.orderNumber || order._id.slice(-6).toUpperCase()}</p>
      </div>

      {/* Payment Label Segment */}
      {order.paymentMethod === 'online' ? (
        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-lg uppercase whitespace-nowrap">
          Paid Online
        </span>
      ) : order.paymentMethod === 'cod' ? (
        <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-lg uppercase whitespace-nowrap">
          COD
        </span>
      ) : (
        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-lg uppercase whitespace-nowrap">
          Unknown Pmt
        </span>
      )}
    </div>

    <div className="flex items-center justify-between mt-2">
      <span className="text-sm font-semibold text-gray-800">LKR {order.totalAmount || 0}</span>
      <span className="text-xs text-gray-500 bg-white/60 px-2 py-1 rounded">
        {order.orderDate || (order._createdAt ? order._createdAt.slice(0, 10) : 'N/A')}
      </span>
    </div>
  </Link>
);

export function AdminDashboard({ orders, products, reviews }: AdminDashboardProps) {
  const [sparkles, setSparkles] = useState<any[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [showProductModal, setShowProductModal] = useState(false);

  async function handleDeleteProduct(id: string) {
    if (confirm("Are you sure you want to permanently delete this dress?")) {
      await deleteProductAction(id);
    }
  }

  // Parallax Setup
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 0.5, 0]);

  useEffect(() => {
    const generateSparkles = [...Array(15)].map((_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 30 + 20,
      delay: Math.random() * 5,
      duration: Math.random() * 10 + 10,
    }));
    setSparkles(generateSparkles);
  }, []);

  // SEGMENTING ORDERS natively as requested
  const currentOrders = orders.filter(o => ['pending', 'processing', 'paid'].includes(o.status?.toLowerCase()));
  const shippedOrders = orders.filter(o => o.status?.toLowerCase() === 'shipped');
  const deliveredOrders = orders.filter(o => o.status?.toLowerCase() === 'delivered');

  const totalOrders = orders.length;
  const avgReview = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : "0.0";

  // TRUE ANALYTICS: Group Orders by Date robustly
  const ordersByDate = orders.reduce<{ [key: string]: number }>((acc, order) => {
    // Attempt orderDate first (we just added this schema) or fallback to createdAt
    const dateStr = (order.orderDate || order._createdAt || new Date().toISOString()).slice(0, 10);
    acc[dateStr] = (acc[dateStr] || 0) + 1;
    return acc;
  }, {});

  const dynamicChartData = Object.keys(ordersByDate).sort().map(date => ({
    name: date, // E.g '2026-01-23'
    orders: ordersByDate[date]
  }));
  // Fallback if no entries
  const chartData = dynamicChartData.length > 0 ? dynamicChartData : [{ name: 'No Data Yet', orders: 0 }];

  return (
    <div className="min-h-screen relative" ref={containerRef}>
      <div className="fixed inset-0 z-[-20] h-full w-full bg-[url('/Pbanner-bg.jpg')] bg-cover bg-center md:hidden" />
      <motion.div
        style={{ y, opacity }}
        className="hidden md:block fixed top-0 left-0 w-full h-[150vh] -z-10 pointer-events-none"
      >
        <img src="/banner-bg.jpg" alt="Cocoon Background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-white/30" />
      </motion.div>

      <section className="relative min-h-screen pt-32 pb-20 px-4">
        {/* Animated Background Sparkles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none fixed">
          {sparkles.map((sparkle) => (
            <motion.div
              key={sparkle.id}
              className="absolute"
              initial={{ x: sparkle.x, y: sparkle.y, scale: 0 }}
              animate={{
                y: [null, Math.random() * -200 - 100], x: [null, Math.random() * 100 - 50],
                scale: [0, 1, 0], rotate: [0, 360],
              }}
              transition={{ duration: sparkle.duration, repeat: Infinity, delay: sparkle.delay }}
            >
              <Sparkles className="text-primary/30" size={sparkle.size} />
            </motion.div>
          ))}
        </div>

        <div className="max-w-[90rem] mx-auto relative z-10">

          <div className="flex flex-col md:flex-row justify-between w-full mb-8 items-center bg-white/60 backdrop-blur-md p-6 rounded-[2.5rem] shadow-lg border border-white/40">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Cocoon Kids Admin
            </h1>
            <div className="flex flex-col md:flex-row gap-4 items-center mt-4 md:mt-0">
               <TestEmailButton />
            </div>
          </div>

          {/* Main Layout Grid */}
          <div className="grid lg:grid-cols-3 gap-8">

            {/* LEFT COLUMN: Metric Summaries & Analytics Chart */}
            <div className="lg:col-span-2 space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { title: "Total Orders", value: totalOrders, icon: ShoppingBag, color: "text-blue-500", bg: "bg-blue-500/10" },
                  { title: "Pending", value: currentOrders.length, icon: Box, color: "text-amber-500", bg: "bg-amber-500/10" },
                  { title: "Products", value: products.length, icon: Activity, color: "text-purple-500", bg: "bg-purple-500/10" },
                  { title: "Avg Rating", value: avgReview, icon: Star, color: "text-primary", bg: "bg-primary/10" }
                ].map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                    className="bg-white/60 backdrop-blur-md p-4 rounded-3xl shadow-md border border-white/40 flex flex-col items-center text-center"
                  >
                    <div className={`p-3 rounded-full ${m.bg} mb-3`}>
                      <m.icon className={`h-6 w-6 ${m.color}`} />
                    </div>
                    <div>
                      <p className="text-3xl font-extrabold text-gray-900">{m.value}</p>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{m.title}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="bg-white/60 backdrop-blur-md p-6 rounded-[2.5rem] shadow-xl border border-white/40">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Sparkles className="text-primary" /> Live Inventory
                  </h2>
                  <button 
                    onClick={() => { setEditingProduct(null); setShowProductModal(true); }}
                    className="bg-primary hover:bg-accent text-white px-4 py-2 rounded-full font-bold shadow-md transition"
                  >
                    + Add New Dress
                  </button>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {products.map((p) => (
                    <div key={p._id} className="bg-white/80 rounded-2xl p-4 shadow border border-pink-100 flex flex-col items-center text-center relative group">
                      <div className="w-full h-32 rounded-xl mb-3 overflow-hidden bg-pink-50 relative">
                        {p.imageUrl ? (
                          <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover transition transform group-hover:scale-105" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-pink-300 font-bold">No Image</div>
                        )}
                      </div>
                      <h3 className="font-bold text-gray-800 text-sm leading-tight mb-1">{p.name}</h3>
                      <p className="text-primary font-extrabold text-sm border-t border-pink-100 pt-2 w-full">LKR {p.price}</p>
                      <p className="text-xs text-gray-500 mt-1">{p.sizeOptions?.length || 0} Variants</p>
                      
                      <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition">
                        <button onClick={() => { setEditingProduct(p); setShowProductModal(true); }} className="p-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow" title="Edit"><Edit2/></button>
                        <button onClick={() => { setEditingProduct({...p, _id: undefined, name: p.name + " (Copy)"}); setShowProductModal(true); }} className="p-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 shadow" title="Duplicate"><CopyIcon/></button>
                        <button onClick={() => handleDeleteProduct(p._id)} className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow" title="Delete"><Trash2/></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="bg-white/60 backdrop-blur-md p-6 rounded-[2.5rem] shadow-xl border border-white/40"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Activity className="text-primary" /> Order Analytics
                  </h2>
                  <span className="text-sm bg-white/60 px-3 py-1 rounded-full text-gray-500 font-medium">Aggregated by Date</span>
                </div>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorOrdersVal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" stroke="#6b7280" tick={{ fontSize: 12, fontWeight: 500 }} />
                      <YAxis stroke="#6b7280" allowDecimals={false} />
                      <RechartsTooltip
                        contentStyle={{ borderRadius: '16px', border: 'none', background: 'rgba(255,255,255,0.9)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                        formatter={(value) => [`${value} Orders`, "Activity"]}
                      />
                      <Area type="monotone" dataKey="orders" stroke="#ec4899" strokeWidth={3} fillOpacity={1} fill="url(#colorOrdersVal)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

            </div>

            {/* RIGHT COLUMN: Highly Request Split Order Tracking */}
            <div className="space-y-6">
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="bg-amber-500/10 border-2 border-amber-200/50 p-5 rounded-[2rem] shadow-md backdrop-blur-md">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-extrabold text-amber-800 flex items-center gap-2">
                      <Box className="w-5 h-5" /> Current Orders <span className="bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full text-xs">{currentOrders.length}</span>
                    </h3>
                    <Link href="/admin/orders" className="text-xs bg-amber-600 text-white px-3 py-1.5 rounded-full font-bold shadow hover:bg-amber-700 transition flex items-center gap-1">
                      Manage All
                    </Link>
                  </div>
                  <div className="max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                    {currentOrders.map(o => <OrderCard key={o._id} order={o} />)}
                    {currentOrders.length === 0 && <p className="text-amber-800/60 font-medium italic text-sm">No pending orders.</p>}
                  </div>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                <div className="bg-blue-500/10 border-2 border-blue-200/50 p-5 rounded-[2rem] shadow-md backdrop-blur-md">
                  <h3 className="text-lg font-extrabold text-blue-800 mb-4 flex items-center gap-2">
                    <Send className="w-5 h-5" /> Shipped Orders <span className="bg-blue-200 text-blue-900 px-2 py-0.5 rounded-full text-xs">{shippedOrders.length}</span>
                  </h3>
                  <div className="max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                    {shippedOrders.map(o => <OrderCard key={o._id} order={o} />)}
                    {shippedOrders.length === 0 && <p className="text-blue-800/60 font-medium italic text-sm">No shipped orders currently.</p>}
                  </div>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <div className="bg-green-500/10 border-2 border-green-200/50 p-5 rounded-[2rem] shadow-md backdrop-blur-md">
                  <h3 className="text-lg font-extrabold text-green-800 mb-4 flex items-center gap-2">
                    <Check className="w-5 h-5" /> Delivered Orders <span className="bg-green-200 text-green-900 px-2 py-0.5 rounded-full text-xs">{deliveredOrders.length}</span>
                  </h3>
                  <div className="max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                    {deliveredOrders.map(o => <OrderCard key={o._id} order={o} />)}
                    {deliveredOrders.length === 0 && <p className="text-green-800/60 font-medium italic text-sm">No delivered orders history.</p>}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Scrollbar styling specifically for these modules */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(236,72,153,0.3); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      `}</style>
      
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar relative border border-pink-200">
             <AddProductForm 
                initialData={editingProduct} 
                onClose={() => setShowProductModal(false)}
             />
          </div>
        </div>
      )}
    </div>
  );
}
