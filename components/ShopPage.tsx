"use client";

import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Heart, Filter, Search } from "lucide-react";
import { Button } from "@/components/button";
import { useState, useRef } from "react";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";

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
  const containerRef = useRef(null); // Ref for parallax container

  // PARALLAX SETUP
  // Track scroll progress of the entire page container
  // Using "start start" (top of container hits top of viewport) 
  // to "end end" (bottom of container hits bottom of viewport) covers the whole scroll range.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"], 
  });

  // Map scroll to movement. The background moves slower than scroll (0% to 30%)
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  // Optional: slight fade out as you scroll way down
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.7]);

  // Filter logic
  const uniqueCategories = ["All", ...Array.from(new Set(products.map((p) => p.category).filter(Boolean)))];

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    // ✅ FIX 1: Removed 'overflow-hidden' to allow proper browser scrolling
    <div className="min-h-screen relative" ref={containerRef}>
      
      {/* =========================================
          PARALLAX BACKGROUND LAYER
      ========================================= */}
      <motion.div 
        style={{ y, opacity }} 
        className="fixed top-0 left-0 w-full h-[120vh] -z-10"
      >
        <img
          // ⚠️ REPLACE with your beautiful banner image path
          src="/banner-bg.jpg"
          alt="Shop Background"
          // ✅ FIX 2: Removed brightness-[0.85] so it shows at full brightness
          className="w-full h-full object-cover" 
        />
      </motion.div>


      {/* =========================================
          MAIN CONTENT AREA
      ========================================= */}
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* WRAPPER BOX for readability against parallax bg */}
        <div className="max-w-7xl mx-auto bg-white/80 backdrop-blur-md rounded-[3rem] p-6 md:p-12 shadow-2xl border border-white/50">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-5xl font-bold mb-4 text-gray-900">
              Our <span className="text-primary">Collections</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Explore our carefully curated selection of beautiful frocks.
            </p>
          </motion.div>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-10 relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text"
                placeholder="Search for a dress..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-300 bg-white focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all shadow-sm"
              />
            </div>
          </div>

          {/* Filter Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            <div className="flex items-center gap-2 text-muted-foreground mr-2">
              <Filter className="w-4 h-4" />
              <span className="text-sm">Filter:</span>
            </div>
            {uniqueCategories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full transition-all capitalize ${
                  selectedCategory === category
                    ? "bg-primary text-white shadow-lg shadow-pink-200"
                    : "bg-white/80 border border-gray-300 hover:border-primary text-gray-700 backdrop-blur-sm"
                }`}
              >
                {category}
              </motion.button>
            ))}
          </motion.div>

          {/* Products Grid */}
          <motion.div
            layout
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  className="group"
                >
                  {/* Product Card */}
                  <div className="relative rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 aspect-[3/4]">
                    
                    <Link href={`/product/${product.slug}`}>
                      <div className="w-full h-full relative cursor-pointer">
                        {product.imageUrl && (
                          <img
                            src={urlFor(product.imageUrl).url()}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </Link>

                    <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 text-primary font-semibold rounded-full text-xs backdrop-blur-sm shadow-sm uppercase tracking-wider">
                      {product.category}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md z-10 hover:bg-pink-50 transition-colors"
                    >
                      <Heart className="w-5 h-5 text-gray-400 hover:text-pink-500 transition-colors" />
                    </motion.button>

                    <motion.div
                       className="absolute bottom-4 left-4 right-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                    >
                      <Link href={`/product/${product.slug}`}>
                        <Button className="w-full bg-white hover:bg-gray-50 text-gray-900 font-bold shadow-sm">
                           View Details
                        </Button>
                      </Link>
                    </motion.div>
                  </div>

                  <div className="mt-4 space-y-1 text-center">
                    <Link href={`/product/${product.slug}`}>
                       <h3 className="font-semibold text-gray-900 text-lg hover:text-primary transition-colors cursor-pointer">
                         {product.name}
                       </h3>
                    </Link>
                    <p className="text-primary font-bold text-xl">Rs. {product.price}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-muted-foreground text-lg">
                No products found matching &quot;{searchQuery}&quot;.
              </p>
              {searchQuery && (
                 <button 
                   onClick={() => setSearchQuery("")}
                   className="mt-4 text-primary underline hover:text-pink-700"
                 >
                   Clear Search
                 </button>
              )}
            </motion.div>
          )}
        </div> {/* End Wrapper Box */}
      </div>
    </div>
  );
}