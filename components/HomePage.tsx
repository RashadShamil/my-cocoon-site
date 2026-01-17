"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, Heart, Star } from "lucide-react";
import { Button } from "@/components/button";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { urlFor } from "@/sanity/lib/image";

interface Product {
  _id: string;
  name: string;
  price: number;
  slug: string;
  imageUrl: string;
  category: string;
}

interface HomePageProps {
  products: Product[];
}

interface SparkleData {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

export function HomePage({ products }: HomePageProps) {
  const [sparkles, setSparkles] = useState<SparkleData[]>([]);
  const containerRef = useRef(null);

  // 1. Track scroll progress for the Hero section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // 2. Map scroll to parallax movement
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
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

  return (
    <div className="min-h-screen relative" ref={containerRef}>
      
      {/* =========================================
          PARALLAX BACKGROUND LAYER
      ========================================= */}
      <motion.div 
        style={{ y, opacity }} 
        className="fixed top-0 left-0 w-full h-[120vh] -z-10 pointer-events-none"
      >
        <img
          // ⚠️ REPLACE with your beautiful banner image
          src="/banner-bg.jpg"
          alt="Cocoon Background"
          className="w-full h-full object-cover " 
        />
        {/* Optional overlay to make text pop */}
        <div className="absolute inset-0 bg-white/30" />
      </motion.div>

      {/* =========================================
          SECTION 1: HERO (Content sits on top)
      ========================================= */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32 pb-20 px-4">
        
        {/* Animated Background Sparkles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {sparkles.map((sparkle) => (
            <motion.div
              key={sparkle.id}
              className="absolute"
              initial={{ x: sparkle.x, y: sparkle.y, scale: 0 }}
              animate={{
                y: [null, Math.random() * -200 - 100],
                x: [null, Math.random() * 100 - 50],
                scale: [0, 1, 0],
                rotate: [0, 360],
              }}
              transition={{
                duration: sparkle.duration,
                repeat: Infinity,
                delay: sparkle.delay,
              }}
            >
              <Sparkles className="text-primary/30" size={sparkle.size} />
            </motion.div>
          ))}
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* ✅ MAIN BOX CONTAINER: Wraps both text and image */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center bg-white/60 backdrop-blur-md p-6 md:p-12 rounded-[2.5rem] shadow-xl border border-white/40">
            
            {/* Left Content (Text & Buttons) */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              // Removed box styling from here
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6 backdrop-blur-sm"
              >
                <Star className="w-4 h-4 text-primary fill-primary" />
                <span className="text-sm text-primary font-medium">New Collection 2026</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-gray-900 drop-shadow-sm"
              >
                Where Little{" "}
                <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                  Princesses
                </span>{" "}
                Bloom
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg text-gray-700 mb-8 font-medium drop-shadow-sm"
              >
                Discover enchanting frocks that transform ordinary moments into
                magical memories.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-4"
              >
                <Link href="/shop">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 shadow-lg shadow-primary/20">
                    Shop Collection <Sparkles className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button size="lg" variant="outline" className="bg-white/80 hover:bg-white border-primary text-primary shadow-sm backdrop-blur-sm">
                    Learn More
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Right Image Section (Now inside the main box) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="relative"
            >
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                // Kept the image's own border/shadow as it looks good nested inside the bigger box
                className="relative z-10 rounded-3xl overflow-hidden shadow-2xl max-w-sm mx-auto border-4 border-white/50"
              >
                <img
                  src="/7.jpeg"
                  alt="Cocoon Collection"
                  className="w-full h-auto"
                />
              </motion.div>
            </motion.div>
          </div>{/* End Main Box Container */}
        </div>
      </section>

      {/* =========================================
          PARALLAX TEXT BANNER
      ========================================= */}
      <section className="relative py-24 overflow-hidden">
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 drop-shadow-sm tracking-tight"
            >
              Every Dress Tells a Story
            </motion.h2>
            
            <motion.div 
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="w-24 h-1 bg-primary/50 mx-auto mb-6 rounded-full origin-left"
            />

            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg md:text-2xl text-gray-800 font-medium drop-shadow-sm leading-relaxed"
            >
              Handcrafted with love, designed for joy, and made for your little princess&apos;s biggest moments.
            </motion.p>
        </div>
      </section>

      {/* =========================================
          SECTION 3: FEATURED PRODUCTS
      ========================================= */}
      <section className="py-20 bg-white relative z-20 shadow-[0_-10px_20px_-5px_rgba(0,0,0,0.1)] rounded-t-[3rem] -mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">
              Featured <span className="text-primary">Collection</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Handpicked designs from our collections.
            </p>
          </motion.div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group cursor-pointer"
              >
                <Link href={`/product/${product.slug}`}>
                  <div className="relative rounded-xl overflow-hidden bg-muted mb-3 aspect-[3/4] shadow-sm border border-gray-100">
                    {product.imageUrl && (
                      <img
                        src={urlFor(product.imageUrl).url()}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Heart className="w-4 h-4 text-primary" />
                    </motion.button>
                  </div>
                </Link>

                <div className="space-y-1 px-1">
                  <Link href={`/product/${product.slug}`}>
                    <h3 className="font-semibold text-sm md:text-base mb-1 hover:text-primary transition-colors line-clamp-1 text-gray-900">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-primary font-bold text-sm md:text-base">Rs. {product.price}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link href="/shop">
              <Button
                size="lg"
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10 px-8"
              >
                View All Dresses
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}