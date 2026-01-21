"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useUser } from "@clerk/nextjs"; // ✅ Import Clerk
import { syncCartToSanity, fetchCartFromSanity } from "@/app/api/actions/cart"; // ✅ Import Server Actions

export interface CartItem {
  _id: string
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  size?: string;
}

interface FlyingItemData {
  imageUrl: string;
  startRect: { x: number; y: number; width: number; height: number };
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: any, size?: string) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  isCartOpen: boolean;
  toggleCart: () => void;
  flyingItem: FlyingItemData | null;
  triggerFlyingAnimation: (data: FlyingItemData) => void;
  onAnimationComplete: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [flyingItem, setFlyingItem] = useState<FlyingItemData | null>(null);

  // ✅ Get User Data
  const { user, isSignedIn } = useUser();
  const userEmail = user?.emailAddresses[0]?.emailAddress;

  // 1️⃣ INITIAL LOAD: Local Storage (runs once)
  useEffect(() => {
    const savedCart = localStorage.getItem("cocoon-cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // 2️⃣ SYNC ON LOGIN: Fetch Cloud Cart when user signs in
  useEffect(() => {
    if (isSignedIn && userEmail) {
      const loadCloudCart = async () => {
        const cloudItems = await fetchCartFromSanity(userEmail);
        
        // Strategy: If cloud has items, use them. If cloud is empty but local has items, keep local (and it will sync next).
        if (cloudItems && cloudItems.length > 0) {
          setCart(cloudItems);
        }
      };
      loadCloudCart();
    }
  }, [isSignedIn, userEmail]);

  // 3️⃣ SAVE CHANGES: Update Local Storage AND Cloud (if logged in)
  useEffect(() => {
    // A. Always save to Local Storage
    localStorage.setItem("cocoon-cart", JSON.stringify(cart));

    // B. If Logged In, Sync to Sanity (Debounced slightly could be better, but direct is fine for now)
    if (isSignedIn && userEmail) {
      syncCartToSanity(userEmail, cart);
    }
  }, [cart, isSignedIn, userEmail]);

  const addToCart = (product: any, size: string = "Standard") => {
    setCart((prev) => {
      const existing = prev.find((item) => item._id === product._id && item.size === size);
      if (existing) {
        return prev.map((item) =>
          item._id === product._id && item.size === size ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { 
        _id: product._id, 
        name: product.name, 
        price: product.price, 
        imageUrl: product.imageUrl, 
        quantity: 1, 
        size 
      }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  const clearCart = () => setCart([]);
  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const triggerFlyingAnimation = (data: FlyingItemData) => setFlyingItem(data);
  const onAnimationComplete = () => setFlyingItem(null);

  return (
    <CartContext.Provider value={{ 
      cart, addToCart, removeFromCart, clearCart, cartTotal, cartCount, isCartOpen, toggleCart,
      flyingItem, triggerFlyingAnimation, onAnimationComplete 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};