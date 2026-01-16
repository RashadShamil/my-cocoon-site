"use client";

import { useState } from "react";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
// ✅ FIX: Using only "Safe" icons that definitely exist in your version
import { Star, MapPin, Mail } from "lucide-react";
import { Button } from "@/components/button"; 

interface ProductProps {
  product: {
    name: string;
    price: number;
    description: string;
    imageUrl: string;
    gallery?: string[];
    category: string;
    sizeOptions?: { size: string; price: number }[];
  };
}

export default function ProductDetails({ product }: ProductProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [currentPrice, setCurrentPrice] = useState(product.price);

  // Combine images
  const allImages = [product.imageUrl, ...(product.gallery || [])];
  
  // Track the active image
  const [mainImage, setMainImage] = useState(allImages[0]);

  const handleSizeSelect = (size: string, price: number) => {
    setSelectedSize(size);
    setCurrentPrice(price);
  };

  const handleBuyNow = () => {
    if (product.sizeOptions && product.sizeOptions.length > 0 && !selectedSize) {
      alert("Please select a size first!");
      return;
    }

    const phoneNumber = "94773834674"; 
    const message = `Hi Cocoon Kids! 🦋\n\nI would like to order:\n*${product.name}*\nPrice: Rs. ${currentPrice}\nSize: ${selectedSize || "Standard"}\n\nPlease confirm availability.`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="grid md:grid-cols-2 gap-12">
      
      {/* LEFT: Image System */}
      <div className="flex flex-col gap-4">
        
        {/* 1. BIG IMAGE */}
        <div className="relative h-[400px] md:h-[500px] bg-pink-50 rounded-3xl overflow-hidden shadow-sm">
          {mainImage && (
            <Image
              src={urlFor(mainImage).url()} 
              alt={product.name}
              fill
              className="object-cover transition-all duration-500"
            />
          )}
        </div>

        {/* 2. THUMBNAILS ROW */}
        {allImages.length > 1 && (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {allImages.map((img, index) => (
              <button
                key={index}
                onClick={() => setMainImage(img)}
                className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                  mainImage === img 
                    ? "border-pink-500 scale-105" 
                    : "border-transparent hover:border-pink-300"
                }`}
              >
                <Image
                  src={urlFor(img).url()}
                  alt={`View ${index}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT: Details */}
      <div className="flex flex-col justify-center">
        <div className="mb-6">
          <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm font-semibold uppercase tracking-wide">
            {product.category}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4 mb-2">
            {product.name}
          </h1>
          <p className="text-3xl font-bold text-primary">
            Rs. {currentPrice}
          </p>
        </div>

        <p className="text-gray-600 leading-relaxed mb-8 text-lg">
          {product.description}
        </p>

        {/* Size Selector */}
        {product.sizeOptions && product.sizeOptions.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">
              Select Size
            </h3>
            <div className="flex flex-wrap gap-3">
              {product.sizeOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleSizeSelect(option.size, option.price)}
                  className={`px-6 py-3 rounded-xl border-2 transition-all duration-200 font-medium ${
                    selectedSize === option.size
                      ? "border-primary bg-primary/5 text-primary scale-105"
                      : "border-gray-200 text-gray-600 hover:border-primary/50"
                  }`}
                >
                  <span className="block text-sm font-bold">{option.size}</span>
                  <span className="block text-xs opacity-70">Rs. {option.price}</span>
                </button>
              ))}
            </div>
            {!selectedSize && (
              <p className="text-red-500 text-sm mt-2 animate-pulse">
                * Please select a size
              </p>
            )}
          </div>
        )}

        <Button 
          size="lg" 
          onClick={handleBuyNow}
          className="w-full py-8 text-xl bg-[#25D366] hover:bg-[#128C7E] text-white mb-8 transition-colors shadow-lg hover:shadow-xl"
        >
          {/* ✅ FIX: Using Mail (Safe Icon) */}
          <Mail className="mr-2 h-6 w-6" />
          Order on WhatsApp
        </Button>

        <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 bg-gray-50 p-4 rounded-xl">
          <div className="flex items-center gap-3">
            {/* ✅ FIX: Using MapPin (Safe Icon) */}
            <MapPin className="w-5 h-5 text-primary" />
            <span>Island-wide Delivery</span>
          </div>
          <div className="flex items-center gap-3">
            {/* ✅ FIX: Reusing Star (Safe Icon) */}
            <Star className="w-5 h-5 text-primary" />
            <span>Premium Material</span>
          </div>
        </div>
      </div>
    </div>
  );
}