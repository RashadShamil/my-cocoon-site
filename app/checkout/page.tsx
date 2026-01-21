"use client";

import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/button";
import { urlFor } from "@/sanity/lib/image";

// --- 🚚 SHIPPING RATES ---
const SHIPPING_RATES: { [key: string]: number } = {
  "Colombo": 350, "Gampaha": 400, "Kalutara": 400, "Kandy": 500, "Galle": 500,
  "Matara": 500, "Hambantota": 550, "Jaffna": 650, "Kilinochchi": 650,
  "Mannar": 650, "Vavuniya": 600, "Mullaitivu": 650, "Batticaloa": 600,
  "Ampara": 600, "Trincomalee": 600, "Kurunegala": 450, "Puttalam": 500,
  "Anuradhapura": 550, "Polonnaruwa": 550, "Badulla": 550, "Monaragala": 550,
  "Ratnapura": 450, "Kegalle": 450, "Matale": 500, "Nuwara Eliya": 550,
};

// --- 🛠️ ICONS ---
const LockIcon = (props: any) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>);
const CreditCardIcon = (props: any) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>);
const CashIcon = (props: any) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="14" x="2" y="5" rx="2"/><path d="M16 21V5"/><path d="M12 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"/><path d="M8 5v14"/></svg>);
const ArrowLeftIcon = (props: any) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>);
const ShieldCheckIcon = (props: any) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>);

export default function CheckoutPage() {
  const containerRef = useRef(null);
  const router = useRouter();
  const { cart, cartTotal, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // State
  const [shippingCost, setShippingCost] = useState(0);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");

  // ✅ PayHere Form Data (To submit dynamically)
  const [payhereData, setPayhereData] = useState<any>(null);
  const payhereFormRef = useRef<HTMLFormElement>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    district: "", 
    phone: "",
  });

  // --- PARALLAX SETUP ---
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.5]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "district") {
      setSelectedDistrict(value);
      setShippingCost(SHIPPING_RATES[value] || 0);
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDistrict) { alert("Please select a delivery district."); return; }

    setIsProcessing(true);

    try {
        const finalTotal = cartTotal + shippingCost;

        // 1. Create Order in Sanity
        const createOrderResponse = await fetch('/api/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                cart, 
                formData, 
                total: finalTotal,
                paymentMethod
            }),
        });

        const orderData = await createOrderResponse.json();

        if (!createOrderResponse.ok) {
            alert("Failed to create order. Please try again.");
            setIsProcessing(false);
            return;
        }

        // 2. Handle Routing
        if (paymentMethod === 'cod') {
            clearCart();
            router.push(`/success?orderId=${orderData.orderId}`);
        } else {
            // ✅ ONLINE PAYMENT: Prepare PayHere Data
            
            // Get the secure hash from our API
            const hashResponse = await fetch('/api/payhere-hash', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    order_id: orderData.orderId,
                    amount: finalTotal,
                    currency: "LKR"
                }),
            });
            const { hash } = await hashResponse.json();

            // Set data for the hidden form
            setPayhereData({
                merchant_id: process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID,
                return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?orderId=${orderData.orderId}`,
                cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
                notify_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payhere-notify`, // We will create this later for webhook
                order_id: orderData.orderId,
                items: "Cocoon Kids Order",
                currency: "LKR",
                amount: finalTotal,
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                city: formData.district,
                country: "Sri Lanka",
                hash: hash,
            });

            // Wait a tick for state to update, then submit the form automatically
            setTimeout(() => {
                payhereFormRef.current?.submit();
            }, 100);
        }

    } catch (error) {
        console.error(error);
        alert("Something went wrong.");
        setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
        <Link href="/shop"><Button className="bg-primary text-white rounded-full px-8 py-3">Return to Shop</Button></Link>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen relative overflow-hidden">
      
      {/* Background Layers */}
      <div className="fixed inset-0 z-[-20] h-full w-full bg-[url('/Pbanner-bg.jpg')] bg-cover bg-center bg-no-repeat md:hidden" />
      <motion.div style={{ y, opacity }} className="hidden md:block fixed top-0 left-0 w-full h-[150vh] -z-10">
        <img src="/banner-bg.jpg" alt="Background" className="w-full h-full object-cover object-top" />
      </motion.div>

      {/* ✅ HIDDEN FORM FOR PAYHERE */}
      {payhereData && (
        <form ref={payhereFormRef} method="post" action="https://sandbox.payhere.lk/pay/checkout" className="hidden">
            {Object.keys(payhereData).map((key) => (
                <input key={key} type="hidden" name={key} value={payhereData[key]} />
            ))}
        </form>
      )}

      <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          
          <div className="mb-8">
            <Link href="/cart" className="inline-flex items-center text-gray-600 hover:text-primary transition-colors bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              <ArrowLeftIcon className="w-4 h-4 mr-2" /> Back to Cart
            </Link>
          </div>

          <div className="grid lg:grid-cols-12 gap-8">
            
            {/* LEFT: Shipping Form */}
            <div className="lg:col-span-7">
              <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-xl border border-white">
                <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                        <LockIcon className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Secure Checkout</h2>
                        <p className="text-sm text-gray-500">Please enter your shipping details</p>
                    </div>
                </div>

                <form onSubmit={handlePayment} className="space-y-5">
                  {/* ... FORM FIELDS (Same as before) ... */}
                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-gray-500 ml-1">First Name</label>
                        <input name="firstName" required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary focus:bg-white transition-all" placeholder="John" onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-gray-500 ml-1">Last Name</label>
                        <input name="lastName" required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary focus:bg-white transition-all" placeholder="Doe" onChange={handleInputChange} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-500 ml-1">Email Address</label>
                    <input name="email" type="email" required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary focus:bg-white transition-all" placeholder="john@example.com" onChange={handleInputChange} />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-500 ml-1">Phone Number</label>
                    <input name="phone" type="tel" required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary focus:bg-white transition-all" placeholder="077 123 4567" onChange={handleInputChange} />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-500 ml-1">Shipping Address</label>
                    <input name="address" required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary focus:bg-white transition-all" placeholder="123 Lotus Road" onChange={handleInputChange} />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-500 ml-1">District (Delivery Calculation)</label>
                    <div className="relative">
                        <select name="district" required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary focus:bg-white transition-all appearance-none cursor-pointer" onChange={handleInputChange} value={selectedDistrict}>
                            <option value="" disabled>Select your district</option>
                            {Object.keys(SHIPPING_RATES).sort().map((district) => (
                                <option key={district} value={district}>{district} - Rs. {SHIPPING_RATES[district]}</option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg></div>
                    </div>
                  </div>

                  {/* PAYMENT METHOD */}
                  <div className="pt-4">
                    <label className="text-xs font-bold uppercase text-gray-500 ml-1 mb-3 block">Select Payment Method</label>
                    <div className="grid grid-cols-2 gap-4">
                        <div onClick={() => setPaymentMethod("cod")} className={`cursor-pointer rounded-2xl p-4 border-2 transition-all flex flex-col items-center justify-center gap-2 text-center ${paymentMethod === "cod" ? "border-primary bg-pink-50/50" : "border-gray-100 hover:border-gray-200"}`}>
                            <CashIcon className={`w-8 h-8 ${paymentMethod === "cod" ? "text-primary" : "text-gray-400"}`} />
                            <span className={`text-sm font-bold ${paymentMethod === "cod" ? "text-primary" : "text-gray-600"}`}>Cash on Delivery</span>
                        </div>
                        <div onClick={() => setPaymentMethod("online")} className={`cursor-pointer rounded-2xl p-4 border-2 transition-all flex flex-col items-center justify-center gap-2 text-center ${paymentMethod === "online" ? "border-primary bg-pink-50/50" : "border-gray-100 hover:border-gray-200"}`}>
                            <CreditCardIcon className={`w-8 h-8 ${paymentMethod === "online" ? "text-primary" : "text-gray-400"}`} />
                            <span className={`text-sm font-bold ${paymentMethod === "online" ? "text-primary" : "text-gray-600"}`}>Online Payment</span>
                        </div>
                    </div>
                  </div>

                  <Button disabled={isProcessing} className="w-full py-6 text-lg bg-gray-900 hover:bg-black text-white rounded-xl shadow-lg mt-4 disabled:opacity-70 disabled:cursor-not-allowed">
                    {isProcessing ? "Processing..." : paymentMethod === 'cod' ? "Place Order" : "Proceed to PayHere"} 
                    {paymentMethod === 'online' && !isProcessing && <CreditCardIcon className="ml-2 w-5 h-5" />}
                  </Button>

                  <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1 mt-4">
                    <ShieldCheckIcon className="w-3 h-3" /> Payments are 256-bit encrypted and secure.
                  </p>
                </form>
              </div>
            </div>

            {/* RIGHT: Order Summary */}
            <div className="lg:col-span-5">
              <div className="bg-white/90 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-xl border border-white sticky top-32">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
                <div className="max-h-[300px] overflow-y-auto pr-2 space-y-4 mb-6 custom-scrollbar">
                  {cart.map((item) => (
                    <div key={item._id} className="flex gap-4 items-center border-b border-dashed border-gray-200 pb-4">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                            <Image src={urlFor(item.imageUrl).url()} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-sm font-bold text-gray-900 line-clamp-1">{item.name}</h4>
                            <p className="text-xs text-gray-500">Size: {item.size} | Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-bold text-primary">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-3 pt-2">
                    <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>Rs. {cartTotal.toLocaleString()}</span></div>
                    <div className="flex justify-between text-gray-600">
                        <span>Shipping ({selectedDistrict || "Select District"})</span>
                        <span className="text-green-600 font-medium">{shippingCost > 0 ? `Rs. ${shippingCost}` : "--"}</span>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                        <span className="text-lg font-bold text-gray-900">Total</span>
                        <span className="text-2xl font-bold text-primary">Rs. {(cartTotal + shippingCost).toLocaleString()}</span>
                    </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}