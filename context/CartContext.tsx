"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  size?: string;
}

// 1. Define shape for the flying animation data
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
  // 2. Add animation properties to context
  flyingItem: FlyingItemData | null;
  triggerFlyingAnimation: (data: FlyingItemData) => void;
  onAnimationComplete: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  // 3. State for the flying item
  const [flyingItem, setFlyingItem] = useState<FlyingItemData | null>(null);

  useEffect(() => {
    const savedCart = localStorage.getItem("cocoon-cart");
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem("cocoon-cart", JSON.stringify(cart));
  }, [cart]);

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
    // We remove setIsCartOpen(true) so the sidebar doesn't open immediately, allowing animation to be seen
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  const clearCart = () => setCart([]);
  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const toggleCart = () => setIsCartOpen(!isCartOpen);

  // 4. Animation helpers
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