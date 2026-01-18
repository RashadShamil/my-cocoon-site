"use client";

import { motion, AnimatePresence } from "framer-motion";
// ✅ THE FIX: We rename 'User' to 'UserIcon' right here in the import.
// If 'User' is red here, please try the 'npm i lucide-react@latest' step above.
import { ShoppingBag, Menu, X, Heart, Sparkles, User as UserIcon } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/button";
// Import Clerk hooks and components
import { useUser, UserButton } from "@clerk/nextjs";

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  
  // Get user data from Clerk
  // ✅ Because we renamed the icon in the imports, this 'user' variable is safe to use.
  const { isSignedIn, user, isLoaded } = useUser();

  // --- CART STATE PLACEHOLDER ---
  const cartItemCount = 0;


  // Detect scroll to shrink the navbar slightly
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
      >
        <motion.nav
          animate={{
            width: isScrolled ? "90%" : "95%",
            padding: isScrolled ? "0.75rem 1.5rem" : "1rem 2rem",
          }}
          className="max-w-7xl rounded-full bg-white/70 backdrop-blur-md border border-white/50 shadow-lg shadow-pink-100/50 flex items-center justify-between"
        >
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <motion.img
                src="/logo.png"
                alt="Cocoon"
                className="h-10 w-auto relative z-10"
                whileHover={{ rotate: 10, scale: 1.1 }}
              />
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Cocoon Kids
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1 bg-white/50 p-1 rounded-full border border-white/50">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href} className="relative px-5 py-2 rounded-full text-sm font-medium transition-colors">
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-primary rounded-full shadow-md shadow-primary/30"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10 text-muted-foreground hover:text-primary" style={{ color: isActive ? 'white' : undefined }}>
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            
            {/* Dynamic Auth Section (Desktop) */}
            <div className="hidden md:flex items-center gap-3 mr-2">
              {!isLoaded ? (
                <div className="w-20 h-8 bg-gray-100 animate-pulse rounded-full" />
              ) : isSignedIn ? (
                <div className="flex items-center gap-2 pl-4 pr-1 py-1 bg-white/50 rounded-full border border-white/50">
                  <span className="text-sm font-medium text-gray-700">
                    Hello, {user.firstName || user.username || "Princess"}
                  </span>
                  <UserButton afterSignOutUrl="/" appearance={{
                    elements: { userButtonAvatarBox: "w-8 h-8" }
                  }}/>
                </div>
              ) : (
                <Link href="/login">
                    <Button variant="ghost" className="rounded-full hover:bg-pink-50 text-primary font-semibold flex items-center gap-2">
                      {/* ✅ Using the renamed component: UserIcon */}
                      <UserIcon className="w-4 h-4" />
                      Login
                    </Button>
                </Link>
              )}
            </div>


            {/* Cart button */}
            {isSignedIn && (
              <Link href="/cart">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative p-2.5 rounded-full bg-pink-50 text-primary border border-pink-100 hover:bg-primary hover:text-white transition-colors group"
                >
                  <ShoppingBag size={20} />
                  {cartItemCount > 0 && (
                    <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-[10px] text-white flex items-center justify-center rounded-full border-2 border-white">
                      {cartItemCount}
                    </span>
                  )}
                </motion.button>
              </Link>
            )}


            {/* Mobile Menu Toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-full text-muted-foreground hover:bg-pink-50 hover:text-primary transition-colors"
            >
              <Menu size={24} />
            </motion.button>
          </div>
        </motion.nav>
      </motion.header>

      {/* Mobile Fullscreen Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-6 right-6 p-3 rounded-full bg-pink-50 text-primary hover:bg-primary hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            {/* Background Decor */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <Sparkles className="absolute top-20 left-10 text-pink-200 w-20 h-20 opacity-50" />
                <Heart className="absolute bottom-20 right-10 text-pink-100 w-32 h-32 opacity-50" />
            </div>

            {/* Mobile Links */}
            <nav className="flex flex-col gap-6 text-center relative z-10">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-3xl font-bold ${
                      pathname === item.href ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
              
              {/* Dynamic Auth Section (Mobile) */}
               <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: navItems.length * 0.1 }}
                  className="pt-6"
                >
                  {!isLoaded ? null : isSignedIn ? (
                     <div className="flex flex-col items-center gap-4 p-4 bg-white/50 rounded-2xl">
                         <span className="text-xl font-medium text-gray-700">
                           Hello, {user.firstName || user.username}
                         </span>
                         <div onClick={() => setIsMobileMenuOpen(false)}>
                            <UserButton afterSignOutUrl="/"/>
                         </div>
                     </div>
                  ) : (
                     <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="outline" className="rounded-full px-8 py-6 text-lg border-primary text-primary hover:bg-pink-50 flex items-center gap-2">
                           {/* ✅ Using the renamed component: UserIcon */}
                           <UserIcon className="w-5 h-5" /> Login / Sign Up
                        </Button>
                     </Link>
                  )}
               </motion.div>

            </nav>

            {/* View Cart Button (Mobile) */}
            {isSignedIn && (
              <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-8 w-full max-w-xs"
              >
                <Link href="/cart" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="rounded-full px-8 py-6 text-lg bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 w-full">
                      View Cart {cartItemCount > 0 && `(${cartItemCount})`}
                  </Button>
                </Link>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}