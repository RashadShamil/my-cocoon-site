"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
// ✅ REMOVED: import { ShoppingBag, Trash2, ArrowRight, CheckCircle, Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/button";
import { urlFor } from "@/sanity/lib/image";
import { useCart } from "@/context/CartContext";

// --- 🛠️ BRUTE FORCE ICONS (Inline SVGs) ---
const ShoppingBagIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
);

const Trash2Icon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
);

const ArrowRightIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
);

// ✅ REQUESTED: CheckCircle
const CheckCircleIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
);

// ✅ REQUESTED: Plus
const PlusIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 12h14"/><path d="M12 5v14"/></svg>
);
// ---------------------------------------------

export default function CartPage() {
  const containerRef = useRef(null);
  
  // Get Cart Data
  const { cart, removeFromCart, cartTotal, addToCart } = useCart();

  // --- PARALLAX SETUP ---
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.5]);

  return (
    <div ref={containerRef} className="min-h-screen relative overflow-hidden">
      
      {/* === BACKGROUND LAYERS === */}
      <div className="fixed inset-0 z-[-20] h-full w-full bg-[url('/Pbanner-bg.jpg')] bg-cover bg-center bg-no-repeat md:hidden" />
      <motion.div 
        style={{ y, opacity }} 
        className="hidden md:block fixed top-0 left-0 w-full h-[150vh] -z-10"
      >
        <img src="/banner-bg.jpg" alt="Background" className="w-full h-full object-cover object-top" />
      </motion.div>

      {/* === MAIN CONTENT === */}
      <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-10 bg-white/60 backdrop-blur-md py-6 rounded-3xl shadow-sm border border-white/50">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center justify-center gap-3">
              <ShoppingBagIcon className="w-8 h-8 text-primary" /> Your Cart
            </h1>
            <p className="text-muted-foreground mt-2">
              {cart.length === 0 ? "is currently empty." : `You have ${cart.length} items ready for checkout.`}
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8">
            
            {/* LEFT COLUMN: Cart Items */}
            <div className="lg:col-span-8 space-y-4">
              <AnimatePresence>
                {cart.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="bg-white/80 backdrop-blur-xl p-12 rounded-[2rem] text-center border border-white"
                  >
                    <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShoppingBagIcon className="w-10 h-10 text-pink-300" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Your cart feels a bit light</h3>
                    <p className="text-gray-500 mb-8">Explore our collection and find something beautiful!</p>
                    <Link href="/shop">
                        <Button className="bg-primary text-white rounded-xl px-8 py-3 hover:bg-primary/90">
                            Start Shopping
                        </Button>
                    </Link>
                  </motion.div>
                ) : (
                  cart.map((item) => (
                    <motion.div
                      key={item._id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="bg-white/80 backdrop-blur-xl p-4 rounded-3xl shadow-sm border border-white flex gap-4 items-center group"
                    >
                      {/* Product Image */}
                      <div className="relative w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden bg-gray-100 border border-gray-100">
                        <Image src={urlFor(item.imageUrl).url()} alt={item.name} fill className="object-cover" />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-gray-900 truncate pr-4">{item.name}</h3>
                                <p className="text-sm text-gray-500">Size: {item.size || "Standard"}</p>
                            </div>
                            <p className="font-bold text-primary text-lg">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1 border border-gray-200">
                                <span className="text-xs font-bold px-3">Qty: {item.quantity}</span>
                                <button 
                                    onClick={() => addToCart(item, item.size)}
                                    className="w-6 h-6 bg-white rounded flex items-center justify-center shadow-sm hover:text-primary"
                                >
                                    {/* ✅ Using Brute Force PlusIcon */}
                                    <PlusIcon className="w-3 h-3" />
                                </button>
                            </div>

                            <button 
                                onClick={() => removeFromCart(item._id)}
                                className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition-colors"
                                title="Remove Item"
                            >
                                <Trash2Icon className="w-5 h-5" />
                            </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* RIGHT COLUMN: Order Summary */}
            {cart.length > 0 && (
                <div className="lg:col-span-4">
                    <div className="bg-white/90 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-xl border border-white sticky top-32">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                        
                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>Rs. {cartTotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping Estimate</span>
                                <span className="text-green-600 font-medium">Calculated at Checkout</span>
                            </div>
                        </div>

                        <div className="border-t border-dashed border-gray-300 pt-4 mb-8">
                            <div className="flex justify-between items-end">
                                <span className="font-bold text-gray-900">Total</span>
                                <span className="text-2xl font-bold text-primary">Rs. {cartTotal.toLocaleString()}</span>
                            </div>
                        </div>

                        <Link href="/checkout">
                            <Button className="w-full py-6 text-lg bg-gray-900 hover:bg-black text-white rounded-xl shadow-lg flex items-center justify-center gap-2 group">
                                Checkout Now <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>

                        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
                            {/* ✅ Using Brute Force CheckCircleIcon */}
                            <CheckCircleIcon className="w-4 h-4" /> Secure Checkout
                        </div>
                    </div>
                </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}