"use client";

import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/button";
import { useState, useRef } from "react";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import { useCart } from "@/context/CartContext";

// --- 🛠️ BRUTE FORCE ICONS (Inline SVGs) ---
const HeartIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>;
const FilterIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>;
const SearchIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>;
const CartIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></svg>;
const XIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 6 6 18" /><path d="m6 6 18 18" /></svg>;
const StarIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>;
const MessageCircleIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /></svg>;
const Trash2Icon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>;
// ---------------------------------------------

interface Product {
  _id: string;
  name: string;
  price: number;
  slug: string;
  imageUrl: string;
  category: string;
}

interface ShopPageProps {
  products: Product[];
}

export function ShopPage({ products }: ShopPageProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef(null);

  // Hook into our Cart Context (Kept for the Sidebar functionality)
  const { cart, removeFromCart, cartTotal, isCartOpen, toggleCart, cartCount } = useCart();

  // PARALLAX SETUP
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.7]);

  // Filter logic
  const uniqueCategories = ["All", ...Array.from(new Set(products.map((p) => p.category).filter(Boolean)))];

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // WhatsApp Helper
  const handleWhatsApp = (productName: string) => {
    const message = `Hi! I'm interested in buying the ${productName}. Is it available?`;
    window.open(`https://wa.me/94771234567?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen relative" ref={containerRef}>
      
      {/* === BACKGROUNDS === */}
      <div className="fixed inset-0 z-[-20] h-full w-full bg-[url('/Pbanner-bg.jpg')] bg-cover bg-center bg-no-repeat md:hidden" />
      <motion.div 
        style={{ y, opacity }} 
        className="hidden md:block fixed top-0 left-0 w-full h-[150vh] -z-10"
      >
        <img src="/banner-bg.jpg" alt="Shop Background" className="w-full h-full object-cover" />
      </motion.div>

      {/* === FLOATING CART BUTTON === */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleCart}
        className="fixed bottom-6 right-6 z-50 bg-primary text-white p-4 rounded-full shadow-2xl flex items-center justify-center border-4 border-white"
      >
        <CartIcon className="w-6 h-6" />
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white">
            {cartCount}
          </span>
        )}
      </motion.button>

      {/* === CART SIDEBAR (Sheet) === */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={toggleCart}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-[70] shadow-2xl flex flex-col"
            >
              <div className="p-5 border-b flex justify-between items-center bg-pink-50">
                <h2 className="font-bold text-xl flex items-center gap-2">
                  <CartIcon className="w-5 h-5 text-primary" /> Your Cart
                </h2>
                <button onClick={toggleCart}><XIcon className="w-6 h-6 text-gray-500 hover:text-red-500" /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center text-muted-foreground mt-10">Your cart is empty.</div>
                ) : (
                  cart.map((item) => (
                    <div key={item._id} className="flex gap-4 border-b pb-4">
                      <img src={urlFor(item.imageUrl).url()} alt={item.name} className="w-20 h-24 object-cover rounded-md" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm line-clamp-2">{item.name}</h4>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        <p className="text-primary font-bold">Rs. {item.price * item.quantity}</p>
                      </div>
                      <button onClick={() => removeFromCart(item._id)} className="text-red-400 hover:text-red-600">
                        <Trash2Icon className="w-5 h-5" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="p-5 border-t bg-gray-50">
                <div className="flex justify-between text-lg font-bold mb-4">
                  <span>Total</span>
                  <span>Rs. {cartTotal}</span>
                </div>
                <Button className="w-full bg-primary hover:bg-pink-600 text-white py-6 rounded-xl text-lg mb-2">
                  Checkout Now
                </Button>
                <button 
                   onClick={() => window.open(`https://wa.me/94771234567?text=I want to order items worth Rs. ${cartTotal}`, '_blank')}
                   className="w-full text-green-600 font-semibold text-sm hover:underline text-center"
                >
                  Or Order via WhatsApp
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* === MAIN CONTENT === */}
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto bg-white/80 backdrop-blur-md rounded-[3rem] p-6 md:p-12 shadow-2xl border border-white/50">
          
          {/* Header & Search */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <h1 className="text-5xl font-bold mb-4 text-gray-900">Our <span className="text-primary">Collections</span></h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">Explore our curated selection.</p>
          </motion.div>

          <div className="max-w-md mx-auto mb-10 relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" placeholder="Search for a dress..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all shadow-sm"
            />
          </div>

          {/* Filter Buttons */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-wrap justify-center gap-3 mb-12">
            <div className="flex items-center gap-2 text-muted-foreground mr-2">
              <FilterIcon className="w-4 h-4" /> <span className="text-sm">Filter:</span>
            </div>
            {uniqueCategories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full transition-all capitalize ${selectedCategory === category ? "bg-primary text-white shadow-lg" : "bg-white/80 border hover:border-primary text-gray-700"}`}
              >
                {category}
              </motion.button>
            ))}
          </motion.div>

          {/* Products Grid */}
          <motion.div layout className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product._id} layout
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  className="group"
                >
                  <div className="relative rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full">
                    
                    {/* Image Area */}
                    <Link href={`/product/${product.slug}`}>
                      <div className="w-full aspect-[3/4] relative cursor-pointer overflow-hidden rounded-t-2xl">
                        {product.imageUrl && (
                          <img
                            src={urlFor(product.imageUrl).url()} alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Category Badge */}
                        <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 text-primary font-bold rounded-full text-[10px] uppercase tracking-wider">
                          {product.category}
                        </div>
                      </div>
                    </Link>

                    {/* Actions Overlay (Desktop) */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2">
                          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2 bg-white rounded-full shadow-md z-10 hover:bg-pink-50 text-gray-400 hover:text-pink-500">
                            <HeartIcon className="w-4 h-4" />
                          </motion.button>
                          <motion.button 
                            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} 
                            onClick={() => handleWhatsApp(product.name)}
                            className="p-2 bg-green-500 rounded-full shadow-md z-10 text-white hover:bg-green-600"
                            title="Chat on WhatsApp"
                          >
                            <MessageCircleIcon className="w-4 h-4" />
                          </motion.button>
                    </div>

                    {/* Product Info */}
                    <div className="p-4 flex flex-col gap-2">
                        <Link href={`/product/${product.slug}`}>
                          <h3 className="font-semibold text-gray-900 text-sm md:text-base hover:text-primary line-clamp-1">{product.name}</h3>
                        </Link>
                        
                        {/* Rating Placeholder */}
                        <div className="flex items-center gap-1">
                          <StarIcon className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <StarIcon className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <StarIcon className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <StarIcon className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <StarIcon className="w-3 h-3 text-gray-300" />
                          <span className="text-xs text-gray-400">(4.0)</span>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <p className="text-primary font-bold text-lg">Rs. {product.price}</p>
                          
                          {/* ✅ REPLACED "Add +" BUTTON WITH "View" LINK */}
                          <Link href={`/product/${product.slug}`}>
                            <Button 
                              size="sm" 
                              className="bg-gray-900 text-white hover:bg-primary rounded-lg text-xs px-3"
                            >
                              View
                            </Button>
                          </Link>
                        </div>
                    </div>

                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No products found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}