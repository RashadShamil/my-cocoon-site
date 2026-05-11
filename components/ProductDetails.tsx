"use client";

import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/button";
import { urlFor } from "@/sanity/lib/image";
import { useCart } from "@/context/CartContext"; 
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

// --- 🛠️ BRUTE FORCE ICONS (Inline SVGs) ---
const TruckIcon = (props: any) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>);
const ShieldCheckIcon = (props: any) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>);
const MessageCircle = (props: any) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>);
const MinusIcon = (props: any) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 12h14" /></svg>);
const PlusIcon = (props: any) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 12h14" /><path d="M12 5v14" /></svg>);
const UploadIcon = (props: any) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>);
const StarIcon = (props: any) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>);
const ShoppingCartIcon = (props: any) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></svg>);
const MailIcon = (props: any) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>);

interface Review {
  _id: string;
  name: string;
  rating: number;
  comment: string;
  _createdAt: string;
  images?: string[];
}

interface ProductProps {
  product: {
    _id: string;
    name: string;
    price: number;
    description: string;
    imageUrl: string;
    gallery?: string[];
    category: string;
    sizeOptions?: { size: string; price: number }[];
    colors?: { colorName: string; colorHex: string; imageUrl?: string; sizes: { size: string; price: number; stock: number }[] }[];
    reviews?: Review[];
    isSale?: boolean;
    originalPrice?: number;
  };
}

export default function ProductDetails({ product }: ProductProps) {
  const containerRef = useRef(null);
  
  // PARALLAX SETUP
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.5]);

  const [selectedColor, setSelectedColor] = useState<any | null>(product.colors && product.colors.length > 0 ? product.colors[0] : null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [currentPrice, setCurrentPrice] = useState(product.price);
  const [quantity, setQuantity] = useState(1);

  // Review State
  const [reviewList, setReviewList] = useState<Review[]>(product.reviews || []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addToCart, triggerFlyingAnimation } = useCart();
  const { isSignedIn } = useUser();
  const router = useRouter();

  // Form State
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewName, setReviewName] = useState("");
  const [reviewComment, setReviewComment] = useState("");

  const allImages = [product.imageUrl, ...(product.gallery || [])];
  const [mainImage, setMainImage] = useState(allImages[0]);

  const hasColors = product.colors && product.colors.length > 0;
  const availableSizes = hasColors && selectedColor ? selectedColor.sizes : (product.sizeOptions || []);

  const handleSizeSelect = (size: string, price?: number) => {
    setSelectedSize(size);
    if (price) setCurrentPrice(price);
  };
  
  const handleColorSelect = (color: any) => {
    setSelectedColor(color);
    setSelectedSize(null); // Reset size when color changes
    if (color.imageUrl) {
      setMainImage(color.imageUrl);
    } else {
      setMainImage(product.imageUrl);
    }
  };

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isSignedIn) {
      router.push("/login");
      return;
    }
    if (availableSizes.length > 0 && !selectedSize) {
      alert("Please select a size first!");
      return;
    }

    const buttonRect = e.currentTarget.getBoundingClientRect();
    triggerFlyingAnimation({
        imageUrl: product.imageUrl,
        startRect: {
            x: buttonRect.left,
            y: buttonRect.top,
            width: buttonRect.width,
            height: buttonRect.height
        }
    });

    for(let i = 0; i < quantity; i++) {
        const colorText = selectedColor ? ` (Color: ${selectedColor.colorName})` : "";
        addToCart({
            _id: product._id,
            name: `${product.name}${colorText}`,
            price: currentPrice,
            imageUrl: product.imageUrl,
        }, selectedSize || "Standard");
    }
  };

  const handleWhatsAppBuy = () => {
    if (availableSizes.length > 0 && !selectedSize) {
      alert("Please select a size first!");
      return;
    }
    const phoneNumber = "94701327373"; 
    const colorText = selectedColor ? ` (Color: ${selectedColor.colorName})` : "";
    const message = `Hi! I would like to order: ${product.name}${colorText} (Size: ${selectedSize || "Standard"})`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignedIn) {
        alert("Please login to write a review!");
        router.push("/login");
        return;
    }
    
    setIsSubmitting(true);

    try {
        const formData = new FormData();
        formData.append("productId", product._id);
        formData.append("name", reviewName);
        formData.append("rating", reviewRating.toString());
        formData.append("comment", reviewComment);
        
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput?.files?.[0]) {
            formData.append("image", fileInput.files[0]);
        }

        const response = await fetch('/api/reviews', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            const newReview: Review = {
                _id: Date.now().toString(),
                name: reviewName,
                rating: reviewRating,
                comment: reviewComment,
                _createdAt: new Date().toISOString(),
            };
            
            setReviewList([newReview, ...reviewList]);
            
            setReviewComment("");
            setReviewName("");
            setReviewRating(5);
            alert("Review submitted successfully!");
        } else {
            alert("Failed to submit review. Please try again.");
        }
    } catch (error) {
        console.error(error);
        alert("Something went wrong.");
    } finally {
        setIsSubmitting(false);
    }
  };

  const averageRating = reviewList.length > 0 
    ? (reviewList.reduce((acc, r) => acc + r.rating, 0) / reviewList.length).toFixed(1) 
    : "New";

  return (
    <div className="min-h-screen relative overflow-hidden" ref={containerRef}>
      <div className="fixed inset-0 z-[-20] h-full w-full bg-[url('/Pbanner-bg.jpg')] bg-cover bg-center bg-no-repeat md:hidden" />
      <motion.div style={{ y, opacity }} className="hidden md:block fixed top-0 left-0 w-full h-[150vh] -z-10">
        <img src="/banner-bg.jpg" alt="Background" className="w-full h-full object-cover" />
      </motion.div>

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto bg-white/80 backdrop-blur-md rounded-[3rem] p-6 md:p-12 shadow-2xl border border-white/50">
          
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
            {/* LEFT: Image System */}
            <div className="flex flex-col gap-4">
              <div className="relative h-[400px] md:h-[500px] bg-white rounded-3xl overflow-hidden shadow-sm border border-white">
                {mainImage && (
                  <Image src={urlFor(mainImage).url()} alt={product.name} fill className="object-cover transition-all duration-500" />
                )}
              </div>
              {allImages.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {allImages.map((img, index) => (
                    <button 
                      key={index} 
                      onClick={() => setMainImage(img)} 
                      suppressHydrationWarning={true} // ✅ Suppress warning
                      className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${mainImage === img ? "border-primary scale-105" : "border-transparent hover:border-pink-300"}`}
                    >
                      <Image src={urlFor(img).url()} alt={`View ${index}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT: Info & Actions */}
            <div className="flex flex-col">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex gap-2">
                      <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">{product.category}</span>
                      {product.isSale && (
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide animate-pulse">Sale</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-yellow-500 text-sm font-bold bg-yellow-50 px-2 py-1 rounded-lg">
                        <StarIcon className="w-4 h-4 fill-current" /> {averageRating}
                    </div>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-2">{product.name}</h1>
                <div className="flex items-baseline gap-3">
                  <p className="text-3xl font-bold text-primary">Rs. {currentPrice.toLocaleString()}</p>
                  {product.isSale && product.originalPrice && (
                    <p className="text-xl font-semibold text-gray-400 line-through">Rs. {product.originalPrice.toLocaleString()}</p>
                  )}
                </div>
              </div>

              <p className="text-gray-600 leading-relaxed mb-8 text-lg">{product.description}</p>

              {hasColors && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Select Color</h3>
                  <div className="flex flex-wrap gap-3">
                    {product.colors!.map((color, index) => (
                      <button 
                        key={index} 
                        onClick={() => handleColorSelect(color)} 
                        suppressHydrationWarning={true}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all duration-200 font-medium ${selectedColor?.colorName === color.colorName ? "border-primary bg-primary/5 shadow-md" : "border-gray-200 text-gray-600 hover:border-primary/50 bg-white"}`}
                      >
                        <span className="w-5 h-5 rounded-full border border-gray-200 shadow-inner" style={{ backgroundColor: color.colorHex }}></span>
                        <span className="text-sm font-bold text-gray-800">{color.colorName}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {availableSizes.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Select Size</h3>
                  <div className="flex flex-wrap gap-3">
                    {availableSizes.map((option: any, index: number) => {
                      const isOutOfStock = option.stock !== undefined && option.stock <= 0;
                      return (
                      <button 
                        key={index} 
                        onClick={() => !isOutOfStock && handleSizeSelect(option.size, option.price)} 
                        suppressHydrationWarning={true}
                        disabled={isOutOfStock}
                        className={`px-6 py-3 rounded-xl border-2 transition-all duration-200 font-medium ${isOutOfStock ? "opacity-50 cursor-not-allowed bg-gray-50 border-gray-200 text-gray-400" : selectedSize === option.size ? "border-primary bg-primary/5 text-primary scale-105 shadow-md" : "border-gray-200 text-gray-600 hover:border-primary/50 bg-white"}`}
                      >
                        <span className="block text-sm font-bold">{option.size}</span>
                        <span className="block text-xs opacity-70">Rs. {option.price}</span>
                        {isOutOfStock && <span className="block text-[10px] font-bold text-red-500 mt-1">Out of Stock</span>}
                      </button>
                    )})}
                  </div>
                </div>
              )}

              {/* Actions Row */}
              <div className="flex gap-3 mb-4">
                  {/* Quantity */}
                  <div className="flex items-center border border-gray-300 rounded-xl bg-gray-50 h-14 shrink-0">
                      <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                        className="px-3 h-full hover:bg-gray-200 text-gray-600 rounded-l-xl transition-colors"
                        suppressHydrationWarning={true} // ✅ Suppress warning
                      >
                          <MinusIcon className="w-4 h-4"/>
                      </button>
                      <span className="w-10 text-center font-bold text-gray-900 text-lg">{quantity}</span>
                      <button 
                        onClick={() => setQuantity(quantity + 1)} 
                        className="px-3 h-full hover:bg-gray-200 text-gray-600 rounded-r-xl transition-colors"
                        suppressHydrationWarning={true} // ✅ Suppress warning
                      >
                          <PlusIcon className="w-4 h-4"/>
                      </button>
                  </div>

                  {/* Add to Cart */}
                  <Button 
                    onClick={handleAddToCart} 
                    className="flex-1 h-14 bg-gray-900 hover:bg-black text-white shadow-md rounded-xl text-base font-semibold"
                    // @ts-ignore
                    suppressHydrationWarning={true}
                  >
                      <ShoppingCartIcon className="mr-2 h-5 w-5" /> Add to Cart
                  </Button>
              </div>

              {/* WhatsApp Button */}
              <Button 
                onClick={handleWhatsAppBuy} 
                className="w-full h-14 bg-[#25D366] hover:bg-[#128C7E] text-white mb-8 transition-colors shadow-md hover:shadow-lg rounded-xl text-base font-semibold"
                // @ts-ignore
                suppressHydrationWarning={true}
              >
                <MailIcon className="mr-2 h-5 w-5" /> Order on WhatsApp
              </Button>

              <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex items-center gap-3"><TruckIcon className="w-5 h-5 text-primary" /> <span>Island-wide Delivery</span></div>
                <div className="flex items-center gap-3"><ShieldCheckIcon className="w-5 h-5 text-primary" /> <span>Quality Guaranteed</span></div>
              </div>
            </div>
          </div>

          {/* --- REVIEWS SECTION --- */}
          <div className="mt-24 pt-12 border-t border-gray-200">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Customer Reviews</h2>
                    <p className="text-gray-500 mt-2">See what others are saying about this look.</p>
                </div>
                <div className="text-right">
                    <span className="text-4xl font-bold text-primary">{averageRating}</span>
                    <div className="flex text-yellow-400 text-sm justify-end">
                       {[...Array(5)].map((_,i) => (<StarIcon key={i} className={`w-4 h-4 ${i < Math.round(Number(averageRating)) ? "fill-current" : "text-gray-200"}`} />))}
                    </div>
                    <span className="text-sm text-gray-400">{reviewList.length} ratings</span>
                </div>
             </div>

             <div className="grid lg:grid-cols-12 gap-12">
                <div className="lg:col-span-5">
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 sticky top-32">
                        <h3 className="font-bold text-xl mb-6 text-gray-900">Write a Review</h3>
                        
                        <form className="space-y-5" onSubmit={handleReviewSubmit}>
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Your Rating</label>
                                <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                <button 
                                  key={star} 
                                  type="button" 
                                  onClick={() => setReviewRating(star)} 
                                  suppressHydrationWarning={true} // ✅ Suppress warning
                                >
                                    <StarIcon className={`w-8 h-8 transition-colors ${star <= reviewRating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
                                </button>
                                ))}
                                </div>
                            </div>
                            <input 
                                type="text" 
                                placeholder="Your Name" 
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary focus:bg-white transition-all" 
                                value={reviewName} 
                                onChange={(e) => setReviewName(e.target.value)} 
                                required 
                                suppressHydrationWarning={true} // ✅ Suppress warning
                            />
                            <div className="relative group">
                                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer w-full z-10" />
                                <div className="w-full bg-gray-50 border border-gray-200 border-dashed rounded-xl px-4 py-4 text-gray-500 flex flex-col items-center justify-center gap-2 group-hover:bg-white group-hover:border-primary transition-all">
                                    <UploadIcon className="w-6 h-6 text-primary" /> <span className="text-sm">Click to upload a photo</span>
                                </div>
                            </div>
                            <textarea 
                                placeholder="Tell us what you think..." 
                                rows={4} 
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary focus:bg-white transition-all resize-none" 
                                value={reviewComment} 
                                onChange={(e) => setReviewComment(e.target.value)} 
                                required 
                                suppressHydrationWarning={true} // ✅ Suppress warning
                            />
                            <Button 
                                disabled={isSubmitting} 
                                className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl py-4 font-bold text-lg shadow-lg shadow-pink-200/50"
                                // @ts-ignore
                                suppressHydrationWarning={true}
                            >
                                {isSubmitting ? "Submitting..." : "Submit Review"}
                            </Button>
                        </form>
                    </div>
                </div>

                <div className="lg:col-span-7 space-y-6">
                    {reviewList.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">No reviews yet.</p>
                            <p className="text-sm text-gray-400">Be the first to share your thoughts!</p>
                        </div>
                    ) : (
                        reviewList.map((review) => (
                        <div key={review._id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center text-primary font-bold text-lg">
                                        {review.name ? review.name.charAt(0) : "A"}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">{review.name}</h4>
                                        <div className="flex text-yellow-400 text-xs">
                                            {[...Array(5)].map((_, i) => (<StarIcon key={i} className={`w-3 h-3 ${i < review.rating ? "fill-current" : "text-gray-200"}`} />))}
                                        </div>
                                    </div>
                                </div>
                                <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
                                    {new Date(review._createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-gray-600 leading-relaxed ml-13 pl-13">{review.comment}</p>
                            {review.images && review.images.length > 0 && (
                                <div className="flex gap-2 mt-4 ml-13 pl-13">
                                    {review.images.map((img, i) => (
                                        <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-100">
                                            {typeof img === 'string' ? null : <Image src={urlFor(img).url()} alt="review attachment" fill className="object-cover" />}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        ))
                    )}
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}