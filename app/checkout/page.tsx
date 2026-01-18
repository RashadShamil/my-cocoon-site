"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
// REMOVED problematic icons from this import
import { ShoppingBag, MapPin, Sparkles, ArrowRight } from "lucide-react";

import Link from "next/link";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
// import { urlFor } from "@/sanity/lib/image"; 

// --- INLINE SVG ICONS (Workaround for package issues) ---
const CreditCardIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
);

const TruckIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>
);

const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 6 9 17l-5-5"/></svg>
);
// -------------------------------------------------------


const MOCK_CART_ITEMS = [
  {
    id: "1",
    name: "Flora Pink Butterfly Frock",
    price: 4500,
    quantity: 1,
    size: "4-5Y",
    imageUrl: "placeholder", 
  },
  {
    id: "2",
    name: "Elegant White Lace Dress",
    price: 5200,
    quantity: 1,
    size: "6-7Y",
    imageUrl: "placeholder",
  },
];

export default function CheckoutPage() {
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const subtotal = MOCK_CART_ITEMS.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = 350;
  const total = subtotal + shipping;


  async function onPlaceOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert("Payment integration would happen here! Redirecting to success...");
    }, 2000);
  }

  return (
    <div ref={containerRef} className="min-h-screen relative overflow-hidden">
      
      <div 
        className="fixed inset-0 z-[-20] h-full w-full bg-[url('/Pbanner-bg.jpg')] bg-cover bg-center bg-no-repeat md:hidden"
      />
      <motion.div 
        style={{ y }} 
        className="hidden md:block fixed top-0 left-0 w-full h-[150vh] -z-10"
      >
        <img
          src="/banner-bg.jpg"
          alt="Background"
          className="w-full h-full object-cover object-top" 
        />
      </motion.div>

      <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Checkout
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Complete your order and bring the magic home.
            </p>
          </motion.div>


          <form onSubmit={onPlaceOrder}>
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">

            {/* ==================== LEFT COLUMN: FORMS ==================== */}
            <motion.div 
              className="lg:col-span-7 space-y-8"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              
              {/* ----- Section 1: Contact Info ----- */}
              <div className="bg-white/70 backdrop-blur-xl p-8 rounded-[2rem] shadow-lg border border-white/60">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-primary/10 rounded-full text-primary">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Contact Information</h2>
                </div>
                 <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-gray-700">Email Address</label>
                        <Input type="email" placeholder="email@example.com" required className="bg-white/80 border-gray-200 py-5 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">First Name</label>
                        <Input type="text" placeholder="Jane" required className="bg-white/80 border-gray-200 py-5 rounded-xl" />
                    </div>
                     <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Last Name</label>
                        <Input type="text" placeholder="Doe" required className="bg-white/80 border-gray-200 py-5 rounded-xl" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-gray-700">Phone Number</label>
                        <Input type="tel" placeholder="+94 77 123 4567" required className="bg-white/80 border-gray-200 py-5 rounded-xl" />
                    </div>
                 </div>
              </div>


              {/* ----- Section 2: Shipping Address ----- */}
              <div className="bg-white/70 backdrop-blur-xl p-8 rounded-[2rem] shadow-lg border border-white/60">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-primary/10 rounded-full text-primary">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Shipping Address</h2>
                </div>
                 <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-gray-700">Address Line 1</label>
                        <Input type="text" placeholder="123 Main St" required className="bg-white/80 border-gray-200 py-5 rounded-xl" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-gray-700">Address Line 2 (Optional)</label>
                        <Input type="text" placeholder="Apartment, suite, etc." className="bg-white/80 border-gray-200 py-5 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">City</label>
                        <Input type="text" placeholder="Colombo" required className="bg-white/80 border-gray-200 py-5 rounded-xl" />
                    </div>
                     <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Postal Code</label>
                        <Input type="text" placeholder="10000" required className="bg-white/80 border-gray-200 py-5 rounded-xl" />
                    </div>
                 </div>
              </div>
              
              {/* ----- Section 3: Delivery Method ----- */}
               <div className="bg-white/70 backdrop-blur-xl p-8 rounded-[2rem] shadow-lg border border-white/60">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-primary/10 rounded-full text-primary">
                    {/* ✅ Using Inline SVG Component */}
                    <TruckIcon className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Delivery Method</h2>
                </div>
                 <div className="flex items-center justify-between p-4 rounded-xl border-2 border-primary bg-primary/5">
                    <div className="flex items-center gap-3">
                        {/* ✅ Using Inline SVG Component */}
                        <TruckIcon className="w-5 h-5 text-primary" />
                        <div>
                            <p className="font-semibold text-gray-900">Standard Islandwide Delivery</p>
                            <p className="text-sm text-muted-foreground">Estimated 2-5 working days</p>
                        </div>
                    </div>
                    <span className="font-bold text-primary">Rs. {shipping.toLocaleString()}</span>
                 </div>
              </div>

              {/* ----- Section 4: Payment (Placeholder) ----- */}
              <div className="bg-white/70 backdrop-blur-xl p-8 rounded-[2rem] shadow-lg border border-white/60 opacity-70">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-primary/10 rounded-full text-primary">
                    {/* ✅ Using Inline SVG Component */}
                    <CreditCardIcon className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Payment Details</h2>
                </div>
                <p className="text-muted-foreground italic mb-4">
                    (Secure payment gateway will be integrated here in the next phase)
                </p>
                <div className="flex gap-2">
                    <div className="h-8 w-12 bg-gray-200 rounded-md animate-pulse"></div>
                    <div className="h-8 w-12 bg-gray-200 rounded-md animate-pulse"></div>
                    <div className="h-8 w-12 bg-gray-200 rounded-md animate-pulse"></div>
                </div>
              </div>

            </motion.div>


            {/* ==================== RIGHT COLUMN: ORDER SUMMARY ==================== */}
            <motion.div 
              className="lg:col-span-5 lg:sticky lg:top-32"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
               <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl border border-white/60 relative overflow-hidden">
                   <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-[80px]" />

                  <div className="flex items-center gap-3 mb-6 relative">
                     <div className="p-2 bg-primary/10 rounded-full text-primary">
                      <ShoppingBag className="w-5 h-5" />
                     </div>
                     <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
                  </div>

                  <div className="max-h-[40vh] overflow-auto pr-2 mb-6 space-y-4 relative">
                    {MOCK_CART_ITEMS.map((item) => (
                        <div key={item.id} className="flex gap-4 items-center py-2 border-b border-gray-100 last:border-0">
                            <div className="relative w-16 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                                <div className="w-full h-full bg-pink-100 animate-pulse" />
                                <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-primary text-white text-xs font-bold rounded-full shadow-sm">
                                    {item.quantity}
                                </span>
                            </div>
                            
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm">{item.name}</h3>
                                <p className="text-xs text-muted-foreground">Size: {item.size}</p>
                            </div>
                            
                             <p className="font-bold text-gray-900 text-sm">
                                Rs. {(item.price * item.quantity).toLocaleString()}
                             </p>
                        </div>
                    ))}
                  </div>

                  <div className="flex gap-2 mb-6 relative">
                    <Input placeholder="Discount code" className="bg-white/80 border-gray-200 rounded-xl" />
                    <Button variant="outline" className="border-gray-200 hover:bg-gray-50 hover:text-primary rounded-xl">Apply</Button>
                  </div>

                  <div className="space-y-3 py-4 border-t border-gray-200 relative">
                    <div className="flex justify-between text-muted-foreground">
                        <span>Subtotal</span>
                        <span>Rs. {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                        <span>Shipping</span>
                        <span>Rs. {shipping.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg text-gray-900 pt-3 border-t border-gray-200">
                        <span>Total</span>
                        <span className="text-primary">Rs. {total.toLocaleString()}</span>
                    </div>
                  </div>

                  <Button disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 text-white py-6 rounded-[1.5rem] text-lg shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] mt-6">
                    {isLoading ? (
                        <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        /* ✅ Using Inline SVG Component */
                        <CheckIcon className="mr-2 h-5 w-5" />
                    )}
                    Place Order
                  </Button>
                  
                  <div className="text-center mt-4 relative">
                      <Link href="/shop" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-1">
                        Continue Shopping <ArrowRight className="w-4 h-4" />
                      </Link>
                  </div>

               </div>
            </motion.div>

          </div>
          </form>

        </div>
      </div>
    </div>
  );
}