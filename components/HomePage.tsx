"use client";

import { motion } from "framer-motion";
import { Sparkles, Heart, Star } from "lucide-react";
import { Button } from "@/components/button"; 
import Link from "next/link";
import { useEffect, useState } from "react";
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
    <div className="min-h-screen">
      {/* --- HERO SECTION --- */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6"
              >
                <Star className="w-4 h-4 text-primary fill-primary" />
                <span className="text-sm text-primary">New Collection 2026</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
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
                className="text-lg text-muted-foreground mb-8"
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
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
                    Shop Collection <Sparkles className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
                    Learn More
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Right Image Section (Hearts Removed) */}
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
                className="relative z-10 rounded-3xl overflow-hidden shadow-2xl max-w-sm mx-auto"
              >
                <img
                  src="/7.jpeg"
                  alt="Cocoon Collection"
                  className="w-full h-auto brightness-75"
                />
              </motion.div>
              {/* Floating Hearts Loop Removed */}
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- FEATURED PRODUCTS --- */}
      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

          {/* ✅ CHANGED: grid-cols-2 (mobile) and md:grid-cols-4 (desktop) makes items smaller */}
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
                  <div className="relative rounded-xl overflow-hidden bg-muted mb-3 aspect-[3/4]">
                    {product.imageUrl && (
                      <img
                        src={urlFor(product.imageUrl).url()}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute top-2 right-2 p-1.5 bg-card rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Heart className="w-4 h-4 text-primary" />
                    </motion.button>
                  </div>
                </Link>

                <Link href={`/product/${product.slug}`}>
                  <h3 className="font-semibold text-sm md:text-base mb-1 hover:text-primary transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                </Link>

                <p className="text-primary font-bold text-sm md:text-base">Rs. {product.price}</p>
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
                className="border-primary text-primary hover:bg-primary/10"
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