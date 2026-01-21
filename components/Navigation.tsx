"use client";

import { motion, AnimatePresence, Variants } from "framer-motion"; // ✅ Added Variants import
import { ShoppingBag, Menu, X, Heart, Sparkles } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/button";
import { useUser, UserButton, SignOutButton } from "@clerk/nextjs";
import { useCart } from "@/context/CartContext";
import { urlFor } from "@/sanity/lib/image";

// --- HARDCODED ICONS (Inline SVGs) ---
const UserIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
);
const LogOutIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
);
const PackageIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m7.5 4.27 9 5.15" /><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22v-10" /></svg>
);
// ----------------------------------------

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isSignedIn, user, isLoaded } = useUser();
  
  const { cartCount, flyingItem, onAnimationComplete } = useCart();
  const cartRef = useRef<HTMLButtonElement>(null); 

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const getTargetPosition = () => {
    if (cartRef.current) {
      const rect = cartRef.current.getBoundingClientRect();
      return { x: rect.left, y: rect.top };
    }
    return { x: 0, y: 0 }; 
  };

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  // ✅ FIX: Explicitly type these as 'Variants' to satisfy TypeScript
  const menuVariants: Variants = {
    closed: { opacity: 0, clipPath: "circle(0% at 100% 0%)" },
    open: { 
      opacity: 1, 
      clipPath: "circle(150% at 100% 0%)",
      transition: { type: "spring", stiffness: 20, damping: 10 }
    }
  };

  const linkVariants: Variants = {
    closed: { x: 50, opacity: 0 },
    open: (i: number) => ({ 
      x: 0, 
      opacity: 1,
      transition: { delay: 0.1 + (i * 0.1), type: "spring", stiffness: 50 }
    })
  };

  return (
    <>
      {/* --- FLYING ANIMATION LAYER --- */}
      {flyingItem && (
        <motion.img
          src={urlFor(flyingItem.imageUrl).url()}
          initial={{ 
            position: "fixed",
            left: flyingItem.startRect.x,
            top: flyingItem.startRect.y,
            width: flyingItem.startRect.width,
            height: flyingItem.startRect.height,
            opacity: 1,
            zIndex: 100,
            borderRadius: "1rem",
            pointerEvents: "none"
          }}
          animate={{ 
            left: getTargetPosition().x, 
            top: getTargetPosition().y, 
            width: 20, 
            height: 20, 
            opacity: 0.5 
          }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          onAnimationComplete={onAnimationComplete}
          className="fixed z-[100] shadow-2xl pointer-events-none object-cover"
        />
      )}

      <motion.header
        className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4 pointer-events-none"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
      >
        <motion.nav
          animate={{
            width: isScrolled ? "90%" : "95%",
            padding: isScrolled ? "0.75rem 1.5rem" : "1rem 2rem",
          }}
          className="pointer-events-auto max-w-7xl rounded-full bg-white/70 backdrop-blur-md border border-white/50 shadow-lg shadow-pink-100/50 flex items-center justify-between"
        >
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <motion.img src="/logo.png" alt="Cocoon" className="h-10 w-auto relative z-10" whileHover={{ rotate: 10, scale: 1.1 }} />
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Cocoon Kids</span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1 bg-white/50 p-1 rounded-full border border-white/50">
            {navItems.map((item) => {
              const isActive = isMounted && pathname === item.href;
              return (
                <Link key={item.href} href={item.href} className="relative px-5 py-2 rounded-full text-sm font-medium transition-colors">
                  {isActive && <motion.div layoutId="nav-pill" className="absolute inset-0 bg-primary rounded-full shadow-md shadow-primary/30" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />}
                  <span className="relative z-10 text-muted-foreground hover:text-primary" style={{ color: isActive ? 'white' : undefined }}>{item.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-3 mr-2">
              {!isLoaded ? ( <div className="w-20 h-8 bg-gray-100 animate-pulse rounded-full" /> ) : isSignedIn ? (
                <div className="flex items-center gap-3 pl-4 pr-2 py-1 bg-white/50 rounded-full border border-white/50">
                  <span className="text-sm font-medium text-gray-700">{user.firstName || user.username}</span>
                  <UserButton afterSignOutUrl="/" appearance={{ elements: { userButtonAvatarBox: "w-8 h-8" } }}/>
                  <div className="h-6 w-[1px] bg-gray-300 mx-1"></div>
                  <SignOutButton><button className="text-gray-500 hover:text-red-500 transition-colors p-1" title="Log Out"><LogOutIcon className="w-5 h-5" /></button></SignOutButton>
                </div>
              ) : (
                <Link href="/login"><Button variant="ghost" className="rounded-full hover:bg-pink-50 text-primary font-semibold flex items-center gap-2"><UserIcon className="w-4 h-4" /> Login</Button></Link>
              )}
            </div>

            {/* Desktop My Orders */}
            {isSignedIn && (
              <Link href="/orders">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2.5 rounded-full bg-pink-50 text-primary border border-pink-100 hover:bg-primary hover:text-white transition-colors"
                  title="My Orders"
                >
                  <PackageIcon className="w-5 h-5" />
                </motion.button>
              </Link>
            )}

            {/* Cart button */}
            {isSignedIn && (
              <Link href="/cart">
                <motion.button
                  ref={cartRef}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  suppressHydrationWarning
                  className="relative p-2.5 rounded-full bg-pink-50 text-primary border border-pink-100 hover:bg-primary hover:text-white transition-colors group"
                >
                  <ShoppingBag size={20} />
                  
                  <AnimatePresence>
                    {cartCount > 0 && (
                        <motion.span 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            key={cartCount}
                            className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-[10px] text-white flex items-center justify-center rounded-full border-2 border-white"
                        >
                        {cartCount}
                        </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </Link>
            )}

            <motion.button whileTap={{ scale: 0.9 }} onClick={() => setIsMobileMenuOpen(true)} suppressHydrationWarning className="md:hidden p-2 rounded-full text-muted-foreground hover:bg-pink-50 hover:text-primary transition-colors">
              <Menu size={24} />
            </motion.button>
          </div>
        </motion.nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial="closed" 
            animate="open" 
            exit="closed" 
            variants={menuVariants}
            className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center"
          >
            {/* Parallax Background */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <motion.img 
                    src="/Pbanner-bg.jpg"
                    alt="Menu Background"
                    className="w-full h-full object-cover"
                    initial={{ scale: 1 }}
                    animate={{ scale: 1.1 }}
                    transition={{ duration: 10, repeat: Infinity, repeatType: "mirror", ease: "linear" }}
                />
                <div className="absolute inset-0 bg-white/70 backdrop-blur-xl" />
                <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-transparent to-pink-50/50" />
            </div>

            <button onClick={() => setIsMobileMenuOpen(false)} suppressHydrationWarning className="absolute top-6 right-6 p-3 rounded-full bg-pink-50 text-primary hover:bg-primary hover:text-white transition-colors z-20"><X size={24} /></button>
            
            {/* Decor */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
                <Sparkles className="absolute top-20 left-10 text-pink-200 w-20 h-20 opacity-50" />
                <Heart className="absolute bottom-20 right-10 text-pink-100 w-32 h-32 opacity-50" />
            </div>

            <nav className="flex flex-col gap-6 text-center relative z-20 w-full px-8">
                {navItems.map((item, i) => {
                    const isActive = pathname === item.href;
                    return (
                        <motion.div key={item.href} custom={i} variants={linkVariants} className="w-full text-center">
                            <Link href={item.href} onClick={() => setIsMobileMenuOpen(false)} className={`text-3xl font-bold tracking-tight ${isActive ? "text-primary" : "text-foreground"}`}>{item.name}</Link>
                            {isActive && <motion.div layoutId="mobile-underline" className="h-1 w-12 bg-primary rounded-full mx-auto mt-2" />}
                        </motion.div>
                    )
                })}

                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: navItems.length * 0.1 }} className="pt-6 w-full flex flex-col items-center">
                    {!isLoaded ? null : isSignedIn ? (
                        <div className="flex flex-col items-center gap-4 w-full">
                            <div className="flex items-center gap-3 bg-white/60 p-3 rounded-full shadow-sm border border-white">
                                <div onClick={() => setIsMobileMenuOpen(false)}><UserButton afterSignOutUrl="/"/></div>
                                <span className="text-xl font-medium text-gray-700">{user.firstName || user.username}</span>
                            </div>

                            {/* Mobile My Orders */}
                            <Link href="/orders" onClick={() => setIsMobileMenuOpen(false)} className="w-full max-w-xs">
                                <button className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-white/60 text-primary font-semibold rounded-full hover:bg-white transition-colors border border-white shadow-sm">
                                    <PackageIcon className="w-5 h-5" /> My Orders
                                </button>
                            </Link>

                            <SignOutButton>
                                <button className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-500 rounded-full hover:bg-red-100 font-semibold transition-colors"><LogOutIcon className="w-5 h-5" /> Log Out</button>
                            </SignOutButton>
                        </div>
                    ) : (
                        <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}><Button variant="outline" className="rounded-full px-8 py-6 text-lg border-primary text-primary hover:bg-pink-50 flex items-center gap-2"><UserIcon className="w-5 h-5" /> Login / Sign Up</Button></Link>
                    )}
                </motion.div>
            </nav>
            {isSignedIn && (
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="mt-8 w-full max-w-xs relative z-20">
                    <Link href="/cart" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button className="rounded-full px-8 py-6 text-lg bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 w-full">View Cart {cartCount > 0 && `(${cartCount})`}</Button>
                    </Link>
                </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}